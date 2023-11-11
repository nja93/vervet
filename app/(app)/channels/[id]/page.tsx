import Pagination from "@/app/(app)/components/Pagination";

import { TFeed, TUser, TUserFeed } from "@/lib/db/types";
import { tokenHeader } from "@/lib/utils/api";
import React from "react";
import Heading from "@/app/(app)/channels/[id]/Heading";
import SubscribeAction from "@/app/(app)/components/SubscribeAction";

type SearchParams = {
  params: {
    id: string;
  },
  searchParams: { [key: string]: string | string[] | undefined };
};

type TFeedWithSubs = TFeed & {
  subs: string | number;
}

type TUserWithFeeds = TUser & {
  feeds: TFeedWithSubs[];
}

const ChannelFeeds = async ({ params, searchParams }: SearchParams) => {
  const requestHeaders = tokenHeader();

  const page =
    typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1;
  const limit =
    typeof searchParams.limit === "string" ? parseInt(searchParams.limit) : 10;

  const count = await fetch(
    `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/channels/${params.id}/count`,
    {
      headers: requestHeaders,
      next: {
        revalidate: 0
      }
    }
  )
    .then((res) => res.json())
    .then((json) => json?.count);

  const user: TUserWithFeeds = await fetch(
    `${process.env.NEXTAUTH_URL}/${
      process.env.NEXT_PUBLIC_API_PATH
    }/channels/${params.id}?limit=${limit}&offset=${(page - 1) * limit}`,
    {
      headers: requestHeaders,
      next: {
        revalidate: 0
      }
    }
  ).then((res) => res.json());

  let feeds;
  feeds = user?.feeds ?? []

  const subscriptions: { [key: string]: boolean } = (
    await Promise.all(
      feeds.map((feed) =>
        fetch(
          `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/user/following/${feed.id}`,
          {
            headers: requestHeaders,
            next: {
              revalidate: 0
            }
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
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <Heading user={user} />
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
                    className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide "
                  >
                    Subscirbers
                  </th>

                  <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Manage</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 ">
                {feeds.map((feed) => (
                  <tr key={feed.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium  sm:pl-0">
                      {feed.title}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm ">
                      {feed.subs}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <SubscribeAction
                        feed={feed}
                        subscriptions={subscriptions}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              pages={Array.from(
                { length: Math.ceil(count / limit) },
                (v, i) => i
              )}
              currentPage={page}
              path="/feeds"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelFeeds;
