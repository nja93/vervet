import Provider from "@/app/components/Provider";
import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";

import NavBar from "@/app/components/NavBar";
import { classNames } from "@/lib/utils/app";
import { getServerSession } from "next-auth";

const inter = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vervet",
  description: "Let the people know",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
