"use client";
import SubscribeAction from "@/app/(app)/components/SubscribeAction";
import { TFeed } from "@/lib/db/types";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type TFeedSubs = Omit<TFeed, "userFeeds"> & {
  subs: number | string;
  userId: string;
  userName: string;
  userImage: string;
};

interface Props {
  feeds: TFeedSubs[];
  subscriptions: {
    [key: string]: boolean;
  };
}

const TopFeeds = ({ feeds, subscriptions }: Props) => {
  const [_feeds, setFeeds] = useState(feeds);

  useEffect(() => {
    setFeeds(feeds);
  }, [feeds]);

  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 ">Top Feeds</h1>
            <p className="mt-2 text-sm ">The ones with the most attention</p>
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
                      Channel
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
                  {_feeds.map((feed) => (
                    <tr key={feed.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium  sm:pl-0">
                        {feed.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm ">
                        <Link
                          href={`/channels/${feed.userId}`}
                          className="/owner/${}"
                        >
                          <div className="-m-1.5 flex items-center p-1.5">
                            <img
                              className="h-8 w-8 rounded-full bg-gray-50"
                              src={feed.userImage ?? undefined}
                              alt="user"
                            />
                            <span className="hidden lg:flex lg:items-center">
                              <span
                                className="link link-hover link-primary ml-4 text-sm  leading-6 "
                                aria-hidden="true"
                              >
                                {feed.userName ?? ""}
                              </span>
                            </span>
                          </div>
                        </Link>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopFeeds;
