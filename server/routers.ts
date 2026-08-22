import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { insertContactInquiry, insertEvidenceFile, listEvidenceFiles } from "./db.js";
import { storagePut } from "./storage";

const safeFileName = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 180) || "evidence-file";
const allowedMimeTypes = ["application/pdf", "image/png", "image/jpeg", "image/webp", "text/plain", "text/csv"] as const;

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  contact: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().trim().min(2).max(160),
        email: z.string().trim().email().max(320),
        company: z.string().trim().min(2).max(200),
        phone: z.string().trim().min(7).max(60),
        message: z.string().trim().min(10).max(5000),
      }))
      .mutation(async ({ input }) => {
        await insertContactInquiry(input);
        return { success: true as const };
      }),
  }),
  evidenceFiles: router({
    list: protectedProcedure.query(({ ctx }) => listEvidenceFiles(ctx.user.id)),
    upload: protectedProcedure
      .input(z.object({
        fileName: z.string().min(1).max(255),
        mimeType: z.enum(allowedMimeTypes),
        sizeBytes: z.number().int().positive().max(10 * 1024 * 1024),
        dataBase64: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        const buffer = Buffer.from(input.dataBase64, "base64");
        if (buffer.length === 0 || buffer.length > 10 * 1024 * 1024) {
          throw new Error("Files must be between 1 byte and 10 MB");
        }
        if (buffer.length !== input.sizeBytes) {
          throw new Error("File size validation failed");
        }
        const fileName = safeFileName(input.fileName);
        const { key, url } = await storagePut(`${ctx.user.id}-evidence/${Date.now()}-${fileName}`, buffer, input.mimeType);
        return insertEvidenceFile({
          userId: ctx.user.id,
          fileName,
          mimeType: input.mimeType,
          sizeBytes: buffer.length,
          storageKey: key,
          storageUrl: url,
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
