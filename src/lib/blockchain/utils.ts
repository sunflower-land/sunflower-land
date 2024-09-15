import { ERRORS } from "lib/errors";

export function parseMetamaskError(error: any): Error {
  // eslint-disable-next-line no-console
  console.log({ parse: error });
  if (error.code === 4001) {
    return new Error(ERRORS.REJECTED_TRANSACTION);
  }

  if (error.code === -32603) {
    // eslint-disable-next-line no-console
    console.log("Congested!");
    return new Error(ERRORS.NETWORK_CONGESTED);
  }

  return error;
}
