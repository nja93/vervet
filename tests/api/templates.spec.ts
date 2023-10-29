import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import { API_URL, FAKE_ID, USER_ID } from "./defaults";

test.describe("Templates API Testing", () => {
  const data = {
    name: faker.company.buzzAdjective(),
    content: faker.lorem.paragraph(),
  };
  test("Create user template", async ({ request }) => {
    const response = await request.post(`${API_URL}/templates`, {
      data: { ...data, userId: USER_ID },
    });
    expect(response.status()).toBe(201);
  });

  test("Create user template - invalid user", async ({ request }) => {
    const response = await request.post(`${API_URL}/templates`, {
      data: { ...data, userId: FAKE_ID },
    });
    expect(response.status()).toBe(404);
    const json = await response.json();
    expect(json).toMatchObject({
      error: `Could not find user`,
      data: { id: `${FAKE_ID}`, __class__: "user" },
    });
  });

  test("Delete user template", async ({ request }) => {
    let response = await request.post(`${API_URL}/templates`, {
      data: { ...data, userId: USER_ID },
    });
    expect(response.status()).toBe(201);
    let json = await response.json();

    response = await request.delete(`${API_URL}/templates/${json.id}`);
    expect(response.status()).toBe(200);
    json = await response.json();
    expect(json).toMatchObject({
      id: json.id,
    });
  });

  test("Delete user template - invalid template", async ({ request }) => {
    const response = await request.delete(`${API_URL}/templates/${FAKE_ID}`);
    expect(response.status()).toBe(404);
  });

  test("Create feed template", async ({ request }) => {
    // Create new feed
    let response = await request.post(`${API_URL}/users/${USER_ID}/feeds`, {
      data: { title: faker.commerce.department() },
    });
    expect(response.status()).toBe(201);
    let json = await response.json();

    response = await request.post(`${API_URL}/templates`, {
      data: { ...data, feedId: json.id },
    });
    expect(response.status()).toBe(201);
  });

  test("Create feed template - invalid feed", async ({ request }) => {
    const response = await request.post(`${API_URL}/templates`, {
      data: { ...data, feedId: FAKE_ID },
    });
    expect(response.status()).toBe(404);
    const json = await response.json();
    expect(json).toMatchObject({
      error: `Could not find feed`,
      data: { id: `${FAKE_ID}`, __class__: "feed" },
    });
  });

  test("Delete feed template", async ({ request }) => {
    let response = await request.post(`${API_URL}/users/${USER_ID}/feeds`, {
      data: { title: faker.commerce.department() },
    });
    expect(response.status()).toBe(201);
    let json = await response.json();

    response = await request.post(`${API_URL}/templates`, {
      data: { ...data, feedId: json.id },
    });
    expect(response.status()).toBe(201);
    json = await response.json();

    response = await request.delete(`${API_URL}/templates/${json.id}`);
    expect(response.status()).toBe(200);
    json = await response.json();
    expect(json).toMatchObject({
      id: json.id,
    });
  });

  test("Delete feed template - invalid template", async ({ request }) => {
    const response = await request.delete(`${API_URL}/templates/${FAKE_ID}`);
    expect(response.status()).toBe(404);
  });
});
