import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

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
