"use client";

import { classNames } from "@/lib/utils/app";
import Link from "next/link";

import { TFeed, TTemplate } from "@/lib/db/types";
import { FeedPageTabs } from "@/types";
import { DocumentTextIcon, MegaphoneIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import UpdateFeed from "@/app/components/feeds/UpdateFeed";
import ManageFeedTemplates from "@/app/components/feeds/templates/ManageTemplates";

export const ManageFeedButton = () => {
  return (
    <Link
      href="/myFeeds/create"
      className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      Add feed
    </Link>
  );
};

const ManageFeed = ({ feed }: { feed: TFeed }) => {
  const { push } = useRouter();

  const tabs = [
    {
      name: "Feed Details",
      href: `/myFeeds/${feed.id}`,
      icon: MegaphoneIcon,
      current: true,
    },
    {
      name: "Templates",
      href: `/myFeeds/${feed.id}/templates`,
      icon: DocumentTextIcon,
      current: false,
    },
  ];

  return (
    <>
      <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            onChange={(e) => push(`${tabs[e.target.selectedIndex].href}`)}
            defaultValue={tabs.find((tab) => tab.current)!.name}
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <a
                  key={tab.name}
                  href={tab.href}
                  data-tab={tab.name}
                  className={classNames(
                    tab.current
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent  hover:border-gray-100 hover:text-gray-500",
                    "group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium"
                  )}
                  aria-current={tab.current ? "page" : undefined}
                >
                  <tab.icon
                    className={classNames(
                      tab.current
                        ? "text-indigo-500"
                        : " group-hover:text-gray-500",
                      "-ml-0.5 mr-2 h-5 w-5"
                    )}
                    aria-hidden="true"
                  />
                  <span>{tab.name}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <UpdateFeed feed={feed} />
    </>
  );
};

export default ManageFeed;
