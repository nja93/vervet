import { relations } from "drizzle-orm";

import {
  bigint,
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";

export const user = pgTable("user", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
});

export const userRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  sessions: many(session),
  subscriptions: many(subscription),
  feeds: many(feed),
  userTemplates: many(userTemplate),
  userFeeds: many(userFeed),
}));

export const account = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
  },
  (acc) => ({
    compoundKey: primaryKey(acc.provider, acc.providerAccountId),
  })
);

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const session = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
);

export const feed = pgTable("feed", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
});

export const feedRelations = relations(feed, ({ one, many }) => ({
  user: one(user, {
    fields: [feed.userId],
    references: [user.id],
  }),
  userFeeds: many(userFeed),
  notifications: many(notification),
  feedTemplates: many(feedTemplate),
}));

export const subscription = pgTable("subscription", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  endpoint: text("endpoint").unique().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  subscription: jsonb("subscription").notNull(),
  vendor: text("vendor"),
  userAgent: text("user_agent"),
  tags: jsonb("tags"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
});

export const subscriptionRelations = relations(subscription, ({ one }) => ({
  user: one(user, {
    fields: [subscription.userId],
    references: [user.id],
  }),
}));

export const notification = pgTable("notification", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  feedId: uuid("feed_id")
    .notNull()
    .references(() => feed.id, { onDelete: "cascade" }),
  templateId: uuid("template_id")
    .notNull()
    .references(() => template.id, { onDelete: "cascade" }),
  requested: bigint("requested", { mode: "number" }),
  delivered: bigint("delivered", { mode: "number" }).default(0),
  responses: bigint("responses", { mode: "number" }).default(0),
  positiveResponses: bigint("positive_responses", { mode: "number" }).default(
    0
  ),
  negativeResponses: bigint("negative_responses", { mode: "number" }).default(
    0
  ),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
});

export const notificationRelations = relations(
  notification,
  ({ one, many }) => ({
    feed: one(feed, {
      fields: [notification.feedId],
      references: [feed.id],
    }),
    template: one(template, {
      fields: [notification.templateId],
      references: [template.id],
    }),
  })
);

export const notificationReplies = pgTable(
  "notification_replies",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    notificationId: uuid("template_id")
      .notNull()
      .references(() => notification.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
  },
  (table) => {
    return {
      userNotificationPkey: primaryKey(table.userId, table.notificationId),
    };
  }
);

export const template = pgTable("template", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  requireInteraction: boolean("require_interaction").default(false),
  renotify: boolean("renotify").default(false),
  positiveAction: text("positive_action"),
  negativeAction: text("negative_action"),
  dismissAction: text("dismiss_action"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
});

export const templateRelations = relations(template, ({ many, one }) => ({
  user: one(userTemplate, {
    fields: [template.id],
    references: [userTemplate.templateId],
  }),
  feed: one(feedTemplate, {
    fields: [template.id],
    references: [feedTemplate.templateId],
  }),
}));

export const userFeed = pgTable("user_feed", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  feedId: uuid("feed_id")
    .notNull()
    .references(() => feed.id, { onDelete: "cascade" }),
  active: boolean("active").default(true),
  inactiveDate: timestamp("inactive_date", {
    withTimezone: true,
    mode: "string",
  }),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
});

export const userFeedRelations = relations(userFeed, ({ one, many }) => ({
  user: one(user, {
    fields: [userFeed.userId],
    references: [user.id],
  }),
  feed: one(feed, {
    fields: [userFeed.feedId],
    references: [feed.id],
  }),
}));

export const userTemplate = pgTable(
  "user_template",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    templateId: uuid("template_id")
      .notNull()
      .references(() => template.id, { onDelete: "cascade" }),
    active: boolean("active").default(true),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
  },
  (table) => {
    return {
      userTemplatePkey: primaryKey(table.userId, table.templateId),
    };
  }
);

export const userTemplateRelations = relations(userTemplate, ({ one }) => ({
  user: one(user, {
    fields: [userTemplate.userId],
    references: [user.id],
  }),
  template: one(template, {
    fields: [userTemplate.templateId],
    references: [template.id],
  }),
}));

export const feedTemplate = pgTable(
  "feed_template",
  {
    feedId: uuid("feed_id")
      .notNull()
      .references(() => feed.id, { onDelete: "cascade" }),
    templateId: uuid("template_id")
      .notNull()
      .references(() => template.id, { onDelete: "cascade" }),
    active: boolean("active").default(true),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
  },
  (table) => {
    return {
      feedTemplatePkey: primaryKey(table.feedId, table.templateId),
    };
  }
);

export const feedTemplateRelations = relations(feedTemplate, ({ one }) => ({
  feed: one(feed, {
    fields: [feedTemplate.feedId],
    references: [feed.id],
  }),
  template: one(template, {
    fields: [feedTemplate.templateId],
    references: [template.id],
  }),
}));
