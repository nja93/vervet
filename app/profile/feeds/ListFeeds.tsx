"use client";
import Pagination from "@/app/components/Pagination";
import DeleteFeed from "@/app/profile/feeds/DeleteFeed";
import { TFeed } from "@/lib/db/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  feeds: TFeed[];
  page: number;
  count: number;
  limit: number;
}

const ListFeeds = ({ feeds, page, count, limit }: Props) => {
  const [feedTemplates, setFeedTemplates] = useState<any>([]);
  const [userTemplates, setUserTemplates] = useState<any>([[]]);

  useEffect(() => {
    async function getUserTemplates() {
      await fetch(
        `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/user/templates`
      )
        .then((res) => res.json())
        .then((json) => setUserTemplates(json));
    }
    getUserTemplates();
    setFeedTemplates(
      feeds.reduce((acc: any, curr: any) => {
        let temp = [];
        for (let i = 0; i < curr.feedTemplates.length; i++) {
          temp.push(curr.feedTemplates[i].template);
        }
        return { ...acc, [curr.id]: temp };
      }, [])
    );
  }, [feeds]);

  const sendNotification = async (feedId: string, templateId: string) => {
    if (!templateId) {
      toast.error("Select a template to use");
      return;
    }

    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/notifications`,
      {
        method: "POST",
        body: JSON.stringify({
          templateId,
          feedId,
        }),
      }
    );
    if (res.ok) {
      toast.success("Request filed");
    } else {
      toast.error("Something went wrong");
      console.error("An error occured", res.statusText);
    }
  };

  return (
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
                  Subscribers
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide "
                >
                  Template
                </th>

                <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-0">
                  <span className="text-red-500 sr-only">Actions</span>
                </th>
                {/* <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-0">
                  <span className="sr-only">Edit</span>
                </th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 ">
              {feeds?.map((feed) => (
                <tr key={feed.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium  sm:pl-0">
                    {feed.title}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm ">
                    {feed.userFeeds?.length}
                  </td>
                  <td>
                    <select
                      name="templates"
                      id="templates"
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 dark:text-gray-50 dark:bg-base-100"
                    >
                      {userTemplates.map((template: any, index: number) => (
                        <option
                          key={`${template.id}.${index}`}
                          value={template.id}
                        >
                          {template.name}
                        </option>
                      ))}
                      {feedTemplates?.[feed.id]?.map(
                        (template: any, index: number) => (
                          <option
                            key={`${template.id}.${index}`}
                            value={template.id}
                          >
                            {template.name}
                          </option>
                        )
                      )}
                    </select>
                  </td>

                  <td className="flex justify-end gap-5 whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <DeleteFeed feed={feed} />
                    <span
                      onClick={() => {
                        const templateId = (
                          document.getElementById(
                            "templates"
                          )! as HTMLSelectElement
                        ).value;
                        sendNotification(feed.id, templateId);
                      }}
                      className="cursor-pointer text-indigo-600 hover:text-indigo-700"
                    >
                      Send with template
                      <span className="sr-only">, {feed.title}</span>
                    </span>
                    <a
                      href={`/profile/feeds?id=${feed.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit<span className="sr-only">, {feed.title}</span>
                    </a>
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
            path="/profile/feeds"
          />
        </div>
      </div>
    </div>
  );
};

export default ListFeeds;
