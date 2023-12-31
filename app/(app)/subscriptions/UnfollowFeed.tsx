"use client";
import { TFeed, TUserFeed } from "@/lib/db/types";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

type TFeedExtended = TFeed & {
  userFeeds: TUserFeed[];
};

type TUserFeedExtended = TUserFeed & {
  feed: TFeedExtended;
};
const UnfollowFeed = ({ userFeed }: { userFeed: TUserFeedExtended }) => {
  const { refresh } = useRouter();
  const unfollow = async () => {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/user/following/${userFeed.feedId}`,
      {
        method: "DELETE",
      }
    );
    const json = await res.json();
    if (res.ok) {
      toast.success("Unfollowed feed");
      refresh();
    } else {
      toast.success("Something went wrong");
      console.error("An error occured", res.statusText);
    }
  };

  return (
    <span
      onClick={() => unfollow()}
      className="cursor-pointer text-red-600 hover:text-red-900"
    >
      Unfollow
      <span className="sr-only">, {userFeed.feed.title}</span>
    </span>
  );
};

export default UnfollowFeed;
