import React from "react";

type Value = {
  id?: string;
  name?: string;
  value: number | string;
  href?: string;
};

type Stat = {
  key: string;
  value: Value;
  type?: string;
};

interface Props {
  stats: Stat[];
}

const DashboardStats = ({ stats }: Props) => {
  return (
    <div>
      <h3 className="text-base font-semibold leading-6 ">Basic Statistics</h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.key}
            className="overflow-hidden rounded-lg bg-white dark:bg-base-100 px-4 py-5 shadow sm:p-6"
          >
            <dt className="truncate text-sm font-medium ">{item.key}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight ">
              {item.value.href ? (
                <span>
                  <a href={item.value.href}>
                    {item.value.name} ({item.value.value})
                  </a>
                </span>
              ) : (
                item.value.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default DashboardStats;
