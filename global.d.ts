import { Client } from "pg";

declare global {
  namespace globalThis {
    var client: Client;
  }
}
