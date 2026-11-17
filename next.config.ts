import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Photos du site : détourées, rangées dans le stockage Supabase de l'ERP (images/site/…).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lwbpekdmhrxqaghlgwsu.supabase.co",
        pathname: "/storage/v1/object/public/images/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
