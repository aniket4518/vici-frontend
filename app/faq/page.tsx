import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/app/components/SiteFooter";
import StoreButtons from "@/app/components/StoreButtons";
import { jsonLd } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ — The Territory Running App",
  description:
    "What is Daur? How claiming hex territory works, daily quests, leaderboards, and getting the Daur running app on Android and iPhone.",
  alternates: { canonical: "/faq" },
};

/* Each answer is plain text so the same string feeds both the page and the
   FAQPage JSON-LD; Google requires the two to match. Claims mirror the About
   page. Keep them accurate as the app changes. */
const FAQS: { q: string; a: string }[] = [
  {
    q: "What is Daur?",
    a: "Daur is a running and walking app that turns your city into a game board. Your neighbourhood is divided into hex zones on a real-world map, and every walk or run you take claims territory, so getting fit becomes a territory war with your friends.",
  },
  {
    q: "How does claiming territory work?",
    a: "Open Daur and start moving. As you walk or run through hex zones on the map, you claim them as yours. The more ground you cover, the bigger your territory grows.",
  },
  {
    q: "Can other runners take my territory?",
    a: "Yes. Rivals can contest your zones, so you have to defend your territory by getting back out there. City-wide leaderboards show who rules each area.",
  },
  {
    q: "What are daily quests?",
    a: "Quests are daily challenges such as step goals, distance targets and calorie burns. Completing them unlocks bonus captures and helps you climb the leaderboard.",
  },
  {
    q: "What does Daur track?",
    a: "Daur tracks your steps, distance, calories and capture stats in one dashboard, so you can see your fitness progress and your territory grow together.",
  },
  {
    q: "Is Daur only for serious runners?",
    a: "No. Daur is built for runners but designed for everyone. Whether you are training for a marathon or just want a reason to take a walk, every step counts towards your territory.",
  },
  {
    q: "Can I play Daur with friends?",
    a: "Yes. Daur has a social feed where you can share runs, see your friends' territory and comment on each other's conquests, plus leaderboards and city-wide events to compete in.",
  },
  {
    q: "Is Daur available on Android and iPhone?",
    a: "Daur is available on Android through the Google Play Store. On iPhone it is currently available through Apple TestFlight while the App Store release is in progress.",
  },
  {
    q: "How do I delete my Daur account?",
    a: "Open the Daur app, go to Settings and tap Delete Account. The account deletion page explains the steps and what data is removed.",
  },
];

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function FaqPage() {
  return (
    <div className="about-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(STRUCTURED_DATA) }}
      />

      <header className="header">
        <Link href="/" className="logo">daur.</Link>
        <nav className="about-nav">
          <Link href="/about" className="contact-btn">About</Link>
          <Link href="/contact" className="contact-btn">Contact</Link>
        </nav>
      </header>

      <main>
        <section className="about-hero">
          <span className="about-badge">FAQ</span>
          <h1 className="about-hero-title">
            Daur, the<br />territory running app
          </h1>
          <p className="about-hero-sub">
            Everything you need to know about claiming your city one run at a
            time.
          </p>
        </section>

        <section className="about-section">
          <div className="faq-list">
            {FAQS.map(({ q, a }) => (
              <article className="faq-item" key={q}>
                <h2 className="faq-question">{q}</h2>
                <p className="faq-answer">
                  {a}
                  {q.startsWith("How do I delete") && (
                    <>
                      {" "}
                      <Link href="/account-deletion">Read the account deletion guide.</Link>
                    </>
                  )}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section about-cta-section">
          <h2 className="about-cta-title">Ready to Conquer Your City?</h2>
          <p className="about-cta-sub">
            Download Daur now and start claiming your neighborhood.
          </p>
          <StoreButtons
            className="about-store-buttons"
            playStoreId="faq-google-play-btn"
            appStoreId="faq-app-store-btn"
          />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
