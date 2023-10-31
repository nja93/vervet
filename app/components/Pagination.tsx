"use client";

import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";

interface Props {
  pages: number[];
  currentPage: number;
  previous: string;
  next: string;
}

export default function Pagination({
  pages,
  currentPage,
  previous,
  next,
}: Props) {
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
      for (let i = currentPage; i <= pages.at(-1)!; i++) {
        surroundCurrent.push(`${i}`);
      }
      surroundCurrent.push(`${pages.at(-1)}`);
    } else {
      surroundCurrent.push(`${pages.at(0)}`);
      surroundCurrent.push("...");
      surroundCurrent.push(`${currentPage - 1}`);
      surroundCurrent.push(`${currentPage}`);
      surroundCurrent.push(`${currentPage + 2}`);
      surroundCurrent.push("...");
      surroundCurrent.push(`${pages.at(-1)}`);
    }

    setPages(surroundCurrent);
  }, [pages, currentPage]);

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
      <div className="-mt-px flex w-0 flex-1">
        <a
          href="#"
          className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
        >
          <ArrowLongLeftIcon
            className="mr-3 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          Previous
        </a>
      </div>
      <div className="hidden md:-mt-px md:flex">
        {_pages.map((page) => {
          return (
            <a
              key={`pagination-${page}`}
              href="#"
              className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              {page}
            </a>
          );
        })}
      </div>
      <div className="-mt-px flex w-0 flex-1 justify-end">
        <a
          href="#"
          className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
        >
          Next
          <ArrowLongRightIcon
            className="ml-3 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </a>
      </div>
    </nav>
  );
}
