import ManageTemplates from "@/app/components/feeds/templates/ManageTemplates";
import { TFeed, TTemplate } from "@/lib/db/types";
import { tokenHeader } from "@/lib/utils/api";

type Props = {
  params: { id: string };
  searchParams: { limit?: string; page?: string };
};
const UpdateFeed = async ({ params, searchParams }: Props) => {
  const requestHeaders = tokenHeader();

  const feed: TFeed = await fetch(
    `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/feeds/${params.id}`,
    {
      headers: requestHeaders,
    }
  ).then((res) => res.json());

  const page =
    typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1;
  const limit =
    typeof searchParams.limit === "string" ? parseInt(searchParams.limit) : 10;

  let templates: TTemplate[] = await fetch(
    `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/feeds/${params.id}/templates`,
    {
      headers: requestHeaders,
    }
  ).then((res) => res.json());

  const count = templates.length;

  return (
    <>
      <ManageTemplates
        feed={feed}
        templates={templates}
        limit={limit}
        count={count}
        page={page}
      />
    </>
  );
};

export default UpdateFeed;
