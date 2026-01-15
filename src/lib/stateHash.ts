// Browser-friendly SHA-256 → hex
export async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str); // UTF-8
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return "sha256:" + hashHex;
}

/**
 * Hashes each top-level field of a JSON-ish record.
 * { a: "sha256:..", b: "sha256:.." }
 */
export async function getRecordHash<T extends Record<string, unknown>>(
  record: T,
): Promise<Record<keyof T, string>> {
  const hashes = {} as Record<keyof T, string>;

  for (const key of Object.keys(record) as Array<keyof T>) {
    const stable = JSON.stringify(record[key]);
    hashes[key] = await hashString(stable);
  }

  return hashes;
}
