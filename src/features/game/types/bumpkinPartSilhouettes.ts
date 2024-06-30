import { BumpkinPart } from "features/game/types/bumpkin";

import hatSilhouette from "public/assets/bumpkins/hat_silhouette.png";
import shirtSilhouette from "public/assets/bumpkins/shirt_silhouette.png";
import toolSilhouette from "public/assets/bumpkins/tool_silhouette.png";
import hairSilhouette from "public/assets/bumpkins/hair_silhouette.png";
import pantsSilhouette from "public/assets/bumpkins/pants_silhouette.png";
import backgroundSilhouette from "public/assets/bumpkins/background_silhouette.png";
import bodySilhouette from "public/assets/bumpkins/body_silhouette.png";
import onesieSilhouette from "public/assets/bumpkins/onesie_silhouette.png";
import suitSilhouette from "public/assets/bumpkins/suit_silhouette.png";
import necklaceSilhouette from "public/assets/bumpkins/necklace_silhouette.png";
import dressSilhouette from "public/assets/bumpkins/dress_silhouette.png";
import shoesSilhouette from "public/assets/bumpkins/shoes_silhouette.png";
import wingsSilhouette from "public/assets/bumpkins/wings_silhouette.png";
import secondaryToolSilhouette from "public/assets/bumpkins/secondary_tool_silhouette.png";
import coatSilhouette from "public/assets/bumpkins/coat_silhouette.png";
import beardSilhouette from "public/assets/bumpkins/beard_silhouette.png";

export const BUMPKIN_PART_SILHOUETTE: Record<BumpkinPart, string> = {
  background: backgroundSilhouette,
  body: bodySilhouette,
  dress: dressSilhouette,
  shirt: shirtSilhouette,
  pants: pantsSilhouette,
  hair: hairSilhouette,
  shoes: shoesSilhouette,
  tool: toolSilhouette,
  necklace: necklaceSilhouette,
  coat: coatSilhouette,
  hat: hatSilhouette,
  secondaryTool: secondaryToolSilhouette,
  onesie: onesieSilhouette,
  suit: suitSilhouette,
  wings: wingsSilhouette,
  beard: beardSilhouette,
};
