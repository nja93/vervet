"use client";
import { useSession } from "next-auth/react";
import React from "react";

const Heading = () => {
  const session = useSession();

  return (
    <>
      <h1 className="flex items-center gap-5 text-base font-semibold leading-6 ">
        Feeds by{" "}
        <div className="-m-1.5 flex items-center p-1.5">
          <img
            className="h-8 w-8 rounded-full bg-gray-50"
            src={session?.data?.user.image ?? undefined}
            alt="user"
          />
          <span className="hidden lg:flex lg:items-center">
            <span
              className="link-primary ml-4 text-sm  leading-6 "
              aria-hidden="true"
            >
              {session?.data?.user?.name ?? ""}
            </span>
          </span>
        </div>
      </h1>
      <p className="mt-2 text-sm ">
        Find out what {session?.data?.user?.name ?? ""} wants you to know
      </p>
    </>
  );
};

export default Heading;
