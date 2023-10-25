import {
  feed,
  feedTemplate,
  user,
  userFeed,
  userTemplate,
} from "@/lib/db/schema";

type PickNullable<T> = {
  [P in keyof T as null extends T[P] ? P : never]: T[P];
};

type PickNotNullable<T> = {
  [P in keyof T as null extends T[P] ? never : P]: T[P];
};

export type OptionalNullable<T> = {
  [K in keyof PickNullable<T>]?: Exclude<T[K], null>;
} & {
  [K in keyof PickNotNullable<T>]: T[K];
};

export type Only<T, U> = {
  [P in keyof T]: T[P];
} & {
  [P in keyof U]?: never;
};

export type Either<T, U> = Only<T, U> | Only<U, T>;

export type TUser = Omit<OptionalNullable<typeof user.$inferSelect>, "id">;
export type TFeed = Omit<OptionalNullable<typeof feed.$inferSelect>, "id">;
export type TUserFeed = OptionalNullable<typeof userFeed.$inferSelect>;
export type TUserTemplate = OptionalNullable<typeof userTemplate.$inferSelect>;
export type TFeedTemplate = OptionalNullable<typeof feedTemplate.$inferSelect>;
