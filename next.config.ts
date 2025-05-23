import { env } from "@/env";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL(`${env.NEXT_PUBLIC_STORAGE_BASE_URL}/**`)],
  },
};

export default nextConfig;
