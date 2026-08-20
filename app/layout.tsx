import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Script from "next/script";
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
  metadataBase: new URL("https://daurapp.com"),
  title: "Daur — Turn every run into a territory war",
  description: "Track runs, claim territory, and compete with friends.",
  openGraph: {
    siteName: "Daur",
    type: "website",
    title: "Daur — Turn every run into a territory war",
    description: "Track runs, claim territory, and compete with friends.",
    /* No `url` here on purpose: every page without its own openGraph inherits
       this block, and a hardcoded "/" would make /about and friends unfurl as
       the homepage. Omitted, scrapers fall back to the URL they fetched. */
  },
  twitter: {
    card: "summary_large_image",
    title: "Daur — Turn every run into a territory war",
    description: "Track runs, claim territory, and compete with friends.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="rOxlKqtadqrNybgjkHqo3s1ceRZlTT-kEYQh5gWFGPs" />
      </head>
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
