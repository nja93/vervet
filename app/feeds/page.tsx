import { TFeed } from "@/lib/db/types";
import { auth } from "@/lib/utils/authOptions";
import Link from "next/link";
import { json } from "stream/consumers";

type TFeedWithId = TFeed & {
  id: string;
};

type SearchParams = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function MyFeeds({ searchParams }: SearchParams) {
  const session = await auth();
  const page =
    typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1;
  const limit =
    typeof searchParams.limit === "string" ? parseInt(searchParams.limit) : 10;
  const count = await fetch(
    `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/users/${session?.user?.id}/feeds/count`
  )
    .then((res) => res.json())
    .then((json) => json.count);

  const feeds: TFeedWithId[] = await fetch(
    `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/users/${
      session?.user?.id
    }/feeds?limit=${limit}&offset=${(page - 1) * limit}`
  ).then((res) => res.json());

  return (
    <div>
      <ul>
        {feeds.map((feed) => (
          <li key={feed.id}>{feed.title}</li>
        ))}
      </ul>
      <div className="join">
        <Link
          className="join-item btn"
          href={`/feeds?page=${page > 1 ? page - 1 : 1}`}
        >
          «
        </Link>
        <button className="join-item btn">Page {page}</button>
        <Link
          className="join-item btn"
          href={`/feeds?page=${feeds.length < limit ? page : page + 1}`}
        >
          »
        </Link>
      </div>
      <p>
        Showing {limit * (page - 1) + 1} to {limit * (page - 1) + feeds.length}{" "}
        of {count} results
      </p>
    </div>
  );
}
