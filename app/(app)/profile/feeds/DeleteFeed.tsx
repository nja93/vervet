"use client";
import { TFeed } from "@/lib/db/types";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  feed: TFeed;
}

const DeleteFeed = ({ feed }: Props) => {
  const { refresh } = useRouter();

  const deleteFeed = async (feed: TFeed) => {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/feeds/${feed.id}`,
      {
        method: "DELETE",
      }
    );
    if (res.ok) {
      toast.success("Deleted feed");
      refresh();
    } else {
      toast.error("Something went wrong");
      console.error("An error occured", res.statusText);
    }
  };
  return (
    <span
      onClick={() => deleteFeed(feed)}
      className="cursor-pointer text-red-600 hover:text-red-900"
    >
      Delete<span className="sr-only">, {feed.title}</span>
    </span>
  );
};

export default DeleteFeed;
