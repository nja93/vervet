"use client";

import { classNames } from "@/lib/utils/app";
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Props {
  pages: number[];
  currentPage: number;
  path: string;
}

export default function Pagination({ pages, currentPage, path }: Props) {
  const [_pages, setPages] = useState<string[]>([]);

  useEffect(() => {
    let surroundCurrent = [];
    if (pages.length <= 7) {
      for (let i = 1; i <= pages.length; i++) {
        surroundCurrent.push(`${i}`);
      }
    } else if (currentPage < 5) {
      for (let i = 1; i <= 5; i++) {
        surroundCurrent.push(`${i}`);
      }
      surroundCurrent.push("...");
      surroundCurrent.push(`${pages.at(-1)}`);
    } else if (pages.length - currentPage < 5) {
      surroundCurrent.push(`${pages.at(0)}`);
      surroundCurrent.push("...");
      for (let i = currentPage; i < pages.at(-1)!; i++) {
        surroundCurrent.push(`${i}`);
      }
      surroundCurrent.push(`${pages.at(-1)}`);
    } else {
      surroundCurrent.push(`${pages.at(0)}`);
      surroundCurrent.push("...");
      surroundCurrent.push(`${currentPage - 1}`);
      surroundCurrent.push(`${currentPage}`);
      surroundCurrent.push(`${currentPage + 1}`);
      surroundCurrent.push("...");
      surroundCurrent.push(`${pages.at(-1)}`);
    }

    setPages(surroundCurrent);
  }, [pages, currentPage]);

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
      <div className="-mt-px flex w-0 flex-1">
        <Link
          href={`${path}?page=${currentPage > 1 ? currentPage - 1 : 1}`}
          className={classNames(
            "inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium  hover:border-gray-300 hover:text-gray-300 disabled:cursor-not-allowed",
            currentPage === 1 ? "cursor-not-allowed" : ""
          )}
        >
          <ArrowLongLeftIcon className="mr-3 h-5 w-5 " aria-hidden="true" />
          Previous
        </Link>
      </div>
      <div className="hidden md:-mt-px md:flex">
        {_pages.map((page) => {
          return (
            <Link
              key={`pagination-${page}`}
              href={page === "..." ? "#" : `${path}?page=${page}`}
              className={classNames(
                "inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium  hover:border-gray-300 hover:text-gray-300",
                page === `${currentPage}`
                  ? "border-indigo-500 text-indigo-600"
                  : ""
              )}
            >
              {page}
            </Link>
          );
        })}
      </div>
      <div className="-mt-px flex w-0 flex-1 justify-end">
        <Link
          href={`${path}?page=${
            currentPage < pages.length ? currentPage + 1 : pages.length
          }`}
          className={classNames(
            "inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium hover:border-gray-300 hover:text-gray-300 disabled:cursor-not-allowed",
            currentPage === pages.length ? "cursor-not-allowed" : ""
          )}
        >
          Next
          <ArrowLongRightIcon className="ml-3 h-5 w-5 " aria-hidden="true" />
        </Link>
      </div>
    </nav>
  );
}
