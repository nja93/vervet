import ManageFeed from "@/app/components/feeds/ManageFeed";
import { TFeed } from "@/lib/db/types";
import { tokenHeader } from "@/lib/utils/api";

type Props = {
  params: { id: string };
};
const UpdateFeed = async ({ params }: Props) => {
  const requestHeaders = tokenHeader();

  const feed: TFeed = await fetch(
    `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/feeds/${params.id}`,
    {
      headers: requestHeaders,
    }
  ).then((res) => res.json());

  return <ManageFeed feed={feed} />;
};

export default UpdateFeed;
