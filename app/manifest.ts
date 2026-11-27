import type { MetadataRoute } from "next";
import { BRAND_BACKGROUND } from "@/lib/brand-mark";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "browser",
    background_color: BRAND_BACKGROUND,
    theme_color: BRAND_BACKGROUND,
    /* The full-bleed square, not app/icon.png's tight crop: the wordmark sits
       inside the maskable safe zone, so launchers can mask it to any shape. */
    icons: [
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
