import TabNavigation from "@/app/profile/TabNavigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vervet",
  description: "Let the people know",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TabNavigation />
      {children}
    </>
  );
}
