import * as schema from "@/lib/db/schema";
import {
  account,
  feed,
  feedTemplate,
  notification,
  subscription,
  template,
  user,
  userFeed,
  userTemplate,
} from "@/lib/db/schema";
import { TFeedTemplate, TUser, TUserFeed, TUserTemplate } from "@/lib/db/types";
import { faker, simpleFaker } from "@faker-js/faker";
import { loadEnvConfig } from "@next/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { cwd, exit } from "node:process";
import { Client } from "pg";

loadEnvConfig(cwd());

const USER_COUNT = 100;

const main = async (seed = null) => {
  if (seed) {
    faker.seed(seed);
    simpleFaker.seed(seed);
  }

  console.log("Seeding database schema...(seed: " + faker.seed() + ")");

  const client = new Client({
    connectionString: process.env.DATABASE_URL!,
  });

  await client.connect().then(() => console.log("Client connected"));
  const db = drizzle(client, { schema });

  migrate(db, { migrationsFolder: "drizzle" });

  // Insert users (records = USER_COUNT)
  let _users: TUser[] = [];
  for (let i = 0; i < USER_COUNT; i++) {
    let firstName = faker.person.firstName();
    let lastName = faker.person.lastName();
    _users.push({
      name: `${firstName} ${lastName}`,
      image: faker.internet.avatar(),
      email: faker.internet.email({
        firstName,
        lastName,
      }),
      emailVerified: simpleFaker.date.recent(),
    });
  }
  await db
    .insert(user)
    .values(_users)
    .then(() => console.log(`Seeded user...(${_users.length} records)`));
  let userIds = (await db.select({ id: user.id }).from(user)).map(
    (userId) => userId.id
  );

  // Create accounts (1-3 per user)
  let _accounts = [];
  for (let userId of userIds) {
    let count = simpleFaker.number.int({ min: 1, max: 3 });

    for (let i = 0; i < count; i++) {
      _accounts.push({
        userId,
        type: "oauth" as "oauth",
        provider: faker.company.buzzPhrase(),
        providerAccountId: faker.string.nanoid(10),
      });
    }
  }

  await db
    .insert(account)
    .values(_accounts)
    .then(() => console.log(`Seeded account...(${_accounts.length} records)`));

  // Create feeds, (to 3-5 per user) (feed owner)
  let _feeds = [];
  for (let userId of userIds) {
    let count = simpleFaker.number.int({ min: 3, max: 5 });

    for (let i = 0; i < count; i++) {
      _feeds.push({
        userId,
        title: faker.company.buzzNoun(),
      });
    }
  }
  await db
    .insert(feed)
    .values(_feeds)
    .then(() => console.log(`Seeded feed...(${_feeds.length} records)`));

  // Create subscriptions
  let _subs = [];
  for (let userId of userIds) {
    _subs.push({
      userId,
      subscription: simpleFaker.string.hexadecimal({ length: 28 }),
      vendor: faker.company.buzzNoun(),
      endpoint: faker.commerce.department(),
    });
  }
  await db
    .insert(subscription)
    .values(_subs)
    .then(() => console.log(`Seeded subscription...(${_subs.length} records)`));

  let feedIds = (await db.select({ id: feed.id }).from(feed)).map(
    (feedId) => feedId.id
  );

  // Create templates ((user count + feed count) * 3)
  let _templates = [];
  for (let i = 0; i < (feedIds.length + userIds.length) * 3; i++) {
    _templates.push({
      name: faker.lorem.slug({ min: 1, max: 3 }),
      content: faker.lorem.sentence({ min: 3, max: 10 }),
    });
  }
  await db
    .insert(template)
    .values(_templates)
    .then(() =>
      console.log(`Seeded template...(${_templates.length} records)`)
    );

  // Subscribe user (to 0-3 feeds) (feed subscriber)
  let _userFeeds: TUserFeed[] = [];
  let _feedIds = [...feedIds];
  for (let userId of userIds) {
    let count = simpleFaker.number.int({ max: 3 });

    for (let i = 0; i < count; i++) {
      let feedId = _feedIds.pop()!;
      _userFeeds.push({
        userId,
        feedId,
      });
    }
  }
  await db
    .insert(userFeed)
    .values(_userFeeds)
    .then(() =>
      console.log(`Seeded user_feed...(${_userFeeds.length} records)`)
    );

  let templateIds = (await db.select({ id: template.id }).from(template)).map(
    (t) => t.id
  );

  // Attach users to 1-2 uniquely attached templates
  let _userTemplates: TUserTemplate[] = [];
  let index = 0;
  for (let userId of userIds) {
    let count = simpleFaker.number.int({ min: 1, max: 2 });

    for (let i = 0; i < count; i++) {
      _userTemplates.push({
        userId,
        templateId: templateIds.at(index)!,
      });
      ++index;
    }
  }
  await db
    .insert(userTemplate)
    .values(_userTemplates)
    .then(() =>
      console.log(`Seeded user_template...(${_userTemplates.length} records)`)
    );

  // Attach feeds to (1-2 uniquely attached templates)
  let _feedTemplates: TFeedTemplate[] = [];
  for (let feedId of feedIds) {
    let count = simpleFaker.number.int({ min: 1, max: 2 });

    for (let i = 0; i < count; i++) {
      _feedTemplates.push({
        feedId,
        templateId: templateIds.at(index)!,
      });
      ++index;
    }
  }
  await db
    .insert(feedTemplate)
    .values(_feedTemplates)
    .then(() =>
      console.log(`Seeded feed_template...(${_feedTemplates.length} records)`)
    );

  let feedTemplateIds = (await db.select().from(feedTemplate)).map(
    ({ feedId, templateId }) => ({
      feedId,
      templateId,
    })
  );

  //  Create notifications (1-2 per feed)
  let _notifs = [];
  for (let _ of userIds) {
    let count = simpleFaker.number.int({ min: 1, max: 2 });

    for (let i = 0; i < count; i++) {
      let feedTemplateId = faker.helpers.arrayElement(feedTemplateIds);
      _notifs.push({
        feedId: feedTemplateId.feedId,
        templateId: feedTemplateId.templateId,
        sent: simpleFaker.datatype.boolean(),
      });
    }
  }
  await db
    .insert(notification)
    .values(_notifs)
    .then(() =>
      console.log(`Seeded notification...(${_notifs.length} records)`)
    );
};

main().then(() => {
  console.log("Schema seeded successfully");
  exit(0);
});
