import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { TFeed } from "@/lib/db/types";
import { API_URL, USER_ID, FAKE_ID } from "./defaults";

test.describe("Feed API Testing", () => {
  const data: Omit<TFeed, "id"> = {
    title: faker.company.buzzNoun(),
  };

  test("User create feed - happy path", async ({ request }) => {
    const response = await request.post(`${API_URL}/users/${USER_ID}/feeds`, {
      data,
    });
    expect(response.status()).toBe(201);
    const json = await response.json();

    expect(json).toHaveProperty("id");
  });

  test("User create feed - invalid POST data", async ({ request }) => {
    const response = await request.post(`${API_URL}/users/${USER_ID}/feeds`, {
      data: { col: "Hi" },
    });
    expect(response.status()).toBe(400);
    const json = await response.json();
    expect(json).not.toHaveProperty("id");
  });

  test("User create feed - invalid user", async ({ request }) => {
    const response = await request.post(`${API_URL}/users/${FAKE_ID}/feeds`, {
      data,
    });
    expect(response.status()).toBe(404);
    const json = await response.json();
    expect(json).toMatchObject({
      error: `Could not find user`,
      data: { id: `${FAKE_ID}`, __class__: "user" },
    });
  });

  test("User get user created feeds", async ({ request }) => {
    const response = await request.get(`${API_URL}/users/${USER_ID}/feeds`, {
      data,
    });
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json).toBeInstanceOf(Array);
  });

  test("User get user created feeds - invalid user", async ({ request }) => {
    const response = await request.get(`${API_URL}/users/${FAKE_ID}/feeds`, {
      data,
    });
    expect(response.status()).toBe(404);
    const json = await response.json();

    expect(json).toMatchObject({
      error: `Could not find user`,
      data: { id: `${FAKE_ID}`, __class__: "user" },
    });
  });

  test("Get specific feed", async ({ request }) => {
    // Create a random feed
    let response = await request.post(`${API_URL}/users/${USER_ID}/feeds`, {
      data,
    });
    expect(response.status()).toBe(201);
    let json = await response.json();
    const id = json.id;

    response = await request.get(`${API_URL}/feeds/${id}`);
    expect(response.status()).toBe(200);
    json = await response.json();
    expect(json).toMatchObject({
      id,
      title: data.title,
      active: true,
    });
  });

  test("Get specific feed - invalid feed", async ({ request }) => {
    const response = await request.get(`${API_URL}/feeds/${FAKE_ID}`, {
      data,
    });
    expect(response.status()).toBe(404);

    const json = await response.json();
    expect(json).toMatchObject({
      error: `Could not find feed`,
      data: { id: `${FAKE_ID}`, __class__: "feed" },
    });
  });

  test("Change specific feed", async ({ request }) => {
    // Create a random feed
    let response = await request.post(`${API_URL}/users/${USER_ID}/feeds`, {
      data,
    });
    expect(response.status()).toBe(201);
    let json = await response.json();
    const id = json.id;

    response = await request.put(`${API_URL}/feeds/${id}`, {
      data: {
        title: "Test title change",
      },
    });
    expect(response.status()).toBe(200);

    response = await request.get(`${API_URL}/feeds/${id}`);
    expect(response.status()).toBe(200);
    json = await response.json();
    expect(json).toMatchObject({
      id,
      title: "Test title change",
      active: true,
    });
  });

  test("Change specific feed - invalid feed", async ({ request }) => {
    const response = await request.put(`${API_URL}/feeds/${FAKE_ID}`, {
      data: {
        title: "Fail title change",
      },
    });
    expect(response.status()).toBe(404);
    const json = await response.json();
    expect(json).toMatchObject({
      error: `Could not find feed`,
      data: { id: `${FAKE_ID}`, __class__: "feed" },
    });
  });

  test("User delete feed", async ({ request }) => {
    // Create a random feed
    let response = await request.post(`${API_URL}/users/${USER_ID}/feeds`, {
      data,
    });
    expect(response.status()).toBe(201);
    let json = await response.json();
    const id = json.id;

    response = await request.delete(`${API_URL}/feeds/${id}`);
    expect(response.status()).toBe(200);
    json = await response.json();
    expect(json).toMatchObject({ id });

    response = await request.get(`${API_URL}/feeds/${id}`, {
      data,
    });
    expect(response.status()).toBe(404);
  });

  test("User delete feed - invalid feed id", async ({ request }) => {
    const response = await request.delete(`${API_URL}/feeds/${FAKE_ID}`);

    expect(response.status()).toBe(404);
    expect(await response.json()).toMatchObject({
      error: `Could not find feed`,
      data: { id: `${FAKE_ID}`, __class__: "feed" },
    });
  });
});
