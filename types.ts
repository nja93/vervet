export type HTMLModalElement = HTMLElement & {
  showModal: () => void;
};

export type FeedPageTabs =
  | "details"
  | "templates"
  | "notifications"
  | undefined;

export type APIError = {
  error: string;
  data: any;
};
