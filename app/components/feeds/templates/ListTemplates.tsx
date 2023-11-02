"use client";

import Pagination from "@/app/components/Pagination";
import { TFeed, TTemplate } from "@/lib/db/types";
import { useRouter } from "next/navigation";

const ListTemplates = ({
  feed,
  templates,
  page,
  limit,
  count,
  setEditTemplate,
}: {
  feed: TFeed;
  templates: TTemplate[];
  page: number;
  limit: number;
  count: number;
  setEditTemplate: React.Dispatch<React.SetStateAction<TTemplate | null>>;
}) => {
  const { refresh } = useRouter();
  const deleteTemplate = async (id: string) => {
    const res = await fetch(
      `/${process.env.NEXT_PUBLIC_API_PATH}/templates/${id}`,
      {
        method: "DELETE",
      }
    );
    if (res.status === 200) {
      refresh();
    } else {
      console.error("An error occured", res.statusText);
    }
  };

  const sendNotification = async (templateId: string) => {
    const res = await fetch(
      `/${process.env.NEXT_PUBLIC_API_PATH}/notifications`,
      {
        method: "POST",
        body: JSON.stringify({
          templateId,
          feedId: feed.id,
        }),
      }
    );
    if (res.status === 201) {
    } else {
      console.error("An error occured", res.statusText);
    }
  };

  return (
    <>
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
              Message
            </th>

            <th scope="col" className="relative py-3  sm:pr-0">
              <span className="sr-only">Edit and Delete</span>
            </th>
            {/* <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-0">
              <span className="sr-only">Delete</span>
            </th> */}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 ">
          {templates.map((template) => (
            <tr key={template.id} className="w-1">
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium  sm:pl-0">
                {template.name}
              </td>
              <td className=" whitespace-nowrap overflow-hidden text-ellipsis px-3 py-4 text-sm w-8">
                {template.content.length > 20
                  ? `${template.content.slice(0, 20)}...`
                  : template.content}
              </td>
              <td className="flex justify-center whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 gap-4 ">
                <span
                  className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                  onClick={() => sendNotification(template.id)}
                >
                  Send<span className="sr-only">, {template.name}</span>
                </span>
                <span
                  className="text-indigo-600 hover:text-indigo-900"
                  onClick={() => setEditTemplate(template)}
                >
                  Edit<span className="sr-only">, {template.name}</span>
                </span>
                <span
                  className="text-red-600 hover:text-red-900"
                  onClick={() => deleteTemplate(template.id)}
                >
                  Delete<span className="sr-only">, {template.name}</span>
                </span>
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
        path={`/myFeeds/${feed.id}/templates`}
      />
    </>
  );
};

export default ListTemplates;
