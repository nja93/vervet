import FeedSearchResults from "@/app/search/FeedSearchResults";
import UserSearchResults from "@/app/search/UserSearchResults";
import { TFeed, TUser, TUserFeed } from "@/lib/db/types";
import { tokenHeader } from "@/lib/utils/api";
import React from "react";

type SearchParams = {
  searchParams: { query: string; feedPage?: string };
};

type FeedSearch = TFeed & {
  user: TUser;
};

type UserSearch = TUser & {
  userFeeds: TUserFeed[];
};

type GeneralSearch = {
  feeds: FeedSearch[];
  users: UserSearch[];
};

const GeneralSearch = async ({ searchParams }: SearchParams) => {
  const requestHeaders = tokenHeader();

  const query = searchParams.query;

  const feedPage =
    typeof searchParams.feedPage === "string"
      ? parseInt(searchParams.feedPage)
      : 1;
  const search: GeneralSearch = await fetch(
    `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/search/general?query=${query}`,
    {
      headers: requestHeaders,
    }
  ).then((res) => res.json());

  const subscriptions: { [key: string]: boolean } = (
    await Promise.all(
      search.feeds.map((feed) =>
        fetch(
          `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/user/following/${feed.id}`,
          {
            headers: requestHeaders,
          }
        ).then((res) => res.json())
      )
    )
  ).reduce((acc, curr: TUserFeed) => {
    if (Object.keys(curr).length) {
      return { ...acc, [curr.feedId]: true };
    }
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-10">
      {/* <UserSearchResults results={search.users} /> */}
      <FeedSearchResults results={search.feeds} subscriptions={subscriptions} />
    </div>
  );
};

export default GeneralSearch;
