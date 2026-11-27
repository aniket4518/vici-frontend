import type { Metadata } from "next";
import HomePage from "@/app/components/HomePage";
import {
  SAME_AS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  jsonLd,
} from "@/lib/site";

/* Set here rather than in the root layout, where every child page would inherit
   a canonical pointing at the homepage. */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/* WebSite feeds the site name Google shows in results (alternateName is the
   ordered fallback if it won't use "Daur" alone); Organization feeds the logo
   and, through sameAs, ties the official profiles to the brand. No
   MobileApplication: its rich result needs ratings, which we do not have. */
const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      alternateName: ["Daur App", "daurapp"],
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      publisher: { "@id": ORGANIZATION_ID },
    },
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/og-logo.png`,
      description: SITE_DESCRIPTION,
      email: "contact.daur@gmail.com",
      sameAs: SAME_AS,
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(STRUCTURED_DATA) }}
      />
      <HomePage />
    </>
  );
}
