import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['ffmpeg-static', 'fluent-ffmpeg', 'sharp'],
};

export default nextConfig;
