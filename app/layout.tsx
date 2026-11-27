import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Script from "next/script";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  /* Required so relative openGraph/twitter image paths resolve to the absolute
     HTTPS URLs that link unfurlers demand. */
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  /* Child pages set a bare title ("About") and get the brand appended. */
  title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  /* Google ignores keywords; Bing still reads them a little. */
  keywords: [
    "Daur",
    "Daur app",
    "running app",
    "territory running game",
    "walking app",
    "fitness game",
    "hex map",
  ],
  verification: { google: "rOxlKqtadqrNybgjkHqo3s1ceRZlTT-kEYQh5gWFGPs" },
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    /* No `url` here on purpose: every page without its own openGraph inherits
       this block, and a hardcoded "/" would make /about and friends unfurl as
       the homepage. Omitted, scrapers fall back to the URL they fetched. */
  },
  twitter: {
    card: "summary_large_image",
    site: "@daurapp",
    creator: "@daurapp",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  other: { "google-play-app": "app-id=com.daur.daurapp" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased`}
      >
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-QJ9MDWZRMG" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-QJ9MDWZRMG');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
