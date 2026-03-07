/** @type {import('next').NextConfig} */
const fallbackSupabaseHostname = "vjjcrivjvwaqjvmbfueq.supabase.co";

let supabaseHostname = fallbackSupabaseHostname;

if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  try {
    supabaseHostname = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname;
  } catch {
    supabaseHostname = fallbackSupabaseHostname;
  }
}

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHostname,
        pathname: "/storage/v1/object/public/**",
      },
    ],
    minimumCacheTTL: 2678400,
    formats: ["image/avif", "image/webp"],
    qualities: [45, 55, 60, 70, 75, 85],
  },
};

export default nextConfig;
