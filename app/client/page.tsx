"use client";

import { TFeed } from "@/lib/db/types";
import { useEffect, useState } from "react";

type TFeedWithId = TFeed & {
  id: string;
};

export default function Home() {
  const [feeds, setFeeds] = useState<TFeedWithId[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await fetch(
        `/${process.env.NEXT_PUBLIC_API_PATH}/feeds?limit=5`
      );

      const _feeds = await res.json();

      setFeeds(_feeds);
      setLoading(false);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (feeds) {
      console.log(feeds);
    }
  }, [feeds]);

  if (loading) {
    return <div>Loading</div>;
  }

  const removeFeedItem = () => {
    setFeeds((prevFeeds) => {
      let _feeds = [...prevFeeds];
      console.log("Removing", _feeds?.pop()?.title);

      return _feeds;
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ul>
        {feeds.map((feed: TFeedWithId) => (
          <li key={feed.id}>{feed.title}</li>
        ))}
      </ul>
      <button className="btn btn-secondary" onClick={() => removeFeedItem()}>
        Remove Item
      </button>
    </main>
  );
}
