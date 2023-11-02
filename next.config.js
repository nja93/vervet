/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx"],
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_VAPID_SUBJECT: process.env.NEXT_PUBLIC_VAPID_SUBJECT,
    NEXT_PUBLIC_VAPID_KEY: process.env.NEXT_PUBLIC_VAPID_KEY,
    NEXT_PUBLIC_API_PATH: process.env.NEXT_PUBLIC_API_PATH,
  },
};

module.exports = nextConfig;
