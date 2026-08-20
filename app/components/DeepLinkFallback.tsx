import type { ResolvedMetadata } from "next";
import Link from "next/link";
import StoreButtons from "@/app/components/StoreButtons";

export type DeepLinkKind = "post" | "user" | "teams";

/* The shape generateMetadata gets back from `(await parent).openGraph?.images`. */
export type OGImages = NonNullable<
  NonNullable<ResolvedMetadata["openGraph"]>["images"]
>;

/* Copy for the three share targets. `title` doubles as the <h1> and the
   og:title, so recipients see the same line in the unfurl and on the page. */
export const DEEP_LINK_COPY: Record<
  DeepLinkKind,
  { title: string; description: string }
> = {
  post: {
    title: "A Daur run was shared with you",
    description:
      "Track runs, claim territory, and compete with friends. Open this in the Daur app to see the full route.",
  },
  user: {
    title: "A Daur profile was shared with you",
    description:
      "Track runs, claim territory, and compete with friends. Open this in the Daur app to see their territory.",
  },
  teams: {
    title: "A Daur team was shared with you",
    description:
      "Track runs, claim territory, and compete with friends. Open this in the Daur app to see the team.",
  },
};

/* Server-rendered landing page for /post/:id, /user/:id and /teams/:id.
   These are public share targets, so anyone on desktop — or on mobile without
   the app — lands here instead of a 404. There is no public read endpoint for
   posts, users or teams yet, so the copy is deliberately generic and the id is
   never rendered: it is untrusted path input with nothing to validate against. */
export default function DeepLinkFallback({ kind }: { kind: DeepLinkKind }) {
  const { title, description } = DEEP_LINK_COPY[kind];

  return (
    <div className="about-page">
      <header className="header">
        <Link href="/" className="logo">
          daur.
        </Link>
        <nav className="about-nav">
          <Link href="/" className="contact-btn">
            Home
          </Link>
          <Link href="/about" className="contact-btn">
            About
          </Link>
        </nav>
      </header>

      <section className="about-hero">
        <span className="about-badge">SHARED WITH YOU</span>
        <h1 className="about-hero-title">{title}</h1>
        <p className="about-hero-sub">{description}</p>
      </section>

      <section className="about-section about-cta-section">
        <h2 className="about-cta-title">Get the app to open this</h2>
        <p className="about-cta-sub">
          Daur turns every walk and run into a territory war. Claim hex zones,
          complete quests, and climb the leaderboard — all by simply moving.
        </p>
        <StoreButtons
          className="about-store-buttons"
          playStoreId={`${kind}-google-play-btn`}
          appStoreId={`${kind}-app-store-btn`}
        />
      </section>

      <footer className="about-footer">
        <div className="about-footer-inner">
          <span className="logo" style={{ fontSize: "1.4rem" }}>
            daur.
          </span>
          <div className="about-footer-links">
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/terms-of-service">Terms</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* Shared metadata builder — each route passes its own path segment so og:url
   points back at the URL that was actually shared.

   The image is inherited from the root opengraph-image.tsx via the resolved
   parent metadata: supplying an `openGraph` block here REPLACES the inherited
   image rather than merging, so without passing it through these pages would
   unfurl with no image at all. Going through the parent (rather than naming
   /opengraph-image directly) keeps Next's content hash on the URL, so a future
   redesign busts the scraper caches instead of serving a stale card. */
export function deepLinkMetadata(
  kind: DeepLinkKind,
  id: string,
  images: OGImages
) {
  const { title, description } = DEEP_LINK_COPY[kind];
  const url = `/${kind}/${encodeURIComponent(id)}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article" as const,
      siteName: "Daur",
      images,
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images,
    },
  };
}
