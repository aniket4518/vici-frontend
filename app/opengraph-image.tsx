import { ImageResponse } from "next/og";
import {
  BRAND_BACKGROUND,
  BRAND_MARK_SRC,
  brandMarkWidth,
} from "@/lib/brand-mark";

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

/* Prerendered at build time, so lib/brand-mark's file read happens during
   `next build` where public/ is guaranteed present. */
export const dynamic = "force-static";

const LOGO_HEIGHT = 430;

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
          background: BRAND_BACKGROUND,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BRAND_MARK_SRC}
          width={brandMarkWidth(LOGO_HEIGHT)}
          height={LOGO_HEIGHT}
          alt=""
        />
      </div>
    ),
    size
  );
}
