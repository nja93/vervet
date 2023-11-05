"use client";
import { TFeed } from "@/lib/db/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SubscribeAction = ({
  feed,
  subscriptions,
}: {
  feed: TFeed;
  subscriptions: { [key: string]: boolean };
}) => {
  const [subscribed, setSubscribed] = useState<boolean>(subscriptions[feed.id]);
  const { refresh } = useRouter();

  async function setSubscriptionState(method: "DELETE" | "POST") {
    const res = await fetch(
      `/${process.env.NEXT_PUBLIC_API_PATH}/user/following/${feed.id}`,
      {
        method,
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        setSubscribed(Object.keys(json).length !== 0);

        refresh();
      })
      .catch((err) => {
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
