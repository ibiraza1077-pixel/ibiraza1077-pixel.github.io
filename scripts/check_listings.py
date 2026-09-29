#!/usr/bin/env python3
"""Re-check hand-entered listings against their official pages.

Each listing in listings.json can have a "verify" list:
    "verify": [{"find": ["£3\\.99", "08:00 - 11:00"]},
               {"url": "https://other-page", "find": ["..."]}]
Every "find" entry is a case-insensitive regular expression that must appear on the page
(dashes and spaces are normalised first, so "10:00 - 18:00" also matches "10:00 – 18:00").

Outcomes per listing:
  ok           every fact still found            -> "checked" set to today, flag cleared
  changed      page loaded but a fact is missing -> status "check", "flag" explains what to look at
  unreachable  site blocked or down              -> left alone (ages out after 60 days in the app)
  manual       no "verify" rules                 -> left alone

Writes listings.json, checks.json (full report) and check-summary.md (for the GitHub issue).
Standard library only. Never tries to get round a site that blocks automated access.
"""
import html
import json
import re
import sys
import time
import urllib.request
from datetime import datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parent.parent
LONDON = ZoneInfo("Europe/London")
TODAY = datetime.now(LONDON).strftime("%Y-%m-%d")
STALE_DAYS = 60
UA = "Mozilla/5.0 (compatible; UniLondonChecker/1.0; +https://ibiraza1077-pixel.github.io/)"
BROWSER_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
_cache = {}


def page_text(url):
    if url in _cache:
        return _cache[url]
    result = (None, "not fetched")
    for attempt, ua in enumerate([BROWSER_UA, BROWSER_UA, UA]):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": ua, "Accept-Language": "en-GB,en;q=0.9", "Accept": "text/html,*/*;q=0.8"})
            with urllib.request.urlopen(req, timeout=30) as r:
                s = r.read().decode("utf-8", errors="replace")
            s = re.sub(r"<script.*?</script>|<style.*?</style>|<noscript.*?</noscript>", " ", s, flags=re.S | re.I)
            t = html.unescape(re.sub(r"<[^>]+>", " ", s))
            result = (normalise(t), None)
            break
        except urllib.error.HTTPError as e:
            result = (None, f"HTTP {e.code}")
            if e.code in (401, 403, 404, 410, 429):
                break  # blocked or gone: retrying won't help, and we don't try to get round blocks
        except Exception as e:  # noqa: BLE001
            result = (None, type(e).__name__)
        time.sleep(2 * (attempt + 1))
    _cache[url] = result
    return result


def normalise(t):
    t = t.replace(" ", " ").replace(" ", " ")
    t = re.sub(r"[‐-―−]", "-", t)          # all dash types -> "-"
    t = re.sub(r"[‘’]", "'", t)
    return re.sub(r"\s+", " ", t)


def check(listing):
    rules = listing.get("verify") or []
    if not rules:
        return {"result": "manual"}
    missing, errors, pages = [], [], 0
    for rule in rules:
        url = rule.get("url") or listing.get("url")
        text, err = page_text(url)
        if err:
            errors.append(f"{err} at {url}")
            continue
        pages += 1
        for pat in rule.get("find", []):
            if not re.search(normalise(pat), text, re.I):
                missing.append(pat)
    if errors and not pages:
        return {"result": "unreachable", "error": "; ".join(errors)}
    if missing:
        return {"result": "changed", "missing": missing, "error": "; ".join(errors) or None}
    return {"result": "ok"}


def human(pat):
    """Turn a regex back into something readable for the issue and the app."""
    s = re.sub(r"\\(.)", r"\1", pat)
    s = re.sub(r"\.\{\d*,?\d*\}|\.\*|\.\+", " … ", s)
    return s.replace("(", "").replace(")", "").replace("|", " or ").strip()


def main():
    path = ROOT / "listings.json"
    data = json.loads(path.read_text())
    report, counts = [], {"ok": 0, "changed": 0, "unreachable": 0, "manual": 0}
    for l in data["listings"]:
        r = check(l)
        r["id"], r["title"], r["url"] = l["id"], l["title"], l.get("url")
        counts[r["result"]] += 1
        if r["result"] == "ok":
            l["checked"], l["status"] = TODAY, "verified"
            l.pop("flag", None)
            l["autoChecked"] = True
        elif r["result"] == "changed":
            l["status"] = "check"
            l["flag"] = "The official page has changed since this was checked. Confirm the details there."
        age = (datetime.fromisoformat(TODAY) - datetime.fromisoformat(l.get("checked", TODAY))).days
        r["ageDays"] = age
        report.append(r)
        print(f"{r['result']:12} {l['id']:18} {('missing: ' + ', '.join(r.get('missing', []))) if r.get('missing') else r.get('error') or ''}")
    data["updated"] = max(l.get("checked", "") for l in data["listings"])
    path.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n")
    stamp = datetime.now(LONDON).strftime("%Y-%m-%dT%H:%M")
    (ROOT / "checks.json").write_text(json.dumps({"run": stamp, "counts": counts, "results": report}, ensure_ascii=False, indent=1) + "\n")

    # Markdown summary for the GitHub issue
    changed = [r for r in report if r["result"] == "changed"]
    due = [r for r in report if r["result"] in ("unreachable", "manual") and r["ageDays"] >= STALE_DAYS - 14]
    lines = [f"Automatic check on {stamp} (London time): **{counts['ok']} confirmed**, "
             f"**{counts['changed']} changed**, {counts['unreachable']} couldn't be reached, {counts['manual']} manual-only.", ""]
    if changed:
        lines += ["## Changed on the official page", "These are flagged in the app until you fix them in `admin.html` (edit, then *Mark checked today*).", ""]
        for r in changed:
            lines.append(f"- [ ] **{r['title']}** (`{r['id']}`): couldn't find {', '.join('`' + human(m) + '`' for m in r['missing'])} on [the official page]({r['url']})")
        lines.append("")
    if due:
        lines += ["## Needs a manual check soon", f"These sites block automated checks. They get flagged in the app {STALE_DAYS} days after their last check.", ""]
        for r in due:
            lines.append(f"- [ ] **{r['title']}** (`{r['id']}`): last checked {r['ageDays']} days ago, [official page]({r['url']})")
        lines.append("")
    (ROOT / "check-summary.md").write_text("\n".join(lines) + "\n")
    needs_attention = bool(changed or due)
    print(f"\n{counts}  needs_attention={needs_attention}")
    # Tell the workflow whether to open/update the issue
    out = Path(__import__("os").environ.get("GITHUB_OUTPUT", "/dev/null"))
    with out.open("a") as f:
        f.write(f"needs_attention={'true' if needs_attention else 'false'}\n")


if __name__ == "__main__":
    main()
