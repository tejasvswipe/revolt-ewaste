import { describe, expect, it } from "vitest";

describe("Supabase credentials", () => {
  it("reach the configured Supabase REST endpoint", async () => {
    const url = process.env.SUPABASE_URL;
    const token = process.env.SUPABASE_TOKEN;
    expect(url).toMatch(/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i);
    expect(token).toBeTruthy();

    const response = await fetch(`${url!.replace(/\/+$/, "")}/rest/v1/`, {
      headers: {
        apikey: token!,
        Authorization: `Bearer ${token!}`,
      },
    });
    expect(response.status).not.toBe(401);
    expect(response.status).not.toBe(403);
  }, 15000);
});
