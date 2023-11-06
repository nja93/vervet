"use client";
import Pagination from "@/app/(app)/components/Pagination";
import { TFeed, TUser } from "@/lib/db/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type FeedSearch = TFeed & {
  user: TUser;
};

const FeedSearchResults = ({
  results = [],
  subscriptions,
}: {
  results: FeedSearch[];
  subscriptions: { [key: string]: boolean };
}) => {
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [currentSubs, setCurrentSubs] = useState(subscriptions);

  useEffect(() => {
    setCount(results.length);
  }, [results]);

  async function setSubscriptionState(
    method: "DELETE" | "POST",
    feed: FeedSearch
  ) {
    await fetch(
      `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/user/following/${feed.id}`,
      {
        method,
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (Object.keys(json).length !== 0) {
          const result = results.find((f) => f.id == feed.id);
          if (method === "DELETE") {
            setCurrentSubs((prevSubs) => ({
              ...prevSubs,
              [feed.id]: false,
            }));
            result?.userFeeds?.pop();
          } else {
            setCurrentSubs((prevSubs) => ({
              ...prevSubs,
              [feed.id]: true,
            }));
            result?.userFeeds?.push({});
          }
        }
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.error("Could not complete action", err);
      });
  }

  return (
    <div>
      <h2 className="text-xl">Feed Search Results ({count})</h2>
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
                    Owner
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
                {results
                  .slice((page - 1) * limit, (page - 1) * limit + limit)
                  .map((feed) => (
                    <tr key={feed.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium  sm:pl-0">
                        {feed.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm ">
                        <Link
                          href={`/channels/${feed.user.id}`}
                          className="/owner/${}"
                        >
                          <div className="-m-1.5 flex items-center p-1.5">
                            <img
                              className="h-8 w-8 rounded-full bg-gray-50"
                              src={feed.user.image ?? undefined}
                              alt="user"
                            />
                            <span className="hidden lg:flex lg:items-center">
                              <span
                                className="link link-hover link-primary ml-4 text-sm  leading-6 "
                                aria-hidden="true"
                              >
                                {feed.user?.name ?? ""}
                              </span>
                            </span>
                          </div>
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm ">
                        {feed.userFeeds?.length}
                      </td>
                      <td>
                        {currentSubs?.[feed.id] ? (
                          <span
                            className="cursor-pointer  text-red-600 hover:text-red-900"
                            onClick={() => setSubscriptionState("DELETE", feed)}
                          >
                            Unfollow
                            <span className="sr-only">, {feed.title}</span>
                          </span>
                        ) : (
                          <span
                            className="cursor-pointer  text-indigo-600 hover:text-indigo-900"
                            onClick={() => setSubscriptionState("POST", feed)}
                          >
                            Follow
                            <span className="sr-only">, {feed.title}</span>
                          </span>
                        )}
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
              setPage={setPage}
              path="#"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedSearchResults;
