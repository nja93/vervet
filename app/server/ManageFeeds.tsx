"use client";

import { TFeed } from "@/lib/db/types";
import { useState } from "react";

type TFeedWithId = TFeed & {
  id: string;
};

interface Props {
  feeds: TFeedWithId[];
}

const ManageFeeds = ({ feeds }: Props) => {
  const [_feeds, setFeeds] = useState(feeds);

  const removeFeedItem = () => {
    setFeeds((prevFeeds) => {
      let _feeds = [...prevFeeds];
      console.log("Removing", _feeds?.pop()?.title);

      return _feeds;
    });
  };
  return (
    <>
      <ul>
        {_feeds.map((feed: TFeedWithId) => (
          <li key={feed.id}>{feed.title}</li>
        ))}
      </ul>
      <button className="btn btn-secondary" onClick={() => removeFeedItem()}>
        Remove Item
      </button>
    </>
  );
};

export default ManageFeeds;
