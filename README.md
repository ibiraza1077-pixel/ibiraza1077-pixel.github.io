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

**Events update themselves.** Twice a day (06:15 and 16:15 London time), a GitHub Action runs `scripts/update_events.py`. It pulls upcoming events from:

| Source | What it adds |
|---|---|
| Students' Union UCL "What's on" | Society, sport, social and welcome events |
| LSE Students' Union calendar | Society events, careers talks |
| King's College London events calendar | Student and careers events (fairs, workshops, networking nights) |
| LSE public events | Free public lectures and concerts |

It writes them to `events.json` and commits. The site republishes automatically. Past events disappear on their own. If a source is down, the last good events from it are kept. You can run it any time from the **Actions** tab → *Update events* → *Run workflow*.

Not covered automatically (their sites block automated access): KCLSU events and UCL Careers fairs. UCL Careers fairs are hand-entered in `listings.json` from the official page.

**Everything else is hand-checked.** Food, study spaces, deals, funding, jobs, sport and housing live in `listings.json`. Each has a source link and a `checked` date. Anything not re-checked for 60 days is flagged in the app and ranked lower, so aim to re-check each listing at least every two months in `admin.html`.

## Keeping listings accurate

- Open `https://ibiraza1077-pixel.github.io/admin.html`.
- Filter **Needs checking**. For each one, open the official page, fix anything that's wrong, then press **Mark checked today**.
- **Download listings.json**, then on GitHub open `listings.json` → *Add file / Upload* (or pencil → paste) to replace it.
- Past events and closed deadlines disappear from the app automatically.

Aim to add 5–10 new listings a week: society events, café deals, new jobs. Fresh listings are what bring people back.

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
