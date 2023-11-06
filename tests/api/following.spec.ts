import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import { API_URL } from "./defaults";

test.describe("Following feeds API Testing", () => {
  test("User follow feed", async ({ request }) => {
    // Create new feed
    let response = await request.post(`${API_URL}/user/feeds`, {
      data: { title: faker.commerce.department() },
    });
    expect(response.status()).toBe(201);
    let json = await response.json();

    response = await request.post(`${API_URL}/user/following/${json.id}`);
    expect(response.status()).toBe(201);
  });

  test("User unfollow feed", async ({ request }) => {
    // Create new feed
    let response = await request.post(`${API_URL}/user/feeds`, {
      data: { title: faker.commerce.department() },
    });
    expect(response.status()).toBe(201);
    let json = await response.json();

    response = await request.post(`${API_URL}/user/following/${json.id}`);
    expect(response.status()).toBe(201);

    response = await request.delete(`${API_URL}/user/following/${json.id}`);
    expect(response.status()).toBe(200);
  });
});
