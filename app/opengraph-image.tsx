import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

/* Root-level OG image — the card that shows in iMessage, WhatsApp, Slack and
   friends. Next's metadata system inherits this into every route that does not
   define its own, so one file covers the marketing pages and the /post, /user
   and /teams share targets.

   Note: a route whose generateMetadata returns its own `openGraph` block
   REPLACES this inherited image rather than merging with it — which is why the
   deep-link routes pass the resolved parent images through in
   DeepLinkFallback.tsx. */

export const alt = "Daur";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Prerendered at build time, so this file read happens during `next build`
   where public/ is guaranteed present — never in a serverless runtime. */
export const dynamic = "force-static";

/* Satori cannot fetch by URL, so the mark is inlined as a data URI.
   og-logo.png is icon.png cropped to its opaque bounding box: the original is
   a 2270x1790 canvas holding a 724x940 logo, which would render tiny here. */
const logo = fs.readFileSync(
  path.join(process.cwd(), "public", "og-logo.png")
);
const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

/* The cropped mark is 462x600. Keep that ratio exactly so the logo is never
   stretched, and size it off the card height rather than hardcoding both. */
const LOGO_HEIGHT = 430;
const LOGO_WIDTH = Math.round((462 / 600) * LOGO_HEIGHT);

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0B0F",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={LOGO_WIDTH} height={LOGO_HEIGHT} alt="" />
      </div>
    ),
    size
  );
}
