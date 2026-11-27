import Link from "next/link";
import { Instagram, Linkedin, Youtube } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/site";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/store-links";

/* lucide's Twitter icon is the old bird, so X gets its own mark. */
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const ICONS: Record<(typeof SOCIAL_LINKS)[number]["name"], React.ReactNode> = {
  Instagram: <Instagram size={18} aria-hidden />,
  X: <XIcon />,
  LinkedIn: <Linkedin size={18} aria-hidden />,
  YouTube: <Youtube size={18} aria-hidden />,
};

const PAGE_LINKS = [
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/terms-of-service", label: "Terms" },
  { href: "/account-deletion", label: "Delete account" },
];

/* Shared by every page except the homepage, whose full-screen hero stands
   alone. Besides navigation, it gives crawlers the brand name in plain text,
   internal links to every indexable page, and rel="me" links to the official
   profiles. */
export default function SiteFooter() {
  return (
    <footer className="about-footer site-footer">
      <div className="about-footer-inner">
        <div className="site-footer-brand">
          <Link href="/" className="logo" style={{ fontSize: "1.4rem" }}>
            daur.
          </Link>
          <p className="site-footer-tagline">
            <strong>Daur</strong> is the running app that turns your city into a
            game board.
          </p>
        </div>

        <nav className="about-footer-links site-footer-links" aria-label="Footer">
          {PAGE_LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
          <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
            Google Play
          </a>
          <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
            iOS (TestFlight)
          </a>
        </nav>

        <div className="site-footer-social">
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label={`Daur on ${s.name}`}
            >
              {ICONS[s.name]}
            </a>
          ))}
        </div>

        <p className="about-footer-copy">
          © {new Date().getFullYear()} Daur. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
