import ListFeeds from "@/app/profile/feeds/ListFeeds";
import UpdateFeeds from "@/app/profile/feeds/UpdateFeeds";
import { TFeed } from "@/lib/db/types";
import { tokenHeader } from "@/lib/utils/api";

type SearchParams = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Feeds({ searchParams }: SearchParams) {
  const requestHeaders = tokenHeader();

  const page =
    typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1;
  const limit =
    typeof searchParams.limit === "string" ? parseInt(searchParams.limit) : 10;
  const id = typeof searchParams.id === "string" ? searchParams.id : undefined;

  const count = await fetch(
    `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/user/feeds/count`,
    {
      headers: requestHeaders,
    }
  )
    .then((res) => res.json())
    .then((json) => json.count);

  let feed: TFeed | null = null;

  if (id) {
    feed = await fetch(
      `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/feeds/${id}`,
      {
        headers: requestHeaders,
      }
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.error) {
          return null;
        }
        return json;
      });
  }

  const feeds: TFeed[] = await fetch(
    `${process.env.NEXTAUTH_URL}/${
      process.env.NEXT_PUBLIC_API_PATH
    }/user/feeds?limit=${limit}&offset=${(page - 1) * limit}`,
    {
      headers: requestHeaders,
    }
  )
    .then((res) => res.json())
    .then((json) => {
      if (json.error) {
        return [];
      }
      return json;
    });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-2">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 ">Feeds</h1>
          <p className="mt-2 text-sm ">Manage all your feeds here.</p>
        </div>
      </div>
      <UpdateFeeds feed={feed} />
      <ListFeeds feeds={feeds} page={page} count={count} limit={limit} />
    </div>
  );
}
