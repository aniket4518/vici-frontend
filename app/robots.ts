import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/* /post, /user and /teams are deliberately not disallowed even though they are
   noindex: Twitterbot obeys robots.txt, so blocking them would break X unfurls,
   and Google has to fetch a page to see its noindex tag. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
