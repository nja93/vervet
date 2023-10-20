import { feedTemplate, user, userFeed, userTemplate } from "@/lib/db/schema";

type PickNullable<T> = {
  [P in keyof T as null extends T[P] ? P : never]: T[P];
};

type PickNotNullable<T> = {
  [P in keyof T as null extends T[P] ? never : P]: T[P];
};

type OptionalNullable<T> = {
  [K in keyof PickNullable<T>]?: Exclude<T[K], null>;
} & {
  [K in keyof PickNotNullable<T>]: T[K];
};

export type TUser = Omit<OptionalNullable<typeof user.$inferSelect>, "id">;
export type TUserFeed = OptionalNullable<typeof userFeed.$inferSelect>;
export type TUserTemplate = OptionalNullable<typeof userTemplate.$inferSelect>;
export type TFeedTemplate = OptionalNullable<typeof feedTemplate.$inferSelect>;
