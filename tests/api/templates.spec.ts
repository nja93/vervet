import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import { API_URL } from "./defaults";

test.describe("Templates API Testing", () => {
  const data = {
    name: faker.company.buzzAdjective(),
    content: faker.lorem.paragraph(),
  };
  test("Create user template", async ({ request }) => {
    const response = await request.post(`${API_URL}/templates`, {
      data: { ...data },
    });
    expect(response.status()).toBe(201);
  });

  test("Delete user template", async ({ request }) => {
    let response = await request.post(`${API_URL}/templates`, {
      data: { ...data },
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

  test("Create feed template", async ({ request }) => {
    // Create new feed
    let response = await request.post(`${API_URL}/user/feeds`, {
      data: { title: faker.commerce.department() },
    });
    expect(response.status()).toBe(201);
    let json = await response.json();

    response = await request.post(`${API_URL}/templates`, {
      data: { ...data, feedId: json.id },
    });
    expect(response.status()).toBe(201);
  });

  test("Delete feed template", async ({ request }) => {
    let response = await request.post(`${API_URL}/user/feeds`, {
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
});
