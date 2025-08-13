/**
 * Browser-compatible SHA256 hash function using Web Crypto API
 * @param str The string to hash
 * @returns A SHA256 hash prefixed with "sha256:"
 */
export async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return "sha256:" + hashHex;
}

/**
 * Synchronous version of hashString for compatibility with existing code
 * Note: This is a simplified version that may not be cryptographically secure
 * but provides the same interface as the original crypto.createHash approach
 */
export function hashStringSync(str: string): string {
  // Simple hash function for compatibility - not cryptographically secure
  let hash = 0;
  if (str.length === 0)
    return "sha256:0000000000000000000000000000000000000000000000000000000000000000";

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Convert to hex and pad to 64 characters (32 bytes)
  const hashHex = Math.abs(hash).toString(16).padStart(64, "0");
  return "sha256:" + hashHex;
}
