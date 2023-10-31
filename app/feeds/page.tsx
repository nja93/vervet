import Pagination from "@/app/components/Pagination";
import { TFeed } from "@/lib/db/types";
import { tokenHeader } from "@/lib/utils/api";
import Link from "next/link";

type TFeedWithId = TFeed & {
  id: string;
};

type SearchParams = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function MyFeeds({ searchParams }: SearchParams) {
  const requestHeaders = tokenHeader();

  const page =
    typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1;
  const limit =
    typeof searchParams.limit === "string" ? parseInt(searchParams.limit) : 10;

  const count = await fetch(
    `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/user/feeds/count`,
    {
      headers: requestHeaders,
    }
  )
    .then((res) => res.json())
    .then((json) => json.count);

  const feeds: TFeedWithId[] = await fetch(
    `${process.env.NEXTAUTH_URL}/${
      process.env.NEXT_PUBLIC_API_PATH
    }/user/feeds?limit=${limit}&offset=${(page - 1) * limit}`,
    {
      headers: requestHeaders,
    }
  ).then((res) => res.json());

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table table-zebra table-pin-rows">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Subscribers</th>
            </tr>
          </thead>
          <tbody>
            {feeds.map((feed, index) => (
              <tr key={feed.id}>
                <th>{index + 1}</th>
                <td>{feed.title}</td>
                <td>0</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Subscribers</th>
            </tr>
          </tfoot>
          {/* <div className="join">
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
            Showing {limit * (page - 1) + 1} to{" "}
            {limit * (page - 1) + feeds.length} of {count} results
          </p> */}
        </table>
        {/* <Pagination
          pages={Array.from({ length: 5 }, (v, i) => i + 1)}
          currentPage={page}
          previous={`/feeds?page=${page > 1 ? page - 1 : 1}`}
          next={`/feeds?page=${feeds.length < limit ? page : page + 1}`}
        /> */}
      </div>
      {/* <ul>
        {feeds.map((feed) => (
          <li key={feed.id}>{feed.title}</li>
        ))}
      </ul> */}
    </div>
  );
}
