import { ENV } from "./_core/env";

const BUCKET = "revolt-evidence";
const baseUrl = () => ENV.supabaseUrl.replace(/\/+$/, "");

function assertSupabase() {
  if (!ENV.supabaseUrl || !ENV.supabaseToken) {
    throw new Error("Supabase storage is not configured");
  }
}

function normalizeKey(relKey: string) {
  return relKey.replace(/^\/+/, "");
}

function appendHashSuffix(relKey: string) {
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  return lastDot === -1 ? `${relKey}_${hash}` : `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}

export async function storagePut(relKey: string, data: Buffer | Uint8Array | string, contentType = "application/octet-stream") {
  assertSupabase();
  const key = appendHashSuffix(normalizeKey(relKey));
  const response = await fetch(`${baseUrl()}/storage/v1/object/${BUCKET}/${encodeURI(key)}`, {
    method: "POST",
    headers: {
      apikey: ENV.supabaseToken,
      Authorization: `Bearer ${ENV.supabaseToken}`,
      "Content-Type": contentType,
      "x-upsert": "false",
    },
    body: typeof data === "string" ? data : Buffer.from(data),
  });
  if (!response.ok) throw new Error(`Supabase Storage upload failed (${response.status})`);
  return { key, url: `${baseUrl()}/storage/v1/object/public/${BUCKET}/${encodeURI(key)}` };
}

export async function storageGet(relKey: string) {
  assertSupabase();
  const key = normalizeKey(relKey);
  return { key, url: `${baseUrl()}/storage/v1/object/public/${BUCKET}/${encodeURI(key)}` };
}

export async function storageGetSignedUrl(relKey: string) {
  const result = await storageGet(relKey);
  return result.url;
}
