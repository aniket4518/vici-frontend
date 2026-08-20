import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
