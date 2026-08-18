# Android launch plan — Google Play

App: **Alertings** · package **`app.alertings`** · Firebase project **`alertings`**

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

## 1. The SHA-1 trap — read before you enable Play App Signing

**This is the one that will break push in production and look like a code bug.**

The Firebase Android API key is restricted to a package name **plus a SHA-1
certificate fingerprint**. When you enable Play App Signing, Google strips your
upload signature and **re-signs the app with its own key**. The shipped app
therefore presents a *different* SHA-1 than the one you registered.

Result: internal builds work, the Play build fails to reach FCM, and nothing in
your code changed.

**Register both fingerprints. Add, never replace:**

| Fingerprint | Where to get it | Used by |
| --- | --- | --- |
| **Upload key** | `npx eas-cli credentials` → Android → Keystore | EAS internal/preview builds |
| **Play app signing key** | Play Console → Release → Setup → App integrity → App signing | Everything users install |

Both go in the same key restriction:

**https://console.cloud.google.com/apis/credentials?project=alertings**
→ Android key → Application restrictions → Android apps → **Add** each as
`app.alertings` + fingerprint.

> The same applies to any future key rotation, and to Google's optional
> upload-key reset. Re-check this whenever a fingerprint changes.

---

## 2. Accounts and one-time setup

- [ ] Google Play Developer account — **$25 one-time**
- [ ] **Verify the current testing requirement.** Personal developer accounts
      created recently must run a closed test with a minimum number of testers
      (12 at time of writing) for a continuous period (14 days) *before*
      production access unlocks. This is weeks of lead time, not a checkbox —
      confirm the current rule the day you register, and start the clock early.
- [ ] Identity verification (D-U-N-S for organisations; ID for individuals)

## 3. Reduce the permission surface first

The app currently declares:

```
android.permission.ACCESS_COARSE_LOCATION
android.permission.ACCESS_FINE_LOCATION
```

**Consider dropping `ACCESS_FINE_LOCATION`.** It is used only to prefill the
location field when creating a weather alert — and weather forecasts are
resolved to a city anyway, so coarse precision is entirely sufficient. Fine
location invites extra scrutiny in review and a stronger disclosure burden for
zero user-visible benefit.

If you keep it, be ready to justify it in the Data safety form.

## 4. Build and submit

```bash
cd apps/mobile
npx eas-cli build -p android --profile production   # AAB, autoIncrement on
npx eas-cli submit -p android --latest
```

- `appVersionSource: "remote"` — EAS owns the version code; don't hand-edit it.
- `version` in `app.json` (`1.0.0`) is the user-visible name.
- Submission needs a Google Service Account key with Play permissions. This is
  **separate** from the FCM key — same console, different grant.

## 5. Play Console requirements

- [ ] **Data safety form.** Must match `/privacy` exactly. Declare: approximate
      and/or precise location, push token as a device identifier. Declare **no**
      analytics, **no** ads, **no** data sold. State that data is deletable via
      `support@alertings.app`, matching the policy's promise.
- [ ] **Content rating** questionnaire
- [ ] **Target API level** — Play raises the floor annually; confirm the current
      requirement and that the Expo SDK in use compiles against it
- [ ] **Privacy policy URL** → `https://alertings.app/privacy` ✅ live
- [ ] **App access** — reviewers need no login, but say so explicitly, and note
      that alerts are time-based so the app may legitimately show an empty state
- [ ] Data deletion request URL or contact (Play requires a route) →
      `support@alertings.app`

## 6. Store listing assets

- [ ] App icon 512×512
- [ ] Feature graphic 1024×500
- [ ] Phone screenshots (min 2; 4–8 is better)
- [ ] Short description (80 chars) and full description (4000)
- [ ] Tablet screenshots if you keep `supportsTablet`

## 7. Rollout

1. **Internal testing** — instant, up to 100 testers
2. **Closed testing** — satisfies the tester-count requirement above
3. **Open testing** (optional)
4. **Production** — staged rollout, start at 10–20%

## 8. First 48 hours

- [ ] Confirm push works **on a Play-installed build**, not a sideloaded one —
      this is where the SHA-1 problem shows up
- [ ] Watch `/api/health` for `pollStale`
- [ ] Watch upstream API usage against the free-tier caps in §0.1
- [ ] Watch Play Console vitals (ANRs, crashes)
