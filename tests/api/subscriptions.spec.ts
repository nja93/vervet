import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { API_URL } from "./defaults";

test.describe("Subscription API Testing", () => {
  const SEED = Math.ceil(Math.random() * Number.MAX_SAFE_INTEGER);
  faker.seed(SEED);
  let subscription = {
    endpoint: faker.internet.url() + faker.string.hexadecimal({ length: 50 }),
    expirationTime: null,
    keys: {
      auth: "OGpmExgsdBw3GmDQgt28Ng",
      p256dh:
        "BBvv3G4Yo0VHwjvvhO3Nm09rAWLxH25sBc0q1COY6XdKUqRI1IbxK1wkZJg1A1oJR9UDkeBEJwrQ6IjeSalVUYo",
    },
  };

  test("User add subscription", async ({ request }) => {
    faker.seed(SEED);
    const response = await request.post(`${API_URL}/user/subscriptions`, {
      data: { ...subscription },
    });
    expect(response.status()).toBe(201);
    const json = await response.json();

    expect(json).toMatchObject({ endpoint: subscription.endpoint });
  });

  test("User delete subscription", async ({ request }) => {
    faker.seed(Math.ceil(Math.random() * Number.MAX_SAFE_INTEGER));
    subscription = {
      endpoint: faker.internet.url() + faker.string.hexadecimal({ length: 10 }),
      expirationTime: null,
      keys: {
        auth: "OGpmExgsdBw3GmDQgt28Ng",
        p256dh:
          "BBvv3G4Yo0VHwjvvhO3Nm09rAWLxH25sBc0q1COY6XdKUqRI1IbxK1wkZJg1A1oJR9UDkeBEJwrQ6IjeSalVUYo",
      },
    };
    let response = await request.post(`${API_URL}/user/subscriptions`, {
      data: subscription,
    });
    expect(response.status()).toBe(201);
    let json = await response.json();

    response = await request.delete(`${API_URL}/subscriptions/${json.id}`);
    expect(response.status()).toBe(200);
    json = await response.json();
    expect(json).toMatchObject({
      id: json.id,
    });
  });
});
