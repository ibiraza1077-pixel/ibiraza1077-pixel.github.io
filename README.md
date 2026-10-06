# UniLondon: central London pilot

A phone-friendly web app for UCL, King's and LSE students: cheap eats, study spaces, events, careers fairs, part-time work, funding and discounts, ranked for each student's uni, course, year and area.

Students open a link. No account or app store needed, and they can add it to their home screen like an app.

## Files

| File | What it is |
|---|---|
| `index.html`, `app.js`, `styles.css` | The app |
| `listings.json` | All listings. **This is the file you'll edit most.** |
| `config.js` | Your settings: feedback form link, analytics code |
| `admin.html` | Your listings editor (students don't see it) |
| `manifest.webmanifest`, `sw.js`, `icons/` | Home screen install and offline support |

Live at **https://ibiraza1077-pixel.github.io/** (the repository `ibiraza1077-pixel.github.io` is published automatically).

## One-time setup (about 10 minutes)

1. **Feedback form.** Create a Google Form with 2–3 questions (e.g. "What's one thing we should add?", "Anything wrong or out of date?"). Copy its link into `feedbackUrl` in `config.js`.
2. **Suggest-a-listing form (optional).** A second Google Form (name, what, where, when, link). Put its link in `submitUrl`.
3. **Usage counts.** Sign up free at goatcounter.com and pick a code, e.g. `unilondon`. Put that code in `goatcounter` in `config.js`. It counts anonymously: no cookies, no personal data.

To edit a file on GitHub: open it → pencil icon → change → *Commit changes*. The live site updates in a minute or two.

## How listings stay current

Everything is kept up to date by one GitHub Action, **Sync** (`.github/workflows/update-events.yml`). It runs at 05:15 and 15:15 UTC every day (06:15 and 16:15 in London during British Summer Time; 05:15 and 15:15 during winter), and whenever you press **Sync now** on the admin page.

**1. Events update themselves.** `scripts/update_events.py` pulls upcoming events from:

| Source | What it adds |
|---|---|
| Students' Union UCL "What's on" | Society, sport, social and welcome events |
| LSE Students' Union calendar | Society events, careers talks |
| King's College London events calendar | Student and careers events (fairs, workshops, networking nights) |
| LSE public events | Free public lectures and concerts |

Past events disappear on their own. If a source is down, its last good events are kept.

**2. Listings re-check themselves.** `scripts/check_listings.py` opens each listing's official page and looks for the facts in its `verify` rules (prices, hours, dates):
- **Still there:** the listing is marked "confirmed on the official page" with today's date.
- **Changed:** the listing is flagged "may have changed" in the app and ranked lower, and a GitHub issue called **Listings need attention** tells you exactly what to fix. The issue closes itself once everything checks out.
- **Site blocks automated checks** (ucl.ac.uk, KCLSU, University of London, British Museum): these can't be checked automatically. The issue reminds you when they're due for a manual check, and the app flags them after 60 days.

The checker never changes a price or time on its own. It only confirms or flags, so nothing wrong gets published.

**3. Students always see the latest.** The app has a **Refresh** button, and refreshes by itself when reopened after 30 minutes.

### Admin page (`/admin.html`)

- **Sync now:** runs the Sync immediately and shows progress.
- **Publish to site:** saves your listing edits straight to GitHub.
- Both need a one-time connection: a fine-grained GitHub token limited to this repository, with *Actions* and *Contents* set to read and write. It's saved only in your browser. The page walks you through it.

To add automatic checks to a new listing, give it a `verify` rule, e.g. `"verify": [{"find": ["£3\\.99", "08:00 - 11:00"]}]`. Each entry must appear on the listing's official page.

## Keeping listings accurate

- Open `https://ibiraza1077-pixel.github.io/admin.html`.
- Filter **Changed on official page** or **Can't auto-check**. Open the official page, fix anything that's wrong, then press **Mark checked today** and **Publish to site**.

Aim to add 5–10 new listings a week: café deals, new jobs, KCLSU events. Fresh listings are what bring people back.

## What to measure (GoatCounter dashboard)

| Event | Meaning |
|---|---|
| `visit/new` | A new person opened the app |
| `return/next-day` | Someone came back the day after their last visit |
| `return/day-1` … `return/day-7` | Someone came back N days after their first visit |
| `visit/from-home-screen` | Opened from the home screen icon |
| `tab/…`, `open/…`, `save/…` | Which features people actually use |
| `outbound/<id>` | Someone tapped through to a listing's official page |
| `survey/very`, `survey/somewhat`, `survey/not` | "How would you feel if you could no longer use UniLondon?" (shown from the second day of use) |

**Your pilot targets:**
- Next-day return ≈ `return/next-day` ÷ `visit/new` from the day before. Aim for **30%+**.
- If **40%+** of survey answers are "very disappointed", you're onto something.

## Running it locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Engineering and checks

Built with vanilla JavaScript, a service worker and Python's standard library. The app separates static listings from fetched event data and uses scheduled GitHub Actions for updates. It is a student resource pilot; automated checks can flag changes but cannot guarantee that every listing is current.

```bash
node --check app.js
node --check sw.js
python3 -m unittest discover -s tests
```

Regression tests cover complete checks, changed facts and partially unreachable sources. A listing is only confirmed when every configured source can be checked. The service worker caches successful responses and uses cached data during failed requests.
