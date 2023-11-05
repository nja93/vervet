"use client";

import { classNames } from "@/lib/utils/app";
import { ErrorMessage } from "@hookform/error-message";

import { TFeed, TTemplate } from "@/lib/db/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { useSession } from "next-auth/react";

type TUserTemplate = TTemplate & {
  userId?: string;
};

type TFeedTemplate = TTemplate & {
  feedId?: string;
};

type TFeedOrUserTemplate = TUserTemplate & TFeedTemplate;

const UpdateTemplates = ({
  template,
  type = "global",
  feeds = [{ title: "No feeds created", id: "", userId: "" }],
}: {
  template: TFeedOrUserTemplate | null;
  type: string;
  feeds: TFeed[] | undefined;
}) => {
  const [_template, setTemplate] = useState<TFeedOrUserTemplate | null>(null);

  const session = useSession();
  const userId = session.data?.user.id;

  const {
    register,
    handleSubmit,
    reset,

    formState: { errors, isSubmitting },
  } = useForm({
    reValidateMode: "onBlur",
    defaultValues: _template
      ? _template
      : {
          name: "",
          feedId: "",
          renotify: false,
          requireInteraction: false,
          content: "",
        },
  });

  const { push, refresh } = useRouter();
  useEffect(() => {
    if (template) {
      setTemplate(template);
      reset(template);
      document?.getElementById("name")?.focus();
    } else {
      setTemplate(null);
      reset();
    }
  }, [template, reset]);

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
    let id;
    if (type === "global") {
      id = userId;
      delete data.feedId;
    } else {
      id = data.feedId;
    }

    if (_template) {
      delete data.id;

      const res = await fetch(
        `/${process.env.NEXT_PUBLIC_API_PATH}/templates/${_template.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            ...data,
            updatedAt: new Date().toISOString(),
          }),
        }
      );
      if (res.ok) {
        setTemplate(null);

        reset({
          name: "",
          feedId: "",
          renotify: false,
          requireInteraction: false,
          content: "",
        });
        push(`/profile/templates?type=${type}`);
      } else {
        console.error("An error occured", res.statusText);
      }
    } else {
      delete data.feedId;
      let url;
      if (type === "feed") {
        url = `/${process.env.NEXT_PUBLIC_API_PATH}/templates/feed/${id}`;
      } else {
        url = `/${process.env.NEXT_PUBLIC_API_PATH}/templates/user/${id}`;
      }

      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (res.ok) {
        reset();
        setTemplate(null);
        refresh();
      } else {
        console.error("An error occured", res.statusText);
      }
    }
  };

  return (
    <>
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
              {type === "feed" && (
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                  <label
                    htmlFor="feedId"
                    className="block text-sm font-medium leading-6 sm:pt-1.5"
                  >
                    Feed <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2 sm:col-span-2 sm:mt-0">
                    <select
                      id="feedId"
                      {...register("feedId", {
                        required: "Feed required",
                        minLength: { message: "Feed required", value: 10 },
                        min: { message: "Feed required", value: 10 },
                      })}
                      defaultValue={template?.feedId ?? ""}
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 dark:text-gray-50 dark:bg-base-100"
                      disabled={type !== "feed"}
                    >
                      <option value="">Select a feed</option>
                      {feeds.map((feed) => {
                        return (
                          <option
                            key={feed.id}
                            value={feed.id}
                            defaultValue={template?.feedId}
                          >
                            {feed.title}
                          </option>
                        );
                      })}
                    </select>
                    <span className="text-red-700">
                      <ErrorMessage errors={errors} name="feedId" />
                    </span>
                  </div>
                </div>
              )}

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
                    placeholder="Name"
                    {...register("name", {
                      required: "The name is required",
                    })}
                    id="name"
                    className={classNames(
                      "block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 dark:bg-base-100",
                      errors.name ? "focus:ring-red-600" : ""
                    )}
                  />
                  <span className="text-red-700">
                    <ErrorMessage errors={errors} name="name" />
                  </span>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6  sm:pt-1.5"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
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
                  <span className="text-red-700">
                    <ErrorMessage errors={errors} name="content" />
                  </span>
                </div>
              </div>

              <fieldset>
                <legend className="sr-only">Behaviour</legend>
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:py-6">
                  <div className="text-sm leading-6" aria-hidden="true">
                    Behaviour
                  </div>
                  <div className="mt-4 sm:col-span-2 sm:mt-0">
                    <div className="max-w-lg space-y-6">
                      <div className="relative flex gap-x-3">
                        <div className="flex h-6 items-center">
                          <input
                            id="renotify"
                            {...register("renotify")}
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                        </div>
                        <div className="text-sm leading-6">
                          <label htmlFor="renotify" className="font-medium">
                            Renotify
                          </label>
                          <p className="mt-1">
                            Renotify user if the same feed is sent before they
                            read the previous one.
                          </p>
                        </div>
                      </div>
                      <div className="relative flex gap-x-3">
                        <div className="flex h-6 items-center">
                          <input
                            id="requireInteraction"
                            name="requireInteraction"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                        </div>
                        <div className="text-sm leading-6">
                          <label
                            htmlFor="requireInteraction"
                            className="font-medium"
                          >
                            Require Interaction
                          </label>
                          <p className="mt-1 ">
                            Notification disappears only when user interacts
                            with it{" "}
                            <em className="font-semibold">
                              {" "}
                              (on some systems)
                            </em>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="positiveAction"
                  className="block text-sm font-medium leading-6  sm:pt-1.5"
                >
                  Positive Action Text
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <input
                    type="text"
                    placeholder="Default: 👍 Yay"
                    {...register("positiveAction")}
                    id="positiveAction"
                    className={classNames(
                      "block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 dark:bg-base-100"
                    )}
                  />
                </div>
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="negativeAction"
                  className="block text-sm font-medium leading-6  sm:pt-1.5"
                >
                  Negative Action Text
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <input
                    type="text"
                    placeholder="Default: 👎 Nay"
                    {...register("negativeAction")}
                    id="negativeAction"
                    className={classNames(
                      "block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 dark:bg-base-100"
                    )}
                  />
                </div>
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="dismissAction"
                  className="block text-sm font-medium leading-6  sm:pt-1.5"
                >
                  Dismiss Action Text
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <input
                    type="text"
                    placeholder="Default: Ignore"
                    {...register("dismissAction")}
                    id="dismissAction"
                    className={classNames(
                      "block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 dark:bg-base-100"
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            onClick={() => {
              if (_template) {
                reset(_template);
              } else {
                reset();
              }
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
            {_template ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </>
  );
};

export default UpdateTemplates;
