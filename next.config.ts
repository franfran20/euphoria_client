import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "salmon-thick-gazelle-208.mypinata.cloud",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
