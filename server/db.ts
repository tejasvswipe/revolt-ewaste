import { ContactInquiry, EvidenceFile, InsertContactInquiry, InsertEvidenceFile, InsertUser, User } from "../drizzle/schema";
import { ENV } from "./_core/env";

const apiBase = () => `${ENV.supabaseUrl.replace(/\/+$/, "")}/rest/v1`;

function headers(prefer?: string) {
  if (!ENV.supabaseUrl || !ENV.supabaseToken) throw new Error("Supabase is not configured");
  return {
    apikey: ENV.supabaseToken,
    Authorization: `Bearer ${ENV.supabaseToken}`,
    "Content-Type": "application/json",
    ...(prefer ? { Prefer: prefer } : {}),
  };
}

export function supabaseErrorMessage(path: string, status: number) {
  if (status === 404 && path.startsWith("/contact_inquiries")) {
    return "Contact storage is not initialized. Run supabase/schema.sql in the Supabase SQL Editor, then try again.";
  }
  if (status === 404 && path.startsWith("/evidence_files")) {
    return "Evidence storage is not initialized. Run supabase/schema.sql in the Supabase SQL Editor, then try again.";
  }
  return `Supabase request failed (${status})`;
}

async function supabaseRequest<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(`${apiBase()}${path}`, { ...init, headers: { ...headers(), ...(init.headers || {}) } });
  if (!response.ok) throw new Error(supabaseErrorMessage(path, response.status));
  const text = await response.text();
  return text ? JSON.parse(text) as T : undefined;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  await supabaseRequest("/users", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal", "Content-Profile": "public" },
    body: JSON.stringify(user),
  });
}

export async function getUserByOpenId(openId: string) {
  const rows = await supabaseRequest<User[]>(`/users?openId=eq.${encodeURIComponent(openId)}&limit=1`);
  return rows?.[0];
}

export async function insertContactInquiry(inquiry: InsertContactInquiry) {
  const rows = await supabaseRequest<ContactInquiry[]>("/contact_inquiries", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(inquiry),
  });
  return {
    success: true as const,
    record: rows?.[0] ?? null,
  };
}

export async function insertEvidenceFile(file: InsertEvidenceFile) {
  const rows = await supabaseRequest<EvidenceFile[]>("/evidence_files", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(file),
  });
  return rows?.[0];
}

export async function listEvidenceFiles(userId: number) {
  return (await supabaseRequest<EvidenceFile[]>(`/evidence_files?userId=eq.${userId}&order=createdAt.desc`)) ?? [];
}
