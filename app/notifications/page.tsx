import NotificationView from "@/app/components/NotificationModalView";
import Pagination from "@/app/components/Pagination";
import SubscribeAction from "@/app/feeds/SubscribeAction";
import {
  TFeed,
  TNotification,
  TTemplate,
  TUser,
  TUserFeed,
} from "@/lib/db/types";
import { tokenHeader } from "@/lib/utils/api";
import moment from "moment";
import Link from "next/link";

type SearchParams = {
  searchParams: { [key: string]: string | string[] | undefined };
};

type TFeedsWithUser = TFeed & {
  user: TUser;
};

type TNotificationWithFeeds = TNotification & {
  feed: TFeedsWithUser;
  template: TTemplate;
};

const Notifications = async ({ searchParams }: SearchParams) => {
  const requestHeaders = tokenHeader();

  const page =
    typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1;
  const limit =
    typeof searchParams.limit === "string" ? parseInt(searchParams.limit) : 10;

  const count = await fetch(
    `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/user/notifications/count`,
    {
      headers: requestHeaders,
    }
  )
    .then((res) => res.json())
    .then((json) => json.count);

  const notifications: TNotificationWithFeeds[] = await fetch(
    `${process.env.NEXTAUTH_URL}/${
      process.env.NEXT_PUBLIC_API_PATH
    }/user/notifications?limit=${limit}&offset=${(page - 1) * limit}`,
    {
      headers: requestHeaders,
    }
  ).then((res) => res.json());

  const feeds: TFeed[] = notifications.map((notification) => notification.feed);

  const subscriptions: { [key: string]: boolean } = (
    await Promise.all(
      feeds.map((feed) =>
        fetch(
          `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/user/following/${feed.id}`,
          {
            headers: requestHeaders,
            next: {
              revalidate: 0,
            },
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
          <h1 className="text-base font-semibold leading-6 ">Notifications</h1>
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
                    Channel Name
                  </th>
                  <th
                    scope="col"
                    className="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide  sm:pl-0"
                  >
                    Feed Name
                  </th>
                  <th
                    scope="col"
                    className="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide  sm:pl-0"
                  >
                    Message
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide "
                  >
                    Received on
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 ">
                {notifications.map((notification, index) => (
                  <tr key={notification.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium  sm:pl-0">
                      <div className="-m-1.5 flex items-center p-1.5">
                        <img
                          className="h-8 w-8 rounded-full bg-gray-50"
                          src={notification.feed.user.image ?? undefined}
                        />
                        <span className="hidden lg:flex lg:items-center">
                          <Link
                            href={`/channels/${notification.feed.user.id}}`}
                            className="link-primary link link-hover ml-4 text-sm  leading-6 "
                            aria-hidden="true"
                          >
                            {notification.feed.user.name ?? ""}
                          </Link>
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm ">
                      {notification.feed.title}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm ">
                      <NotificationView
                        name={notification.template.name}
                        content={notification.template.content}
                        feedName={notification.feed.title}
                        userImage={notification.feed.user.image}
                        userName={notification.feed.user.name}
                      />
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm ">
                      {moment(notification.createdAt).format(
                        "MMMM Do YYYY HH:mm A"
                      )}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <SubscribeAction
                        feed={notification.feed}
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
              path="/notifications"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
