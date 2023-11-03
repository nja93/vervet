"use client";

import { classNames } from "@/lib/utils/app";
import { ErrorMessage } from "@hookform/error-message";

import { TFeed } from "@/lib/db/types";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

const UpdateFeed = ({ feed }: { feed: TFeed }) => {
  const { push } = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    setValue,

    formState: { errors, isSubmitting },
  } = useForm({ reValidateMode: "onBlur", defaultValues: feed });

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
    const res = await fetch(
      `/${process.env.NEXT_PUBLIC_API_PATH}/feeds/${feed.id}`,
      {
        method: data.active ? "PUT" : "DELETE",
        body: data.active && JSON.stringify(data),
      }
    );
    if (res.status === 200) {
      push("/myFeeds");
    } else {
      console.error("An error occured", res.statusText);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} onKeyDown={(e) => checkKeyDown(e)}>
      <div className="space-y-12 sm:space-y-16">
        <div>
          <h2 className="text-base font-semibold leading-7">Feed Details</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 ">
            Update your feed details
          </p>

          <div className="mt-10 space-y-8 border-b border-gray-900/10 dark:border-white pb-12 sm:space-y-0 sm:divide-y dark:sm:divide-white sm:divide-gray-900/10 sm:border-t sm:pb-0">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6  sm:pt-1.5"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  placeholder="Title"
                  {...register("title", {
                    required: "The title is required",
                    minLength: {
                      message: "Minimum characters is 5",
                      value: 5,
                    },
                  })}
                  id="title"
                  className={classNames(
                    "block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 dark:bg-base-100",
                    errors.title ? "focus:ring-red-600" : ""
                  )}
                />
                <ErrorMessage errors={errors} name="title" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          onClick={() => reset()}
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

      <div className="min-h-screen max-h-full mt-6 flex items-center justify-end gap-x-6">
        <button
          id="delete"
          onClick={() => setValue("active", false)}
          disabled={isSubmitting}
          className="inline-flex gap-1 justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
        >
          <ExclamationTriangleIcon className="w-5 h-5" /> Delete
        </button>
      </div>
    </form>
  );
};

export default UpdateFeed;
