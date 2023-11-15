# Database
## Introduction
The database chosen for use is Postgres (on account of the DrizzleORM packages) but can be whatever you want, as long as Drizzle has a way to interface with it (meaning alternatively SQL or SQLite).
The APIs (3-API) assume the use of Drizzle so any change to that would require a huge overhaul of the way they work.
DrizzleORM is a type-safe ORM solutions that allows you to write database queries in a familiar SQL-lookalike format but with other goodies as well. Learn more at DrizzleORM for implementation details.

## Schema
The Drizzle schema is defined in  **/lib/db/schema.ts** with this ERD: ![ERD](/docs//assets/images/erd.png)

## Scripts
Some scripts have been defined that help manage the database, prefixed by _drizzle:_. The commands to run them are;
* `pnpm run drizzle:generate`: Generate native SQL script that implements the schema. Iterates in separate files as migrations corresponding to changes in the schema.
* `pnpm run drizzle:push`: Apply migrations to the actual database only applies if some changes in the migrations were not applied.
* `pnpm run drizzle:migrate`: Convinience script to run a generate and push in succession
* `pnpm run drizzle:seed`: Runs a migrate and then attempts to seed the database with dummy data using _Faker.js_. This seeding is rudimentary and is not meant to be a catch-all for states and will fail if run multiple times (due to possible key constraint violations). The seed file is located in **/lib/db/seed.ts**
* `pnpm run drizzle:drop`: Drop all migration changes in the database.
* `pnpm run drizzle:studio`: A web-based interface to interact with the database models managed by Drizzle.
