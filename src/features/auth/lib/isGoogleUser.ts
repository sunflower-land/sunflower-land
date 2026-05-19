import { Token } from "../actions/login";

export const GOOGLE_ADDRESS_PREFIX = "google:";

export const isGoogleAddress = (address?: string): boolean =>
  !!address && address.startsWith(GOOGLE_ADDRESS_PREFIX);

export const isGoogleToken = (token?: Token): boolean =>
  isGoogleAddress(token?.address);
