"use client";
import { classNames } from "@/lib/utils/app";
import {
  UserIcon,
  MegaphoneIcon,
  DocumentTextIcon,
  PresentationChartBarIcon,
} from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

type Tab = {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<
    React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
      title?: string;
      titleId?: string;
    } & React.RefAttributes<SVGSVGElement>
  >;
  current: boolean;
};

const TabNavigation = () => {
  const { push } = useRouter();
  const path = usePathname();

  const tabs: Tab[] = [
    {
      name: "Dashboard",
      href: `/profile`,
      icon: PresentationChartBarIcon,
      current: path == `/profile`,
    },
    {
      name: "Feeds",
      href: `/profile/feeds`,
      icon: MegaphoneIcon,
      current: path == `/profile/feeds`,
    },
    {
      name: "Templates",
      href: `/profile/templates`,
      icon: DocumentTextIcon,
      current: path == `/profile/templates`,
    },
  ];

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300  focus:border-indigo-500 focus:ring-indigo-500 dark:text-gray-50 dark:bg-base-100"
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
  );
};

export default TabNavigation;
