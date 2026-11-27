import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        /* www serves the whole site, which search engines see as a duplicate.
           .well-known stays on www because Apple does not follow redirects when
           it fetches the association file. */
        source: "/:path((?!\\.well-known/).*)",
        has: [{ type: "host", value: "www.daurapp.com" }],
        destination: "https://daurapp.com/:path",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        /* Apple rejects the association file unless it is served as JSON, and the
           file is deliberately extensionless, so Next infers octet-stream for it.
           assetlinks.json is fine on its own but is pinned here too. */
        source:
          "/.well-known/:file(apple-app-site-association|assetlinks.json)",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
    ];
  },
};

export default nextConfig;
