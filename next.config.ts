import { env } from "@/env";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL(`${env.NEXT_PUBLIC_BACKEND_BASE_URL}/storage/**`)],
  },
};

export default nextConfig;
