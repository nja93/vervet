import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import { API_URL, FAKE_ID, USER_ID } from "./defaults";

test.describe("Following feeds API Testing", () => {
  test("User follow feed", async ({ request }) => {
    // Create new feed
    let response = await request.post(`${API_URL}/users/${USER_ID}/feeds`, {
      data: { title: faker.commerce.department() },
    });
    expect(response.status()).toBe(201);
    let json = await response.json();

    response = await request.post(
      `${API_URL}/users/${USER_ID}/following/${json.id}`
    );
    expect(response.status()).toBe(201);
  });

  test("User follow feed - invalid user", async ({ request }) => {
    const response = await request.post(
      `${API_URL}/users/${FAKE_ID}/following/${FAKE_ID}`
    );
    expect(response.status()).toBe(404);
  });

  test("User follow feed - invalid feed", async ({ request }) => {
    const response = await request.post(
      `${API_URL}/users/${USER_ID}/following/${FAKE_ID}`
    );
    expect(response.status()).toBe(404);
  });

  test("User unfollow feed", async ({ request }) => {
    // Create new feed
    let response = await request.post(`${API_URL}/users/${USER_ID}/feeds`, {
      data: { title: faker.commerce.department() },
    });
    expect(response.status()).toBe(201);
    let json = await response.json();

    response = await request.post(
      `${API_URL}/users/${USER_ID}/following/${json.id}`
    );
    expect(response.status()).toBe(201);

    response = await request.delete(
      `${API_URL}/users/${USER_ID}/following/${json.id}`
    );
    expect(response.status()).toBe(200);
  });

  test("User unfollow feed - invalid user", async ({ request }) => {
    const response = await request.delete(
      `${API_URL}/users/${FAKE_ID}/following/${FAKE_ID}`
    );
    expect(response.status()).toBe(404);
  });

  test("User unfollow feed - invalid feed", async ({ request }) => {
    const response = await request.delete(
      `${API_URL}/users/${USER_ID}/following/${FAKE_ID}`
    );
    expect(response.status()).toBe(404);
  });
});
