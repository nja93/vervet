"use client";
import { TUser, TUserFeed } from "@/lib/db/types";

type UserSearch = TUser & {
  userFeeds: TUserFeed[];
};

const UserSearchResults = ({ results }: { results: UserSearch[] }) => {
  console.log("User search results", results);
  return (
    <div>
      <h2 className="text-xl">User Search Results</h2>
    </div>
  );
};

export default UserSearchResults;
