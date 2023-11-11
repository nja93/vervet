"use client";
import { TFeed, TUser } from "@/lib/db/types";
import { useEffect, useState } from "react";

type TUserWithFeeds = TUser & {
  feeds: TFeed[];
}

interface Props {
  user: TUserWithFeeds ;
}

const Heading = ({user}: Props) => {

  const [_user, setUser] = useState(user)

  useEffect(() => {
    if(user){
      setUser(user);
    }
  }, [user])
  
  if (!_user) {
    return <></>
  }
  
  return (
    <>
      <h1 className="flex items-center gap-5 text-base font-semibold leading-6 ">
        Feeds by{" "}
        <div className="-m-1.5 flex items-center p-1.5">
          <img
            className="h-8 w-8 rounded-full bg-gray-50"
            src={_user.image ?? undefined}
            alt="user"
          />
          <span className="hidden lg:flex lg:items-center">
            <span
              className="link-primary ml-4 text-sm  leading-6 "
              aria-hidden="true"
            >
              {_user?.name ?? ""}
            </span>
          </span>
        </div>
      </h1>
      <p className="mt-2 text-sm ">
        Find out what {_user?.name ?? ""} wants you to know
      </p>
    </>
  );
};

export default Heading;
