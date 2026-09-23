import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "../components/Logo";

export const metadata: Metadata = {
  title: "Privacy — Alertings",
  description: "What Alertings collects, why, and who it is shared with.",
};

// NOTE: this describes what the code actually does today, but it is a legal
// statement about your app — read it and adjust the wording before relying on
// it. Apple requires a working way for users to reach you about their data, so
// this address has to stay monitored, not just resolve.
const CONTACT_EMAIL = "support@alertings.app";

const LAST_UPDATED = "18 August 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-[17px] font-semibold text-ink">{title}</h2>
      <div className="mt-2 space-y-3 text-[14px] leading-relaxed text-muted">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen w-full bg-canvas text-ink">
      <div className="mx-auto w-full max-w-2xl px-5 py-12">
        <Link href="/" className="flex items-center gap-3 text-muted hover:text-ink">
          <Logo className="h-8 w-8" />
          <span className="text-[14px]">← Back to Alertings</span>
        </Link>

        <h1 className="mt-8 text-[28px] font-bold tracking-[-.03em]">Privacy</h1>
        <p className="mt-2 font-mono text-[11px] text-faint">Last updated {LAST_UPDATED}</p>

        <p className="mt-6 text-[14px] leading-relaxed text-muted">
          Alertings watches sources you choose and notifies you when something matches. It
          collects only what it needs to do that. There are no adverts, no analytics, and no
          third-party trackers, and your data is never sold.
        </p>

        <Section title="What is collected">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-ink">A notification address.</strong> On a phone this is
              an Expo push token; in a browser it is a Web Push subscription. It identifies where
              to send alerts, not who you are.
            </li>
            <li>
              <strong className="text-ink">The watches you create.</strong> For weather this
              includes the coordinates and label of the location you pick, and your threshold. For
              music it is the artist you selected.
            </li>
            <li>
              <strong className="text-ink">Alerts that have been sent to you</strong> — the
              text, the time, and whether delivery succeeded — so the app can show your history.
            </li>
            <li>
              <strong className="text-ink">Your platform</strong> (iOS, Android, or web).
            </li>
          </ul>
          <p>
            Location is only read when you tap the location button, and only while the app is
            open. Alertings never tracks your location in the background. You can skip it
            entirely and type a city or postcode instead.
          </p>
        </Section>

        <Section title="What is not collected">
          <p>
            No name, email address, phone number, contacts, photos, or advertising identifiers.
            Alertings has no accounts and no login, so it holds nothing that identifies you
            personally. Your data is tied to your device, not to you.
          </p>
        </Section>

        <Section title="Who it is shared with">
          <p>These services receive data because they are needed to make the app work:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-ink">Open-Meteo</strong> — receives the coordinates of a
              weather watch to return a forecast, and place names you search for.
            </li>
            <li>
              <strong className="text-ink">BigDataCloud</strong> — receives coordinates to turn
              them into a place name when you use the location button.
            </li>
            <li>
              <strong className="text-ink">MusicBrainz</strong> — receives artist names you
              search for and the artists you watch.
            </li>
            <li>
              <strong className="text-ink">TMDB</strong> — receives names you search for and the
              people you watch, to check their film and television credits.
            </li>
            <li>
              <strong className="text-ink">Expo, Apple (APNs), and Google (FCM)</strong> —
              deliver push notifications to your device.
            </li>
            <li>
              <strong className="text-ink">Vercel and Neon</strong> — host the service and store
              its database.
            </li>
          </ul>
          <p>Nothing is shared with anyone else, and nothing is sold or used for advertising.</p>
        </Section>

        <Section title="Keeping and deleting your data">
          <p>
            Watches and their alert history are kept until you delete them. Deleting a watch in
            the app also deletes the alerts it produced. Uninstalling the app stops notifications
            reaching you, but does not by itself erase what is stored.
          </p>
          <p>
            To have everything associated with your device removed, email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono text-accent underline">
              {CONTACT_EMAIL}
            </a> and it will be
            deleted.
          </p>
        </Section>

        <Section title="Children">
          <p>
            Alertings is not directed at children and does not knowingly collect information from
            them.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            If this policy changes, the date at the top will change with it. Material changes will
            be noted in the app.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about privacy or your data:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono text-accent underline">
              {CONTACT_EMAIL}
            </a>
          </p>
        </Section>

        <Section title="Data sources and credits">
          <p>Alertings is built on data generously made available by others:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Weather data by{" "}
              <a className="text-accent hover:underline" href="https://open-meteo.com/">
                Open-Meteo.com
              </a>
              , licensed{" "}
              <a
                className="text-accent hover:underline"
                href="https://creativecommons.org/licenses/by/4.0/"
              >
                CC BY 4.0
              </a>
              . Forecasts are converted between °F and °C and summarised into the
              wording used in alerts.
            </li>
            <li>
              Music metadata by{" "}
              <a className="text-accent hover:underline" href="https://musicbrainz.org/">
                MusicBrainz
              </a>
            </li>
            <li>
              Reverse geocoding by{" "}
              <a className="text-accent hover:underline" href="https://www.bigdatacloud.com/">
                BigDataCloud
              </a>
            </li>
            <li>
              Album artwork and store links from the{" "}
              <a className="text-accent hover:underline" href="https://www.apple.com/itunes/">
                iTunes Search API
              </a>
            </li>
            <li>
              Film and television data by{" "}
              <a className="text-accent hover:underline" href="https://www.themoviedb.org/">
                TMDB
              </a>{" "}
              — this product uses the TMDB API but is not endorsed or certified by TMDB
              {/* TMDB require their logo beside the notice, kept smaller than
                  the Alertings mark. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/tmdb.svg"
                alt="TMDB"
                width={92}
                height={12}
                className="mt-2 h-3 w-auto"
              />
            </li>
          </ul>
        </Section>
      </div>
    </main>
  );
}
