import ManageFeeds from "@/app/server/ManageFeeds";
import { TFeed } from "@/lib/db/types";

type TFeedWithId = TFeed & {
  id: string;
};

export default async function Home() {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/feeds?limit=5`
  );

  const feeds: TFeedWithId[] = await res.json();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ManageFeeds feeds={feeds} />
    </main>
  );
}
