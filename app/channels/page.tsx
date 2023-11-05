import Pagination from "@/app/components/Pagination";
import { TUser, TUserFeed } from "@/lib/db/types";
import { tokenHeader } from "@/lib/utils/api";
import Link from "next/link";

type SearchParams = {
  searchParams: { [key: string]: string | string[] | undefined };
};

type TUserWithUserFeeds = TUser & {
  feeds: TUserFeed[];
};

const Channels = async ({ searchParams }: SearchParams) => {
  const requestHeaders = tokenHeader();

  const page =
    typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1;
  const limit =
    typeof searchParams.limit === "string" ? parseInt(searchParams.limit) : 10;

  const count = await fetch(
    `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/channels/count`,
    {
      headers: requestHeaders,
    }
  )
    .then((res) => res.json())
    .then((json) => json.count);

  const channels: TUserWithUserFeeds[] = await fetch(
    `${process.env.NEXTAUTH_URL}/${
      process.env.NEXT_PUBLIC_API_PATH
    }/channels?limit=${limit}&offset=${(page - 1) * limit}`,
    {
      headers: requestHeaders,
    }
  ).then((res) => res.json());

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 ">Channels</h1>
          <p className="mt-2 text-sm ">People who have something to share</p>
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
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide "
                  >
                    <span className="block">Number</span> of Feeds
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 ">
                {channels.map((channel) => (
                  <tr key={channel.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium  sm:pl-0">
                      <div className="-m-1.5 flex items-center p-1.5">
                        <img
                          className="h-8 w-8 rounded-full bg-gray-50"
                          src={channel.image ?? undefined}
                        />
                        <span className="hidden lg:flex lg:items-center">
                          <Link
                            href={`/channels/${channel.id}}`}
                            className="link-primary link link-hover ml-4 text-sm  leading-6 "
                            aria-hidden="true"
                          >
                            {channel?.name ?? ""}
                          </Link>
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm ">
                      {channel.feeds?.length}
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
              path="/channels"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Channels;
