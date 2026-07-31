import type { NextConfig } from "next";

const isGitHubPages =
  process.env.GITHUB_ACTIONS === "true" || process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = isGitHubPages
  ? {
      output: "export",
      trailingSlash: true,
      basePath: "/cst-ai-initiative",
      assetPrefix: "/cst-ai-initiative/",
      typescript: { ignoreBuildErrors: true },
    }
  : {};

export default nextConfig;
