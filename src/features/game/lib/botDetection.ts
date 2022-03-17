/**
 * Produces a timestamped fingerprint of the OS
 */
export async function getFingerPrint() {
  // Fallback fingerprint
  let fingerprint = "0x123";

  try {
    fingerprint = await new Promise((res, rej) => {
      // Initialised in index.html
      (window as any).botdPromise
        .then((botd: any) => botd.detect())
        .then((response: { requestId: string }) => res(response.requestId))
        .catch(rej);
    });
  } catch {
    //
  }

  return fingerprint;
}
