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

export const user = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email").notNull(),
  emailVerified: boolean("email_verified"),
  image: text("image"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
});

export const userRelations = relations(user, ({ many }) => ({
  accounts: many(account),
}));

export const account = pgTable("account", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  provideraccountid: text("provideraccountid").notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: integer("expires_at"),
  tokenType: text("token_type"),
  scope: text("scope"),
  idToken: text("id_token"),
  sessionState: text("session_state"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
});

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const session = pgTable("session", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  provideraccountid: text("provideraccountid").notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: integer("expires_at"),
  tokenType: text("token_type"),
  scope: text("scope"),
  idToken: text("id_token"),
  sessionState: text("session_state"),
});

export const feed = pgTable("feed", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  feedName: text("feed_name").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
});

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

export const template = pgTable("template", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  templateName: text("template_name").notNull(),
  templateContent: text("template_content").notNull(),
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
