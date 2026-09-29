#!/usr/bin/env python3
"""Pull upcoming events from official university and students' union sources into events.json.

Runs daily in GitHub Actions (see .github/workflows/update-events.yml). Standard library only.

Sources:
  - Students' Union UCL  "What's on" JSON feed
  - LSE Students' Union  monthly events calendar
  - King's College London events calendar (student and careers events)
  - LSE public events

If a source fails, the previous run's upcoming events from that source are kept, so a
temporary outage never empties the app.
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

LONDON = ZoneInfo("Europe/London")
NOW = datetime.now(LONDON)
WINDOW_DAYS = 35
HORIZON = NOW + timedelta(days=WINDOW_DAYS)
OUT = Path(__file__).resolve().parent.parent / "events.json"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"

CAMPUS = {
    "ucl": [51.5246, -0.1340], "ucl-east": [51.5378, -0.0107],
    "kcl-strand": [51.5115, -0.1160], "kcl-waterloo": [51.5053, -0.1134], "kcl-guys": [51.5033, -0.0869],
    "kcl-denmark-hill": [51.4686, -0.0937], "kcl-st-thomas": [51.4989, -0.1181],
    "lse": [51.5144, -0.1165], "kings-cross": [51.5311, -0.1205],
}
CAREER_RE = re.compile(r"career|employab|internship|insight (day|week)|networking|recruit|\bcv\b|graduate scheme|job fair|work fair|careers fair|panel|fireside|industry|spring week", re.I)
SPORT_RE = re.compile(r"\b(sport|football|netball|rugby|basketball|badminton|tennis|swim|run club|yoga|pilates|climb|hike|fitness|gym|dance-?fit|boxing|volleyball|cricket|hockey)\b", re.I)
FOOD_RE = re.compile(r"breakfast|lunch|brunch|dinner|pizza|food|pastry|pastries|snacks|picnic|coffee|cake|bbq", re.I)


def fetch(url, tries=3):
    last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "text/html,application/json;q=0.9,*/*;q=0.8", "Accept-Language": "en-GB,en;q=0.9"})
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read().decode("utf-8", errors="replace")
        except Exception as e:  # noqa: BLE001
            last = e
            time.sleep(2 * (i + 1))
    raise last


def clean(s, limit=280):
    s = html.unescape(re.sub(r"<[^>]+>", " ", s or ""))
    s = re.sub(r"\s+", " ", s).strip()
    return s if len(s) <= limit else s[:limit].rsplit(" ", 1)[0] + "…"


def iso(dt):
    return dt.astimezone(LONDON).strftime("%Y-%m-%dT%H:%M")


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:60]


def classify(text, default="events"):
    if SPORT_RE.search(text):
        return "sport"
    if CAREER_RE.search(text):
        return "careers"
    return default


def interest_tags(text):
    t = []
    rules = [
        (r"\b(ai|tech|coding|software|data|computing|engineer|hackathon|robot)", "tech"),
        (r"financ|bank|invest|economic|monetary|consult|trading|markets", "finance"),
        (r"\blaw\b|legal|\bpolitic|public policy|government|parliament|\bmoot", "law"),
        (r"\bmusic|concert|\bgig\b|club night|\bparty\b|nightlife|\bdj\b|karaoke|piano|choir|orchestra|jazz", "music"),
        (r"\barts?\b|culture|\bfilm|cinema|theatre|museum|exhibition|poetry|book club|gallery|\bdrama\b", "culture"),
        (r"welcome|meet|friend|social|mixer|taster|community|international|chaplaincy|faith|picnic", "community"),
        (r"research|lecture|seminar|symposium", "research"),
        (r"volunteer|charity|fundrais", "volunteer"),
    ]
    for pat, tag in rules:
        if re.search(pat, text, re.I):
            t.append(tag)
    if FOOD_RE.search(text):
        t.append("food")
    return sorted(set(t))


# ---------------------------------------------------------------- Students' Union UCL
def ucl_su():
    start = int(NOW.replace(hour=0, minute=0, second=0, microsecond=0).timestamp())
    end = int(HORIZON.timestamp())
    rows = []
    for page in range(0, 40):
        data = json.loads(fetch(f"https://studentsunionucl.org/json/anon/whats-on/{start}/{end}/list/{page}"))
        if not data:
            break
        rows.extend(data)
    by_product = {}
    for e in rows:
        pid = e.get("product_id") or e.get("variation_url")
        prev = by_product.get(pid)
        price = float(e.get("price") or 0)
        if prev is None or price < prev["_price"]:
            e["_price"] = price
            by_product[pid] = e
    events = []
    for e in by_product.values():
        if (e.get("field_stock_level_status") or "").lower().startswith("sold out"):
            continue
        s = datetime.fromtimestamp(int(e["field_date_range_value"]), LONDON)
        en = datetime.fromtimestamp(int(e.get("field_date_range_end_value") or e["field_date_range_value"]), LONDON)
        if en < NOW or s > HORIZON:
            continue
        tags = list((e.get("field_event_tags") or {}).values()) if isinstance(e.get("field_event_tags"), dict) else []
        venue = clean(e.get("field_event_venue__label") or "")
        title = clean(e["title"], 120)
        group = clean(e.get("field_event_owner_group") or "")
        text = " ".join([title, " ".join(tags), group, venue])
        online = e.get("field_event_online") == "On"
        east = "UCL East" in tags or re.search(r"\beast\b|marshgate|pool street", venue, re.I)
        ll = CAMPUS["kings-cross"] if re.search(r"scala", venue, re.I) else CAMPUS["ucl-east"] if east else CAMPUS["ucl"]
        ttype = e.get("ticketingType")
        price, price_text = (0, None) if ttype in ("free", "none") or e["_price"] == 0 and ttype != "external" else (None, "Tickets on external site") if ttype == "external" else (round(e["_price"], 2), None)
        cat = "sport" if any(t in ("Sport", "Fitness") for t in tags) else classify(text)
        itags = interest_tags(text)
        if "Nightlife" in tags:
            itags += ["nightlife", "music"]
        if "Sport" in tags or "Fitness" in tags:
            itags.append("fitness")
        desc_bits = [clean(e.get("body") or "")] if e.get("body") else []
        desc_bits.append(f"Run by {group}." if group else "Run by Students' Union UCL.")
        if venue and venue not in ("Unconfirmed", "Multiple Venues"):
            desc_bits.append(f"Venue: {venue}.")
        good = [t for t in tags if t in ("Beginner Friendly", "Alcohol Free", "Postgrads only", "Commuters", "Under 18 Friendly")]
        if good:
            desc_bits.append(" · ".join(good) + ".")
        events.append({
            "id": f"ucl-su-{e.get('product_id') or slug(title)}",
            "cat": cat, "title": title, "org": group or "Students' Union UCL",
            "area": "UCL East" if east else (venue if venue and len(venue) < 40 and venue not in ("Unconfirmed", "Multiple Venues") else "UCL Bloomsbury"),
            "ll": ll, "online": True if online else None,
            "price": price, "priceText": price_text,
            "start": iso(s), "end": iso(en), "unis": ["ucl"],
            "tags": sorted(set(itags)), "desc": " ".join(b for b in desc_bits if b),
            "url": (e.get("variation_url") or "").split("?")[0],
            "yrs": [4] if "Postgrads only" in tags else None,
        })
    return dedupe_series(events)


# ---------------------------------------------------------------- LSE Students' Union
TIME_RE = re.compile(r"(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm)", re.I)


def parse_time(s):
    m = TIME_RE.search(s or "")
    if not m:
        return None
    h, mi, ap = int(m.group(1)), int(m.group(2) or 0), m.group(3).lower()
    if ap == "pm" and h != 12:
        h += 12
    if ap == "am" and h == 12:
        h = 0
    return h, mi


def lse_su():
    events = []
    months = {(NOW.year, NOW.month)}
    nxt = (NOW.replace(day=1) + timedelta(days=32))
    months.add((nxt.year, nxt.month))
    for (y, mth) in sorted(months):
        s = fetch(f"https://www.lsesu.com/ents/eventlist/?month={mth}&year={y}")
        for day_block in re.findall(r'<div class="eventlist_day[^"]*">(.*?)(?=<div class="eventlist_day|<div class="eventlist_footer|</section>|$)', s, flags=re.S):
            h4 = re.search(r"<h4>\s*\w+\s+(\d{1,2})\w*\s+(\w+)\s*</h4>", day_block)
            if not h4:
                continue
            try:
                day = datetime.strptime(f"{h4.group(1)} {h4.group(2)} {y}", "%d %B %Y").replace(tzinfo=LONDON)
            except ValueError:
                continue
            for item in re.findall(r'<div class="event_item[^"]*"[^>]*>(.*?)</dl>', day_block, flags=re.S):
                a = re.search(r'<a href="(/events/\d+/\d+/)"[^>]*class="msl_event_name"[^>]*>(.*?)</a>', item, flags=re.S) \
                    or re.search(r'<a href="(/events/\d+/\d+/)"[^>]*>([^<]+)</a>', item, flags=re.S)
                if not a:
                    continue
                title = clean(a.group(2), 120)
                tm = clean((re.search(r'msl_event_time">(.*?)</dd>', item, flags=re.S) or [None, ""])[1])
                loc = clean((re.search(r'msl_event_location">(.*?)</dd>', item, flags=re.S) or [None, ""])[1])
                desc = clean((re.search(r'msl_event_description">(.*?)</dd>', item, flags=re.S) or [None, ""])[1])
                parts = re.split(r"\s*[-–]\s*", tm)
                st = parse_time(parts[0]) if parts else None
                et = parse_time(parts[1]) if len(parts) > 1 else None
                start = day.replace(hour=st[0], minute=st[1]) if st else day.replace(hour=9)
                end = day.replace(hour=et[0], minute=et[1]) if et else start + timedelta(hours=2)
                if end < start:
                    end += timedelta(days=1)
                if end < NOW or start > HORIZON:
                    continue
                text = f"{title} {desc}"
                online = bool(re.search(r"\bonline\b|zoom|teams", f"{loc} {title}", re.I))
                events.append({
                    "id": f"lse-su-{a.group(1).strip('/').split('/')[-1]}",
                    "cat": classify(text), "title": title, "org": "LSE Students' Union",
                    "area": loc if loc and len(loc) < 45 else "LSE campus", "ll": CAMPUS["lse"],
                    "online": True if online and not loc else None,
                    "price": None, "priceText": None,
                    "start": iso(start), "end": iso(end), "unis": ["lse"],
                    "tags": interest_tags(text), "desc": desc or "LSE Students' Union event.",
                    "url": "https://www.lsesu.com" + a.group(1),
                })
    return dedupe_series(events)


# ---------------------------------------------------------------- King's College London
def redux_data(s):
    m = re.search(r"window\.REDUX_DATA\s*=\s*(\{.*?\});?\s*(?:window\.|</script>)", s, flags=re.S)
    if not m:
        raise ValueError("no REDUX_DATA on page")
    return json.loads(re.sub(r"(?<=[:\[,])\s*undefined\b", "null", m.group(1)))


def kcl_campus(text):
    t = text.lower()
    if "waterloo" in t: return "Waterloo campus", CAMPUS["kcl-waterloo"]
    if "guy's" in t or "guys campus" in t or "london bridge" in t: return "Guy's campus", CAMPUS["kcl-guys"]
    if "denmark hill" in t: return "Denmark Hill campus", CAMPUS["kcl-denmark-hill"]
    if "st thomas" in t: return "St Thomas' campus", CAMPUS["kcl-st-thomas"]
    return "Strand campus", CAMPUS["kcl-strand"]


def kcl():
    events = []
    for page in range(0, 20):
        d = redux_data(fetch(f"https://www.kcl.ac.uk/events/events-calendar?term=&pageIndex={page}"))
        L = d["listing"]
        items = L.get("items") or []
        if not items:
            break
        stop = False
        for it in items:
            uri = (it.get("sys") or {}).get("uri")
            date = it.get("date") or {}
            if not uri or not date.get("from"):
                continue
            start = datetime.fromisoformat(date["from"]).replace(tzinfo=LONDON)
            end = datetime.fromisoformat(date.get("to") or date["from"]).replace(tzinfo=LONDON)
            if start > HORIZON:
                stop = True
                continue
            if end < NOW:
                continue
            cats = [c.get("entryTitle") or "" for c in it.get("categories") or []]
            depts = [f.get("entryTitle") or "" for f in it.get("facultiesAndDepartments") or []]
            types = [t.get("entryTitle") or "" for t in it.get("type") or []]
            title = clean(it.get("title") or "", 140)
            desc = clean(it.get("description") or "")
            text = " ".join([title, desc, " ".join(depts)])
            is_careers = any(re.search(r"career|employer engagement|employab", x, re.I) for x in depts) or CAREER_RE.search(title)
            if not ("Student" in cats or is_careers):
                continue  # skip staff-only and research seminars
            online = "Online" in types
            area, ll = kcl_campus(text)
            events.append({
                "id": f"kcl-{slug(uri.rsplit('/', 1)[-1])}",
                "cat": "careers" if is_careers else classify(text),
                "title": title, "org": depts[0] if depts else "King's College London",
                "area": "Online" if online else area, "ll": ll, "online": True if online else None,
                "price": None, "priceText": None,
                "start": iso(start), "end": iso(end), "unis": ["kcl"],
                "tags": interest_tags(text), "desc": desc or "King's College London event.",
                "url": "https://www.kcl.ac.uk" + uri,
            })
        if stop or page + 1 >= (L.get("pagingInfo") or {}).get("pageCount", 0):
            break
    return dedupe_series(events)


# ---------------------------------------------------------------- LSE public events
LSE_DATE = re.compile(r"(\d{1,2}) (\w+) (\d{4})\s*([0-9.:]+\s*[ap]m)?", re.I)


def lse_public():
    s = fetch("https://www.lse.ac.uk/events/search-events")
    events = []
    cards = re.findall(r'<div class="listingCardstyled[^"]*listing-card">(.*?)(?=<div class="listingCardstyled|</main>|$)', s, flags=re.S)
    for c in cards:
        t = re.search(r'<h2 class="card__title"><a[^>]*href="([^"]+)"[^>]*>(.*?)</a>', c, flags=re.S)
        dt = re.search(r'<div class="card__description">(.*?)</div>', c, flags=re.S)
        loc = re.search(r'<div class="card__location">.*?</span>([^<]*)</div>', c, flags=re.S)
        if not t or not dt:
            continue
        dtext = clean(dt.group(1))
        parts = LSE_DATE.findall(dtext)
        if not parts:
            continue
        def mk(p, fallback_time=None):
            d = datetime.strptime(f"{p[0]} {p[1]} {p[2]}", "%d %B %Y").replace(tzinfo=LONDON)
            tm = parse_time(p[3]) if p[3] else fallback_time
            return d.replace(hour=tm[0], minute=tm[1]) if tm else d.replace(hour=9)
        start = mk(parts[0])
        if len(parts) > 1:
            end = mk(parts[1], parse_time(dtext.rsplit("-", 1)[-1]))
        else:
            times = TIME_RE.findall(dtext)  # [(hour, minutes, am/pm), ...]
            end_t = None
            if len(times) > 1:
                h, mi, ap = times[1]
                end_t = parse_time(f"{h}:{mi}{ap}" if mi else f"{h}{ap}")
            end = start.replace(hour=end_t[0], minute=end_t[1]) if end_t else start + timedelta(hours=1, minutes=30)
        if end < NOW or start > HORIZON:
            continue
        title = clean(t.group(2), 140)
        location = clean(loc.group(1)) if loc else ""
        online_only = bool(re.search(r"online", location, re.I)) and not re.search(r"in-person", location, re.I)
        m = re.search(r"\(([^)]+)\)", location)
        room = m.group(1) if m else location
        href = t.group(1) if t.group(1).startswith("http") else "https://www.lse.ac.uk" + t.group(1)
        text = f"{title} {location}"
        events.append({
            "id": f"lse-public-{slug(href.rsplit('/', 1)[-1])}",
            "cat": "events", "title": title, "org": "LSE public events",
            "area": room[:45] if room else "LSE campus", "ll": CAMPUS["lse"], "online": True if online_only else None,
            "price": None, "priceText": None,
            "start": iso(start), "end": iso(end), "unis": None,
            "tags": sorted(set(interest_tags(text) + ["culture", "research"])),
            "desc": f"LSE public event, open to everyone. {location}.".replace("..", ".") if location else "LSE public event, open to everyone.",
            "url": href,
        })
    return events


# ---------------------------------------------------------------- helpers
def dedupe_series(events):
    """Keep the next session of repeating events and note how many more there are."""
    groups = {}
    for e in sorted(events, key=lambda x: x["start"]):
        key = (e["title"].lower(), e["org"].lower())
        groups.setdefault(key, []).append(e)
    out = []
    for g in groups.values():
        first = dict(g[0])
        if len(g) > 1:
            first["desc"] = (first["desc"] + f" Also on {len(g) - 1} more date{'s' if len(g) > 2 else ''} in the next few weeks.").strip()
        out.append(first)
    return out


SOURCES = [
    ("ucl-su", "Students' Union UCL", "https://studentsunionucl.org/whats-on", ucl_su),
    ("lse-su", "LSE Students' Union", "https://www.lsesu.com/events/whats-on/", lse_su),
    ("kcl", "King's College London events", "https://www.kcl.ac.uk/events/events-calendar", kcl),
    ("lse-public", "LSE public events", "https://www.lse.ac.uk/events", lse_public),
]


def main():
    previous = {}
    if OUT.exists():
        try:
            previous = json.loads(OUT.read_text())
        except Exception:  # noqa: BLE001
            previous = {}
    prev_events = previous.get("events", [])
    stamp = NOW.strftime("%Y-%m-%dT%H:%M")
    all_events, report = [], []
    for key, name, url, fn in SOURCES:
        try:
            evs = fn()
            for e in evs:
                e["source"], e["sourceKey"], e["checked"], e["status"], e["auto"] = name, key, stamp[:10], "verified", True
                for k in [k for k, v in e.items() if v is None]:
                    del e[k]
            all_events.extend(evs)
            report.append({"key": key, "name": name, "url": url, "ok": True, "count": len(evs), "fetched": stamp})
            print(f"{name}: {len(evs)} events")
        except Exception as ex:  # noqa: BLE001
            kept = [e for e in prev_events if e.get("sourceKey") == key and e.get("end", "") >= stamp]
            all_events.extend(kept)
            last_ok = next((s.get("fetched") for s in previous.get("sources", []) if s.get("key") == key and s.get("ok")), None)
            report.append({"key": key, "name": name, "url": url, "ok": False, "count": len(kept), "error": str(ex)[:200], "fetched": last_ok})
            print(f"{name}: FAILED ({ex}); kept {len(kept)} previous events", file=sys.stderr)
    all_events.sort(key=lambda e: e["start"])
    seen, unique = set(), []
    for e in all_events:
        if e["id"] in seen:
            continue
        seen.add(e["id"])
        unique.append(e)
    OUT.write_text(json.dumps({"generated": stamp, "windowDays": WINDOW_DAYS, "sources": report, "events": unique}, ensure_ascii=False, indent=1) + "\n")
    print(f"wrote {len(unique)} events to {OUT.name}")
    if not any(s["ok"] for s in report):
        sys.exit(1)


if __name__ == "__main__":
    main()
