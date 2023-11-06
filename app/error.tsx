"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";

const Error = () => {
  return (
    <div className="text-center">
      <h1 className="mt-4 text-3xl font-bold tracking-tight  sm:text-5xl">
        An error occured
      </h1>
      <p className="mt-6 text-base leading-7 ">Sorry, something went wrong.</p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Link
          href="/"
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Go back home
        </Link>
      </div>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <button
          onClick={() =>
            signOut({
              callbackUrl: "https://localhost:3000",
            })
          }
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Error;
