import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Account Deletion | Daur",
  description:
    "Learn how to permanently delete your Daur account and what data will be removed or retained during the process.",
};

export default function AccountDeletionPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        fontFamily: "Arial, Helvetica, sans-serif",
        color: "#111111",
      }}
    >
      {/* ── Page wrapper ── */}
      <div
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "40px 24px 80px",
        }}
      >
        {/* ── Back button ── */}
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "14px",
            color: "#3030F1",
            textDecoration: "none",
            marginBottom: "32px",
          }}
        >
          ← Back to Home
        </Link>

        {/* ── Title block ── */}
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            marginBottom: "6px",
            lineHeight: 1.2,
          }}
        >
          Daur Account Deletion
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "#666666",
            marginBottom: "36px",
          }}
        >
          Last Updated: June 2026
        </p>

        <p
          style={{
            fontSize: "15px",
            lineHeight: 1.7,
            marginBottom: "36px",
            color: "#333333",
          }}
        >
          Daur users can permanently delete their account and associated data
          directly from within the app.
        </p>

        {/* ── Section: How to delete ── */}
        <Section title="How to Delete Your Account">
          <ol
            style={{
              paddingLeft: "20px",
              margin: 0,
              fontSize: "15px",
              lineHeight: "2",
              color: "#333333",
            }}
          >
            <li>Open the Daur app.</li>
            <li>Go to Settings.</li>
            <li>Tap <strong>Delete Account</strong>.</li>
            <li>Follow the confirmation steps.</li>
          </ol>
          <p
            style={{
              fontSize: "14px",
              color: "#555555",
              marginTop: "14px",
              lineHeight: 1.6,
            }}
          >
            Once confirmed, your account deletion request will be processed.
          </p>
        </Section>

        {/* ── Section: Data deleted ── */}
        <Section title="Data That Will Be Deleted">
          <p
            style={{
              fontSize: "15px",
              color: "#333333",
              marginBottom: "12px",
              lineHeight: 1.6,
            }}
          >
            The following data will be <strong>permanently deleted</strong>:
          </p>

          <SubHeading>Account profile information</SubHeading>
          <BulletList
            items={["Name", "Email address", "Profile picture", "Body weight and profile settings"]}
          />

          <SubHeading>Activity data</SubHeading>
          <BulletList
            items={[
              "Running activity history",
              "Routes, territory, distance, pace, and workout records",
            ]}
          />

          <SubHeading>Community content</SubHeading>
          <BulletList
            items={[
              "User-created posts",
              "Comments and community content associated with the account",
            ]}
          />
        </Section>

        {/* ── Section: Data retained ── */}
        <Section title="Data That May Be Retained">
          <p
            style={{
              fontSize: "15px",
              color: "#333333",
              marginBottom: "12px",
              lineHeight: 1.6,
            }}
          >
            Certain information may be retained for a limited period when
            required for:
          </p>
          <BulletList
            items={[
              "Security and fraud prevention",
              "Legal compliance",
              "Backup and disaster recovery processes",
            ]}
          />
          <p
            style={{
              fontSize: "14px",
              color: "#555555",
              marginTop: "14px",
              lineHeight: 1.6,
            }}
          >
            Retained data will be deleted when no longer required.
          </p>
        </Section>

        {/* ── Section: Processing time ── */}
        <Section title="Processing Time">
          <p
            style={{
              fontSize: "15px",
              color: "#333333",
              lineHeight: 1.7,
            }}
          >
            Account deletion requests are typically processed within{" "}
            <strong>30 days</strong>.
          </p>
        </Section>

        {/* ── Section: Contact ── */}
        <Section title="Contact" last>
          <p
            style={{
              fontSize: "15px",
              color: "#333333",
              lineHeight: 1.7,
            }}
          >
            For questions regarding account deletion or privacy, contact:
          </p>
          <p style={{ marginTop: "10px" }}>
            <a
              href="mailto:contact.daur@gmail.com"
              style={{
                fontSize: "15px",
                color: "#3030F1",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              contact.daur@gmail.com
            </a>
          </p>
          <p
            style={{
              fontSize: "14px",
              color: "#777777",
              marginTop: "6px",
            }}
          >
            Daur
          </p>
        </Section>
      </div>
    </main>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function Section({
  title,
  children,
  last = false,
}: {
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <section
      style={{
        borderTop: "1px solid #E8E8E8",
        paddingTop: "28px",
        marginBottom: last ? 0 : "28px",
        paddingBottom: last ? 0 : "4px",
      }}
    >
      <h2
        style={{
          fontSize: "17px",
          fontWeight: 700,
          marginBottom: "14px",
          color: "#111111",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: "14px",
        fontWeight: 700,
        color: "#444444",
        marginTop: "14px",
        marginBottom: "4px",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
      }}
    >
      {children}
    </p>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul
      style={{
        paddingLeft: "20px",
        margin: 0,
        fontSize: "15px",
        lineHeight: "1.9",
        color: "#333333",
      }}
    >
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
