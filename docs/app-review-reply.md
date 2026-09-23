# App Review reply — Guideline 2.1, new-developer information request

Submitted 2026-09-22, rejected 2026-09-23 under **Guideline 2.1 – Information
Needed – New App Submission**. Nothing was found wrong with the app: the notice
opens by saying the *developer account has limited App Review history*, and the
"Prevent Common Issues" list attached to it is boilerplate, not findings.

Apple asks for this to be pasted into the **Notes field of App Review
Information** as well as sent via Resolution Center, so it is kept here to be
reused on future submissions.

---

## 1. Screen recording

Recorded on a physical iPhone running the current iOS, starting from app launch.
See the checklist at the bottom of this file for how it was produced.

There is nothing to record for the three bulleted cases Apple lists:

- **No account registration, login, or deletion.** Alertings has no accounts at
  all. Identity is a random identifier generated on the device at first launch.
- **No user-generated content.** Alerts a person creates are private to their own
  device and are never published, shared, or visible to any other user, so the
  content reporting and blocking mechanisms in Guideline 1.2 do not apply.
- **No paid content or features.** The app is free with no in-app purchases,
  subscriptions, or gated functionality.

## 2. Purpose and target audience

**The problem.** Useful things happen on someone else's schedule. An artist
releases an album, a director's next film gets announced, tomorrow's forecast
crosses the line that matters to you. Finding out means remembering to go and
check, repeatedly, across several different apps and websites.

**What the app does.** Alertings inverts that. You describe a condition once, and
the app watches for it continuously and sends a notification the moment it
becomes true. One mechanism — *watch a source, match a condition, get notified* —
applied to three kinds of thing:

- **Music** — a followed artist releases an album, EP, or single.
- **Film & TV** — a followed director or actor has a new project announced.
- **Weather** — a personal threshold is crossed in a chosen city: rain above a
  percentage, temperature below freezing, wind above a speed.

**Why the weather part is not a weather app.** Phones already push severe-weather
warnings, which are issued to everyone in a region. Alertings sends the alert
*you* defined — "tell me four hours before it goes above 90°F in San Jose" —
which no general weather service sends because it is specific to one person.

**Target audience.** General consumers who follow particular musicians,
filmmakers, or actors, and anyone who plans around specific weather conditions:
gardeners watching for frost, cyclists watching for rain, people managing heat
sensitivity. No specialist knowledge is needed and the app is not aimed at any
business, organisation, or employee group.

## 3. Setting up and accessing the main features

**No login, credentials, or sample files are required.** The app is fully
functional immediately on first launch. Notification permission is optional —
alerts can be created and managed without it; they simply are not delivered until
it is granted.

**To see the full loop end to end in a few minutes:**

1. Launch the app and tap **New alert**.
2. Choose **Weather**.
3. Type any city name into the Location field, for example `Cupertino`.
   (The location button is only a convenience for filling in this field and can
   be ignored entirely.)
4. Choose metric **Temperature**, comparator **below**, threshold **150°F**.
   This value is deliberately extreme so the condition is always true and a
   notification is guaranteed rather than dependent on real weather.
5. Choose any notice window and tap **Create alert**.
6. A push notification arrives at the next scheduled poll, within 15 minutes.
7. The **History** tab then lists the alert that was sent.

**To try the other two sources:**

- **Music** — New alert → Music → type an artist name → pick a result. The card
  shows how long it has been since their last release.
- **Film & TV** — New alert → Film & TV → type a director or actor name → pick a
  result. A notification is sent when a new project is announced for them.

Music and film alerts fire on real-world events, so they cannot be demonstrated
on demand. The weather path above is the deterministic one.

## 4. External services used

**Data providers** (all accessed over public HTTPS APIs):

| Service | Used for |
| --- | --- |
| Open-Meteo (`api.open-meteo.com`) | Weather forecasts |
| Open-Meteo Geocoding (`geocoding-api.open-meteo.com`) | Turning a city or postcode into coordinates |
| BigDataCloud (`api.bigdatacloud.net`) | Reverse geocoding, to name the city when the location button is used |
| MusicBrainz (`musicbrainz.org`) | Artist search and music release metadata |
| iTunes Search API (`itunes.apple.com`) | Album artwork and store links |
| TMDB (`api.themoviedb.org`) | Film and television data, and person images |

**Infrastructure:**

| Service | Used for |
| --- | --- |
| Expo Push Service (`exp.host`) | Delivering notifications, which reach the device via APNs |
| Vercel | Hosting the app's own API at `alertings.app` |
| Neon (PostgreSQL) | Storing the alerts a person creates and the alerts sent to them |
| GitHub Actions | The scheduled job that evaluates alerts on a fixed interval |

**Not used:** no authentication provider, no payment processor, no advertising
network, no analytics or attribution SDK, and no AI or machine-learning service.

## 5. Regional differences

**The app functions identically in every region.** There are no region-gated
features, no region-specific content, no differences in pricing (it is free
everywhere), and no geographic restrictions in the code.

The interface is English only at this time.

The underlying data providers have worldwide coverage. The depth of their
catalogues naturally varies — a regional artist may have less metadata in
MusicBrainz than an international one — but this is the completeness of public
data, not a difference in what the app offers or how it behaves.

## 6. Regulated industries and third-party material

**Alertings is not a commercial project** under the terms of the providers it
uses. TMDB, whose material is the most substantial third-party content in the
app, defines a commercial project as one whose *"primary purpose is to create
revenue for the benefit of the owner"*. Alertings is free, carries no
advertising, has no in-app purchases or subscriptions, and generates no revenue
of any kind. It therefore falls squarely within the free, non-commercial use
their API is offered for, and no commercial licence is required.

**Alertings does not operate in a regulated industry.** It provides no medical,
financial, legal, gambling, or other regulated service. Weather information is
presented purely as forecast data for personal planning and is never presented as
an official safety or emergency warning.

**Third-party material** is limited to metadata and images retrieved at runtime
from the public APIs listed in section 4. Each is accessed through its official,
publicly documented API in accordance with its published terms of use, and all
required attribution is displayed inside the app on the settings screen and in
the privacy policy at https://alertings.app/privacy:

- **TMDB** — the disclaimer their terms require is shown verbatim in the app:
  *"This product uses the TMDB API but is not endorsed or certified by TMDB."*
- **Open-Meteo** — credited, and its data is published under CC BY 4.0.
- **MusicBrainz** — credited; requests send an identifying User-Agent as their
  guidelines require.
- **iTunes Search API** — credited; artwork and links are used to point people to
  Apple's own store listings.

No content is redistributed, cached for redistribution, or presented as the
app's own. The app stores only what a person created themselves — their alerts —
plus a record of alerts sent to them.

---

## How the recording was produced

Keep this for next time; the timing is the only awkward part.

1. Install the TestFlight build on a physical iPhone running current iOS.
2. Control Centre → **Screen Recording**.
3. Start recording **from the home screen** and launch the app from its icon —
   Apple requires the recording to begin with launch.
4. Allow notifications when prompted, so the permission flow is on camera.
5. Create the temperature-below-150°F alert from section 3.
6. **From another machine**, run the poll immediately rather than waiting up to
   15 minutes for the schedule: GitHub → Actions → *Poll watches* → Run workflow.
7. Stay in the app until the notification banner appears, then open **History**
   to show the delivered alert.
8. Briefly create a music alert and a film alert to show the other two sources.
9. Stop recording. Two to three minutes is enough.
