import ListTemplates from "@/app/profile/templates/ListTemplates";
import TemplateTabs from "@/app/profile/templates/TemplateTabs";
import UpdateTemplates from "@/app/profile/templates/UpdateTemplates";
import { userTemplate } from "@/lib/db/schema";
import { TFeed, TTemplate } from "@/lib/db/types";
import { tokenHeader } from "@/lib/utils/api";
import { UUID } from "crypto";

type TemplateType = "global" | "feed" | undefined;

type Props = {
  params: { id: string };
  searchParams: {
    limit?: string;
    page?: string;
    id?: string;
    type?: string;
  };
};

type TUserTemplate = TTemplate & {
  userId: UUID;
};

type TFeedTemplate = TTemplate & {
  feedId: UUID;
};

type TUserOrFeedTemplate = TUserTemplate & TFeedTemplate;

const Templates = async ({ params, searchParams }: Props) => {
  const requestHeaders = tokenHeader();

  const page =
    typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1;
  const limit =
    typeof searchParams.limit === "string" ? parseInt(searchParams.limit) : 10;

  const id = typeof searchParams.id === "string" ? searchParams.id : undefined;

  const type = searchParams.type as TemplateType;

  let template: TUserOrFeedTemplate | null = null;

  if (id) {
    template = await fetch(
      `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/templates/${id}`,
      {
        headers: requestHeaders,
      }
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.error) {
          return null;
        }
        return json;
      });
  }

  let feeds: TFeed[] | undefined;

  if (type === "feed") {
    feeds = await fetch(
      `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/user/feeds`,
      {
        headers: requestHeaders,
        next: { revalidate: 0 },
      }
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.error) {
          return [];
        }
        return json;
      });
  }

  let templates: TUserOrFeedTemplate[] | null;
  let count;
  let url;
  let countUrl;

  if (type === "feed") {
    url = `${process.env.NEXTAUTH_URL}/${
      process.env.NEXT_PUBLIC_API_PATH
    }/templates/feed?limit=${limit}&offset=${(page - 1) * limit}`;
    countUrl = `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/templates/feed/count`;
  } else {
    url = `${process.env.NEXTAUTH_URL}/${
      process.env.NEXT_PUBLIC_API_PATH
    }/templates/user?limit=${limit}&offset=${(page - 1) * limit}`;
    countUrl = `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/templates/user/count`;
  }

  templates = await fetch(url, {
    headers: requestHeaders,
  })
    .then((res) => res.json())
    .then((json) => json.templates);

  count = await fetch(countUrl, {
    headers: requestHeaders,
  })
    .then((res) => res.json())
    .then((json) => json.count);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-2">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 ">Templates</h1>
          <p className="mt-2 text-sm ">Manage all your templates here.</p>
        </div>
      </div>

      <TemplateTabs type={type} />

      <UpdateTemplates
        template={template}
        feeds={feeds}
        type={!["global", "feed"].includes(type!) ? "global" : type!}
      />

      <ListTemplates
        templates={templates!}
        page={page}
        count={count}
        limit={limit}
        type={!["global", "feed"].includes(type!) ? "global" : type!}
      />
    </div>
  );
};

export default Templates;
