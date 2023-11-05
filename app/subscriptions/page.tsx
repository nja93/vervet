import Pagination from "@/app/components/Pagination";
import { TFeed, TUser, TUserFeed } from "@/lib/db/types";
import { tokenHeader } from "@/lib/utils/api";
import Link from "next/link";
import React from "react";
import moment from "moment";
import UnfollowFeed from "@/app/subscriptions/UnfollowFeed";

type SearchParams = {
  searchParams: { [key: string]: string | string[] | undefined };
};

type TFeedExtended = TFeed & {
  userFeeds: TUserFeed[];
};

type TUserFeedExtended = TUserFeed & {
  feed: TFeedExtended;
  user: TUser;
};

export default async function MySubscriptions({ searchParams }: SearchParams) {
  const requestHeaders = tokenHeader();

  const page =
    typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1;
  const limit =
    typeof searchParams.limit === "string" ? parseInt(searchParams.limit) : 10;

  const count = await fetch(
    `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/user/following/count`,
    {
      headers: requestHeaders,
    }
  )
    .then((res) => res.json())
    .then((json) => json.count);

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/${
      process.env.NEXT_PUBLIC_API_PATH
    }/user/following?limit=${limit}&offset=${(page - 1) * limit}`,
    {
      headers: requestHeaders,
    }
  );

  const userFeeds: TUserFeedExtended[] = await res.json();

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 ">Subscriptions</h1>
          <p className="mt-2 text-sm ">The ones who have your attention</p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide  sm:pl-0"
                  >
                    Title
                  </th>

                  <th
                    scope="col"
                    className="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide  sm:pl-0"
                  >
                    Owner
                  </th>

                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide "
                  >
                    Subscirbers
                  </th>
                  <th
                    scope="col"
                    className="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide  sm:pl-0"
                  >
                    Joined on
                  </th>

                  <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Unfollow</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 ">
                {userFeeds.map((userFeed) => (
                  <tr key={userFeed.feedId}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium  sm:pl-0">
                      <Link
                        className="link link-hover link-primary"
                        href={`/subscriptions/${userFeed.feedId}`}
                      >
                        {userFeed.feed.title}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm ">
                      <Link
                        href={`/channels/${userFeed.userId}`}
                        className="/owner/${}"
                      >
                        <div className="-m-1.5 flex items-center p-1.5">
                          <img
                            className="h-8 w-8 rounded-full bg-gray-50"
                            src={userFeed.user.image ?? undefined}
                          />
                          <span className="hidden lg:flex lg:items-center">
                            <span
                              className="link link-hover link-primary ml-4 text-sm  leading-6 "
                              aria-hidden="true"
                            >
                              {userFeed.user?.name ?? ""}
                            </span>
                          </span>
                        </div>
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm ">
                      {userFeed.feed.userFeeds.length}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm ">
                      {moment(userFeed.createdAt).format("MMMM Do YYYY")}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <UnfollowFeed userFeed={userFeed} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              pages={Array.from(
                { length: Math.ceil(count / limit) },
                (v, i) => i + 1
              )}
              currentPage={page}
              path="/subscriptions"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
