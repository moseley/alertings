# Apple launch plan — App Store

App: **Alertings** · bundle **`app.alertings`** · team **Jeremy Moseley (Individual)**

---

## 0. Blockers that apply to both stores

These are not store paperwork — they are reasons not to ship yet. Resolve or
consciously accept each one.

### 0.1 Every data source is on a non-commercial tier

| Source | Terms reality |
| --- | --- |
| **TMDB** | Free tier is non-commercial. Commercial use needs a licence agreement. Attribution is **mandatory** and already present in the app and privacy page — do not remove it. |
| **Open-Meteo** | Free for non-commercial use, roughly 10k calls/day. Commercial use needs a paid plan. |
| **MusicBrainz** | Live server is ~1 request/second, enforced. Heavy or commercial users are expected to run a mirror. |
| **BigDataCloud** | Free tier is capped; reverse geocoding runs on every GPS prefill. |
| **iTunes Search** | Apple's, undocumented but roughly 20 calls/minute. |

A free app in a public store is still arguably commercial use for TMDB, and
"free" does not exempt you from the rate limits. **Decide this before launch,
not after a takedown.** The polling model multiplies it: every watch hits an
upstream API on every tick.

### 0.2 One scheduler, no redundancy

Polling is a single GitHub Actions cron. It has already failed twice — a
silent cron-job.org disappearance (~3.6 days) and an Actions outage (~6 hours),
plus a self-inflicted domain/URL decoupling (~2.5 hours). When it stops, the
app looks identical to "nothing matched." `/api/health` reports `pollStale`
but **nothing watches the watcher.**

Dedupe keys make redundant schedulers safe — a second one cannot double-alert.
Add one before real users depend on this.

### 0.3 No authentication

Identity is an `ownerId` in a query string. Anyone with another user's id can
read and delete their watches. Acceptable for a private beta; not for a public
launch with real users' locations in the database.

### 0.4 Free-tier infrastructure

Vercel Hobby forbids commercial use and caps crons at daily (why polling lives
in Actions). Neon's free tier sleeps. Both need upgrading for a real launch.

---

## 1. Already handled

Don't re-derive these — they're done and correct:

- ✅ Apple Developer Program membership (paid, individual)
- ✅ `ITSAppUsesNonExemptEncryption: false` in `app.json` — skips the export
      compliance prompt on every single upload
- ✅ Location permission string is specific and honest: *"Alertings uses your
      location to prefill where your weather watches apply."* Generic strings
      are a common rejection.
- ✅ Privacy policy live at `https://alertings.app/privacy`, with a working
      `mailto:` contact
- ✅ TMDB attribution present in-app and in the policy
- ✅ **The app is fully usable without granting notification permission.** This
      was previously a hard blocker — guideline 5.1.1 forbids gating
      functionality on a permission the app doesn't strictly need to run.
      Do not regress this.

## 2. The APNs key is team-wide — reuse it

Unlike the Android FCM setup, iOS push needs no per-project key rotation. The
APNs key and the distribution certificate are **shared across every bundle ID
in the team**, so a new app ID does not need new push credentials.

**Apple caps distribution certificates at 2 and APNs keys at 2 per account.**
Always choose *reuse* when EAS offers it. Creating new ones burns a slot and
eventually forces a revocation, which invalidates every provisioning profile
signed with the revoked certificate.

## 3. App Store Connect setup

- [ ] Create the app record — bundle `app.alertings`
- [ ] Name (30 chars) and subtitle (30 chars)
- [ ] Primary category — Utilities or Weather
- [ ] Age rating questionnaire
- [ ] Support URL — required, must resolve
- [ ] Marketing URL → `https://alertings.app`
- [ ] Copyright, contact info

## 4. Privacy nutrition labels

**These must agree with `/privacy`.** A mismatch between the labels and the
stated policy is a rejection, and a self-inflicted one.

Declare, per the policy as written:

| Type | Linked to identity? | Used for tracking? |
| --- | --- | --- |
| Coarse/precise location | No | No |
| Device ID (push token) | No | No |
| User content (the watches created) | No | No |

- **No** third-party analytics, **no** advertising identifiers, **no** data sold
- Data deletion route: email `support@alertings.app` — the policy promises this,
  so it must actually be honoured

## 5. Build and submit

```bash
cd apps/mobile
npx eas-cli build -p ios --profile production
npx eas-cli submit -p ios --latest
```

- `appVersionSource: "remote"` — EAS owns the build number
- `version` in `app.json` (`1.0.0`) is the user-visible version string
- Submission needs an App Store Connect API key, which EAS can create

## 6. App Review notes — write these carefully

This app is unusually easy for a reviewer to mis-assess, because **a correctly
functioning Alertings may do nothing observable during a review session.**
Alerts are conditional and time-based. A reviewer who creates a watch and waits
sees an empty list, and may conclude the app is broken or incomplete.

Give them a deterministic demo path in the review notes:

> Alertings sends a notification when a condition you choose becomes true.
> To see it end to end within a few minutes:
>
> 1. Open the app, tap **New alert**, choose **Weather**.
> 2. Enter any city, choose **Temperature**, **below**, and threshold **150°F**
>    (deliberately absurd so it is always true).
> 3. Tap **Create alert**.
> 4. A push arrives at the next poll (within ~15 minutes).
>
> No account or login is required. Notification permission is optional — the
> app is fully usable without it; you simply won't receive pushes.

Also state:
- No login/demo account needed
- Location is used only to prefill the city field and is never used for tracking

## 7. Screenshots

Required for the current device sizes (verify in App Store Connect, the set
changes):

- [ ] 6.9" / 6.7" iPhone
- [x] ~~iPad~~ — not required: `supportsTablet: false` as of 2026-09-21. Checked
      on a 13" simulator; the phone layout stretched badly (full-width buttons,
      unreadable line lengths) because there is no responsive handling in the
      mobile app at all — no `useWindowDimensions`, no `maxWidth`, no tablet
      branch. iPhone-only renders in iPad compatibility mode instead, which
      looks correct. Revisit only with a real tablet layout: a centred
      max-width container, a capped sheet width, a multi-column card grid.

Show real content: a populated alert list, the builder mid-configuration, and
history. Avoid empty states — see §6 for why that reads as broken.

## 8. TestFlight first

- [ ] Internal testing (up to 100, no review)
- [ ] External testing (needs a short Beta App Review)
- [ ] Confirm push works on a **TestFlight** build — that's the production
      signing path, not the ad-hoc one

## 9. First 48 hours

- [ ] Confirm push on a store/TestFlight build
- [ ] Watch `/api/health` for `pollStale`
- [ ] Watch upstream API usage against the caps in §0.1
- [ ] Watch App Store Connect crash reports

---

## Known device gotcha

Ad-hoc and development builds require **Developer Mode** on iOS
(Settings → Privacy & Security → Developer Mode → restart). It's per-device, and
the toggle only appears once such a build is installed. TestFlight and App Store
builds do **not** need it — this affects your testing loop, not your users.
