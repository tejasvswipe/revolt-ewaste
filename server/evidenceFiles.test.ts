import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { insertContactInquiry, supabaseErrorMessage } from "./db";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Contact response safety", () => {
  it("uses a stable success envelope for an empty representation response", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async () => new Response("", { status: 201 })) as typeof fetch;
    try {
      const result = await insertContactInquiry({
        name: "ABC Studio",
        email: "abc@example.com",
        company: "ABC Studio",
        phone: "+1 555 010 2026",
        message: "ABC contact test record.",
      });
      expect(result).toEqual({ success: true, record: null });
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});

describe("Supabase setup errors", () => {
  it("explains how to initialize missing Contact storage", () => {
    expect(supabaseErrorMessage("/contact_inquiries", 404)).toContain("supabase/schema.sql");
  });
});

describe("contact and evidence routes", () => {
  it("rejects invalid contact inquiry input before persistence", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.contact.submit({
      name: "A",
      email: "not-an-email",
      company: "",
      phone: "1",
      message: "short",
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
  it("requires an authenticated user to list files", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.evidenceFiles.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("requires an authenticated user to upload files", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.evidenceFiles.upload({
      fileName: "certificate.pdf",
      mimeType: "application/pdf",
      sizeBytes: 3,
      dataBase64: "YWJj",
    })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
