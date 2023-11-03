"use client";

import { classNames } from "@/lib/utils/app";
import { ErrorMessage } from "@hookform/error-message";

import { TFeed, TTemplate } from "@/lib/db/types";
import {
  AtSymbolIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  LinkIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { feed } from "@/lib/db/schema";
import { Tab } from "@headlessui/react";
import ListTemplates from "@/app/components/feeds/templates/ListTemplates";

const ManageTemplates = ({
  feed,
  templates,
  page,
  limit,
  count,
}: {
  feed: TFeed;
  templates: TTemplate[];
  page: number;
  limit: number;
  count: number;
}) => {
  const [editTemplate, setEditTemplate] = useState<TTemplate | null>(null);
  const tabs = [
    {
      name: "Feed Details",
      href: `/myFeeds/${feed.id}`,
      icon: MegaphoneIcon,
      current: false,
    },
    {
      name: "Templates",
      href: `/myFeeds/${feed.id}/templates`,
      icon: DocumentTextIcon,
      current: true,
    },
  ];

  const { push, refresh } = useRouter();
  const {
    register,
    handleSubmit,
    reset,

    formState: { errors, isSubmitting },
  } = useForm({ reValidateMode: "onBlur" });

  useEffect(() => {
    if (editTemplate) {
      reset(editTemplate);

      // document.getElementById("name")?.focus();
    } else {
      reset({ name: "", content: "" });
    }
  }, [editTemplate, reset]);

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
    if (editTemplate) {
      const res = await fetch(
        `/${process.env.NEXT_PUBLIC_API_PATH}/templates/${editTemplate.id}`,
        {
          method: "PUT",
          body: JSON.stringify({ ...data }),
        }
      );
      if (res.status === 200) {
        reset();
        setEditTemplate(null);
        refresh();
      } else {
        console.error("An error occured", res.statusText);
      }
    } else {
      const res = await fetch(
        `/${process.env.NEXT_PUBLIC_API_PATH}/templates`,
        {
          method: "POST",
          body: JSON.stringify({ ...data, feedId: feed.id }),
        }
      );
      if (res.status === 201) {
        reset();
        refresh();
      } else {
        console.error("An error occured", res.statusText);
      }
    }
  };

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

      <ListTemplates
        templates={templates}
        feed={feed}
        page={page}
        count={count}
        limit={limit}
        setEditTemplate={setEditTemplate}
      />
      <div className="border-b border-gray-900 dark:border-white my-12"></div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => checkKeyDown(e)}
      >
        <div className="space-y-12 sm:space-y-16">
          <div>
            <h2 className="text-base font-semibold leading-7">
              Create/Update Template
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 ">
              Personalize your message
            </p>

            <div className="mt-10 space-y-8 border-b border-gray-900/10 dark:border-white pb-12 sm:space-y-0 sm:divide-y dark:sm:divide-white sm:divide-gray-900/10 sm:border-t sm:pb-0">
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6  sm:pt-1.5"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <input
                    type="text"
                    placeholder="Title"
                    {...register("name", {
                      required: "The title is required",
                    })}
                    id="name"
                    className={classNames(
                      "block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 dark:bg-base-100",
                      errors.name ? "focus:ring-red-600" : ""
                    )}
                  />
                  <ErrorMessage errors={errors} name="name" />
                </div>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <Tab.Group>
                  {({ selectedIndex }) => (
                    <>
                      {/* <Tab.List className="flex items-center">
                        <Tab
                          className={({ selected }) =>
                            classNames(
                              selected
                                ? "bg-gray-700 hover:bg-gray-800"
                                : " text-gray-500 hover:bg-gray-100 hover:text-gray-900",
                              "rounded-md border border-transparent px-3 py-1.5 text-sm font-medium"
                            )
                          }
                        >
                          Write
                        </Tab>
                        <Tab
                            className={({ selected }) =>
                              classNames(
                                selected
                                  ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                                  : "bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-900",
                                "ml-2 rounded-md border border-transparent px-3 py-1.5 text-sm font-medium"
                              )
                            }
                          >
                            Preview
                          </Tab>
                      </Tab.List> */}
                      <Tab.Panels className="mt-2">
                        <Tab.Panel className="-m-0.5 rounded-lg p-0.5">
                          <label htmlFor="content" className="sr-onl">
                            Message <span className="text-red-500">*</span>
                          </label>
                          <div>
                            <textarea
                              rows={5}
                              {...register("content", {
                                required: "The message is required",
                              })}
                              id="content"
                              className={classNames(
                                "block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset bg-base-100 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
                                errors.content ? "focus:ring-red-600" : ""
                              )}
                              placeholder="Add your message..."
                              defaultValue={""}
                            />
                            <ErrorMessage errors={errors} name="content" />
                          </div>
                        </Tab.Panel>
                        {/* <Tab.Panel className="-m-0.5 rounded-lg p-0.5">
                            <div className="border-b">
                              <div className="mx-px mt-px px-3 pb-12 pt-2 text-sm leading-5 text-gray-800">
                                Preview content will render here.
                              </div>
                            </div>
                          </Tab.Panel> */}
                      </Tab.Panels>
                    </>
                  )}
                </Tab.Group>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            onClick={() => {
              setEditTemplate(null);
            }}
            className="text-sm font-semibold leading-6"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
};

export default ManageTemplates;
