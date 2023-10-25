import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
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
  notifications: many(userNotification),
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
  userFeed: many(userFeed),
}));

export const subscription = pgTable("subscription", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  subscription: text("subscription").notNull(),
  vendor: text("vendor"),
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
  sent: boolean("sent").default(false),
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
    savedNotifications: many(userNotification),
  })
);

export const userNotification = pgTable(
  "user_notification",
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

export const userNotificationRelations = relations(
  userNotification,
  ({ one }) => ({
    user: one(user, {
      fields: [userNotification.userId],
      references: [user.id],
    }),
    notification: one(notification, {
      fields: [userNotification.notificationId],
      references: [notification.id],
    }),
  })
);

export const template = pgTable("template", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
});

export const userFeed = pgTable(
  "user_feed",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    feedId: uuid("feed_id")
      .notNull()
      .references(() => feed.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
  },
  (table) => {
    return {
      userFeedPkey: primaryKey(table.userId, table.feedId),
    };
  }
);

export const userFeedRelations = relations(userFeed, ({ one }) => ({
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
    fields: [userTemplate.templateId],
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
    fields: [feedTemplate.templateId],
    references: [feed.id],
  }),
  template: one(template, {
    fields: [feedTemplate.templateId],
    references: [template.id],
  }),
}));
