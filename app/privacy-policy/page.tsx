import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Daur",
  description:
    "Read the Daur Privacy Policy to understand how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "960px",
          margin: "0 auto",
          padding: "16px",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
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
            fontFamily: "Arial, Helvetica, sans-serif",
            color: "#3030F1",
            textDecoration: "none",
            marginBottom: "12px",
          }}
        >
          ← Back to Home
        </Link>

        {/* 
          We use an iframe pointing to our API route that serves the raw HTML
          from privacypolicy.md. This avoids React hydration errors, 
          Tailwind/global CSS conflicts, and iframe srcDoc CSP issues. 
        */}
        <iframe
          src="/api/policy"
          style={{
            width: "100%",
            flexGrow: 1,
            minHeight: "100vh",
            border: "none",
            backgroundColor: "#ffffff",
          }}
          title="Privacy Policy"
        />
      </div>
    </main>
  );
}
