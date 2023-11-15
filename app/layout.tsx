import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";

import { classNames } from "@/lib/utils/app";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

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
    <html lang="en" className="h-full bg-white scroll-smooth">
      <body
        className={classNames(
          inter.className,
          "h-full  text-gray-800 dark:text-gray-200 dark:bg-base-100"
        )}
      >
        {children}
      </body>
    </html>
  );
}
