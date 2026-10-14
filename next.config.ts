import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
  // This marketing template is intentionally static: this keeps its public
  // deployment simple, fast, and accessible from any normal web browser.
  // This repository also contains the Expo app. Pin Turbopack to this
  // website directory so Next does not treat the mobile package lockfile as
  // the web project's workspace root.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
