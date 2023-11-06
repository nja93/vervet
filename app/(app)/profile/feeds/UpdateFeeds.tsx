"use client";

import { TFeed } from "@/lib/db/types";
import { classNames } from "@/lib/utils/app";
import { ErrorMessage } from "@hookform/error-message";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface Props {
  feed: TFeed | null;
}

const UpdateFeeds = ({ feed }: Props) => {
  const [_feed, setFeed] = useState<TFeed | null>(null);
  const {
    register,
    handleSubmit,
    reset,

    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({ reValidateMode: "onBlur" });

  const { push, refresh } = useRouter();
  useEffect(() => {
    if (feed) {
      setFeed(feed);

      reset(feed);
      document?.getElementById("title")?.focus();
    }
  }, [feed, reset]);

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
    let res;
    if (_feed) {
      res = await fetch(
        `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/feeds/${_feed.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            title: data.title,
            updatedAt: new Date().toISOString(),
          }),
        }
      );
    } else {
      res = await fetch(
        `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/user/feeds`,
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );
    }
    if (res.ok) {
      toast.success("Updated feeds");
      reset({ title: "" });
      setFeed(null);
      if (_feed) {
        push("/profile/feeds");
      } else {
        refresh();
      }
    } else {
      toast.error("Something went wrong");
      console.error("An error occured", res.statusText);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} onKeyDown={(e) => checkKeyDown(e)}>
      <div className="space-y-12 sm:space-y-16">
        <div>
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
                    minLength: { message: "Minimum characters is 5", value: 5 },
                  })}
                  id="title"
                  className={classNames(
                    "block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 dark:bg-base-100",
                    errors.title ? "focus:ring-red-600" : ""
                  )}
                />
                <span className="text-red-700">
                  <ErrorMessage errors={errors} name="title" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        {_feed && (
          <button
            type="button"
            onClick={() => {
              setFeed(null);
              reset({ title: "" });
              push("/profile/feeds");
            }}
            className="text-sm font-semibold leading-6"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (_feed) {
              reset(_feed);
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
          {_feed ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
};

export default UpdateFeeds;
