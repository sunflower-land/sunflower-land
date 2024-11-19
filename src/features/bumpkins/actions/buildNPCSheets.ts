import { BumpkinParts, tokenUriBuilder } from "lib/utils/tokenUriBuilder";

type Request = {
  parts: BumpkinParts;
};

export async function buildNPCSheets(request: Request) {
  const tokenUri = tokenUriBuilder(request.parts);
  return tokenUri;
}
