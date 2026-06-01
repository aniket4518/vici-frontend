import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Account Deletion | Daur",
  description:
    "Learn how to permanently delete your Daur account and what data will be removed or retained during the process.",
};

export default function AccountDeletionPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .p-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #fff;
          color: #111;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
          border-top: 3px solid #111;
        }

        .p-shell {
          max-width: 660px;
          margin: 0 auto;
          padding: 0 32px 96px;
        }

        /* ── Top bar ── */
        .p-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 32px 0 0;
          margin-bottom: 64px;
        }

        .p-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: #999;
          text-decoration: none;
          transition: color 0.15s;
        }
        .p-back:hover { color: #111; }

        .p-updated {
          font-size: 12px;
          color: #ccc;
          font-weight: 400;
        }

        /* ── Hero ── */
        .p-hero {
          margin-bottom: 56px;
        }

        .p-eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #bbb;
          margin-bottom: 20px;
        }

        .p-title {
          font-size: clamp(42px, 8vw, 60px);
          font-weight: 800;
          line-height: 1.0;
          letter-spacing: -0.04em;
          color: #0a0a0a;
          margin-bottom: 22px;
        }

        .p-intro {
          font-size: 15px;
          font-weight: 400;
          line-height: 1.75;
          color: #777;
          max-width: 460px;
        }

        /* ── Divider ── */
        .p-rule {
          border: none;
          border-top: 1px solid #f0f0f0;
          margin: 48px 0;
        }

        /* ── Section label ── */
        .p-section-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #bbb;
          margin-bottom: 24px;
        }

        /* ══════════════════════════════
           STEPS
        ══════════════════════════════ */
        .p-steps {
          border: 1px solid #f0f0f0;
          border-radius: 14px;
          overflow: hidden;
        }

        .p-step {
          display: grid;
          grid-template-columns: 56px 1fr;
          align-items: start;
          border-bottom: 1px solid #f0f0f0;
          transition: background 0.15s;
        }
        .p-step:last-child { border-bottom: none; }
        .p-step:hover { background: #fafafa; }

        .p-step-left {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 22px 0;
          border-right: 1px solid #f0f0f0;
        }

        .p-step-num {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #0a0a0a;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          letter-spacing: 0;
          flex-shrink: 0;
        }

        .p-step-body {
          padding: 20px 22px;
        }

        .p-step-title {
          font-size: 14px;
          font-weight: 600;
          color: #111;
          margin-bottom: 4px;
          letter-spacing: -0.01em;
        }

        .p-step-desc {
          font-size: 13px;
          color: #999;
          line-height: 1.55;
        }

        .p-mono {
          display: inline-block;
          font-family: 'SF Mono', 'Fira Mono', monospace;
          font-size: 11.5px;
          background: #f3f4f6;
          border-radius: 4px;
          padding: 1px 6px;
          color: #555;
          font-weight: 500;
          margin-top: 3px;
        }

        /* ══════════════════════════════
           DATA SECTIONS
        ══════════════════════════════ */
        .p-data-group {
          margin-bottom: 28px;
        }
        .p-data-group:last-child { margin-bottom: 0; }

        .p-data-group-title {
          font-size: 12px;
          font-weight: 600;
          color: #555;
          letter-spacing: -0.01em;
          margin-bottom: 10px;
          padding-left: 2px;
        }

        .p-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .p-tag {
          display: inline-block;
          font-size: 13px;
          font-weight: 400;
          color: #444;
          background: #f7f7f7;
          border: 1px solid #efefef;
          border-radius: 7px;
          padding: 6px 12px;
          line-height: 1;
          letter-spacing: -0.005em;
        }

        /* ══════════════════════════════
           RETENTION
        ══════════════════════════════ */
        .p-retention-note {
          font-size: 14px;
          color: #777;
          line-height: 1.7;
          margin-bottom: 20px;
        }

        .p-retention-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 18px;
        }

        .p-retention-row {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13.5px;
          font-weight: 500;
          color: #555;
          background: #fafafa;
          border: 1px solid #f0f0f0;
          border-radius: 9px;
          padding: 12px 14px;
        }

        .p-retention-bullet {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #ccc;
          flex-shrink: 0;
        }

        .p-small-note {
          font-size: 12.5px;
          color: #aaa;
          line-height: 1.65;
        }

        /* ══════════════════════════════
           PROCESSING TIME
        ══════════════════════════════ */
        .p-time-card {
          border: 1px solid #f0f0f0;
          border-radius: 14px;
          padding: 28px 28px;
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .p-time-num-wrap {
          flex-shrink: 0;
          text-align: center;
          background: #0a0a0a;
          border-radius: 12px;
          padding: 18px 24px;
          min-width: 96px;
        }

        .p-time-num {
          font-size: 44px;
          font-weight: 800;
          letter-spacing: -0.05em;
          line-height: 1;
          color: #fff;
          display: block;
        }

        .p-time-unit {
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-top: 4px;
          display: block;
        }

        .p-time-text {
          font-size: 14px;
          color: #777;
          line-height: 1.7;
        }

        /* ══════════════════════════════
           CONTACT
        ══════════════════════════════ */
        .p-contact-card {
          background: #0a0a0a;
          border-radius: 16px;
          padding: 32px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }

        .p-contact-title {
          font-size: 17px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.02em;
          margin-bottom: 5px;
        }

        .p-contact-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          line-height: 1.5;
        }

        .p-email-btn {
          display: inline-flex;
          align-items: center;
          background: #fff;
          color: #111;
          font-size: 13.5px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          padding: 11px 18px;
          border-radius: 9px;
          text-decoration: none;
          white-space: nowrap;
          letter-spacing: -0.01em;
          transition: opacity 0.15s, transform 0.15s;
          flex-shrink: 0;
        }
        .p-email-btn:hover {
          opacity: 0.88;
          transform: translateY(-1px);
        }

        .p-footer {
          padding: 48px 0 0;
          font-size: 12px;
          color: #ddd;
        }

        @media (max-width: 520px) {
          .p-shell { padding: 0 20px 80px; }
          .p-time-card { flex-direction: column; align-items: flex-start; gap: 16px; }
          .p-contact-card { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="p-root">
        <div className="p-shell">

          {/* ── Top bar ── */}
          <nav className="p-topbar">
            <Link href="/" className="p-back">
              ← Back
            </Link>
            <span className="p-updated">Last updated June 2026</span>
          </nav>

          {/* ── Hero ── */}
          <header className="p-hero">
            <p className="p-eyebrow">Daur · Account</p>
            <h1 className="p-title">Account<br />Deletion</h1>
            <p className="p-intro">
              Users can permanently delete their account and all associated
              data directly from within the app. This action cannot be undone.
            </p>
          </header>

          <hr className="p-rule" />

          {/* ── How to Delete ── */}
          <section style={{ marginBottom: "48px" }}>
            <p className="p-section-label">How to delete your account</p>
            <div className="p-steps">
              {[
                {
                  n: "1",
                  title: "Open the Daur app",
                  desc: "Launch the app on your iOS or Android device.",
                },
                {
                  n: "2",
                  title: "Go to Settings",
                  desc: "Tap your profile icon and open Settings.",
                },
                {
                  n: "3",
                  title: "Tap Delete Account",
                  desc: (
                    <>
                      Scroll down and tap the option.
                      <br />
                      <span className="p-mono">Settings → Delete Account</span>
                    </>
                  ),
                },
                {
                  n: "4",
                  title: "Confirm your request",
                  desc: "Follow the in-app confirmation steps. Once confirmed, your request will be processed.",
                },
              ].map((s) => (
                <div className="p-step" key={s.n}>
                  <div className="p-step-left">
                    <div className="p-step-num">{s.n}</div>
                  </div>
                  <div className="p-step-body">
                    <p className="p-step-title">{s.title}</p>
                    <p className="p-step-desc">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="p-rule" />

          {/* ── Data Deleted ── */}
          <section style={{ marginBottom: "48px" }}>
            <p className="p-section-label">Data that will be permanently deleted</p>

            <div className="p-data-group">
              <p className="p-data-group-title">Account profile</p>
              <div className="p-tags">
                {["Name", "Email address", "Profile picture", "Body weight & settings"].map(i => (
                  <span className="p-tag" key={i}>{i}</span>
                ))}
              </div>
            </div>

            <div className="p-data-group">
              <p className="p-data-group-title">Running activity</p>
              <div className="p-tags">
                {["Activity history", "Routes & territory", "Distance & pace", "Workout records"].map(i => (
                  <span className="p-tag" key={i}>{i}</span>
                ))}
              </div>
            </div>

            <div className="p-data-group">
              <p className="p-data-group-title">Community content</p>
              <div className="p-tags">
                {["User-created posts", "Comments", "Community content"].map(i => (
                  <span className="p-tag" key={i}>{i}</span>
                ))}
              </div>
            </div>
          </section>

          <hr className="p-rule" />

          {/* ── Data Retained ── */}
          <section style={{ marginBottom: "48px" }}>
            <p className="p-section-label">Data that may be retained</p>
            <p className="p-retention-note">
              Certain information may be kept for a limited period where required
              by applicable law or for security purposes.
            </p>
            <div className="p-retention-items">
              {[
                "Security and fraud prevention",
                "Legal compliance",
                "Backup and disaster recovery",
              ].map((item) => (
                <div className="p-retention-row" key={item}>
                  <span className="p-retention-bullet" />
                  {item}
                </div>
              ))}
            </div>
            <p className="p-small-note">
              Retained data is permanently deleted once it is no longer required.
            </p>
          </section>

          <hr className="p-rule" />

          {/* ── Processing Time ── */}
          <section style={{ marginBottom: "48px" }}>
            <p className="p-section-label">Processing time</p>
            <div className="p-time-card">
              <div className="p-time-num-wrap">
                <span className="p-time-num">30</span>
                <span className="p-time-unit">Days</span>
              </div>
              <p className="p-time-text">
                Deletion requests are typically processed within{" "}
                <strong>30 days</strong> of confirmation. You will be notified
                once the process is complete.
              </p>
            </div>
          </section>

          {/* ── Contact ── */}
          <div className="p-contact-card">
            <div>
              <p className="p-contact-title">Have questions?</p>
              <p className="p-contact-sub">
                For account deletion or data privacy enquiries.
              </p>
            </div>
            <a
              id="contact-email-btn"
              href="mailto:contact.daur@gmail.com"
              className="p-email-btn"
            >
              contact.daur@gmail.com
            </a>
          </div>

          <footer className="p-footer">Daur · 2026</footer>

        </div>
      </div>
    </>
  );
}
