"use client";
import { TFeed } from "@/lib/db/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const SubscribeAction = ({
  feed,
  subscriptions,
}: {
  id?: string;
  feed: TFeed;
  subscriptions: { [key: string]: boolean };
}) => {
  const [subscribed, setSubscribed] = useState<boolean>(subscriptions[feed.id]);
  const { refresh } = useRouter();

  useEffect(() => {
    setSubscribed(subscriptions[feed.id]);
  }, [subscriptions, feed.id]);

  async function setSubscriptionState(method: "DELETE" | "POST") {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/user/following/${feed.id}`,
      {
        method,
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (method === "DELETE") {
          toast.success(`Unfollowed ${feed.title}`);
        } else {
          toast.success(`Following ${feed.title}`);
        }
        setSubscribed(Object.keys(json).length !== 0);

        refresh();
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.error("Could not complete action", err);
      });
  }

  if (subscribed) {
    return (
      <span
        className="cursor-pointer  text-red-600 hover:text-red-900"
        onClick={() => setSubscriptionState("DELETE")}
      >
        Unfollow<span className="sr-only">, {feed.title}</span>
      </span>
    );
  }

  return (
    <span
      className="cursor-pointer text-indigo-600 hover:text-indigo-900"
      onClick={() => setSubscriptionState("POST")}
    >
      Follow<span className="sr-only">, {feed.title}</span>
    </span>
  );
};

export default SubscribeAction;
