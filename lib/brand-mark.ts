import fs from "node:fs";
import path from "node:path";

/* Used by the prerendered OG card, which runs during
   `next build` where public/ is guaranteed present — never import this from
   code that runs in a serverless runtime.

   Satori cannot fetch by URL, so the mark is inlined as a data URI.
   og-logo.png is icon.png cropped to its opaque bounding box: the original is
   a 2270x1790 canvas holding a 724x940 logo, which would render tiny. */
const logo = fs.readFileSync(path.join(process.cwd(), "public", "og-logo.png"));

export const BRAND_MARK_SRC = `data:image/png;base64,${logo.toString("base64")}`;
export const BRAND_BACKGROUND = "#0B0B0F";

/* The cropped mark is 462x600. Derive the width from this so the logo is never
   stretched. */
export function brandMarkWidth(height: number): number {
  return Math.round((462 / 600) * height);
}
