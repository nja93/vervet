import Provider from "@/app/(app)/components/Provider";
import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "../globals.css";

import NavBar from "@/app/(app)/components/NavBar";
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
    <html lang="en" className="h-full bg-white scroll-smooth focus:scroll-auto">
      <body
        className={classNames(
          inter.className,
          "h-full  text-gray-800 dark:text-gray-200 dark:bg-base-100"
        )}
      >
        <Provider session={session}>
          <NavBar>{children}</NavBar>
        </Provider>
        <script>0</script>
      </body>
    </html>
  );
}
