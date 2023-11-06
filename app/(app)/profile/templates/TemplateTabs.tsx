import { classNames } from "@/lib/utils/app";
import Link from "next/link";

const TemplateTabs = ({ type = "global" }: { type?: string }) => {
  const tabs = [
    {
      name: "Global",
      href: "/profile/templates?type=global",
      current: !["global", "feed"].includes(type) || type === "global",
    },
    {
      name: "Feed",
      href: "/profile/templates?type=feed",
      current: type === "feed",
    },
  ];

  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <Link
          key={tab.name}
          href={tab.href}
          className={classNames(
            "tab tab-lg tab-lifted ",
            tab.current ? "tab-active" : ""
          )}
        >
          {tab.name}
        </Link>
      ))}
    </div>
  );
};

export default TemplateTabs;
