import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // CAD drawing/model uploads (STEP/IGES/Parasolid) run well past
      // Next's 1MB Server Action default — spec §4's RFQ file upload.
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
