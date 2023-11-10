import MostActiveFeeds from "@/app/(app)/home/MostActiveFeeds";
import RecentNotifications from "@/app/(app)/home/RecentNotifications";
import TopFeeds from "@/app/(app)/home/TopFeeds";
import { TFeed, TUserFeed } from "@/lib/db/types";
import { tokenHeader } from "@/lib/utils/api";

type TFeedSubs = Omit<TFeed, "userFeeds"> & {
  subs: number | string;
  userId: string;
  userName: string;
  userImage: string;
};

export default async function Home() {
  const requestHeaders = tokenHeader();

  const stats = await fetch(
    `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/user/homeStats`,
    {
      headers: requestHeaders,
      next: {
        revalidate: 0,
      },
    }
  ).then((res) => res.json()).catch(e => []);

  const topFeeds: TFeedSubs[] = stats?.topFeeds ?? [];
  const mostActiveFeeds: TFeedSubs[] = stats?.mostActiveFeeds ?? null;
  // const recentNotifications = stats.recentNotifications;

  const subscriptions: { [key: string]: boolean } = (
    await Promise.all(
      [...topFeeds, ...mostActiveFeeds].map((feed) =>
        fetch(
          `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/user/following/${feed.id}`,
          {
            headers: requestHeaders,
          }
        ).then((res) => res.json())
      )
    )
  ).reduce((acc, curr: TUserFeed) => {
    if (Object.keys(curr).length) {
      return { ...acc, [curr.feedId]: true };
    }
    return acc;
  }, {});

  return (
    <>
      {/* <RecentNotifications notifications={recentNotifications} />
      <div className="divider py-12"></div> */}
      <MostActiveFeeds feeds={mostActiveFeeds ?? []} subscriptions={subscriptions} />
      <div className="divider py-12"></div>
      <TopFeeds feeds={topFeeds ?? []} subscriptions={subscriptions} />
    </>
  );
}
