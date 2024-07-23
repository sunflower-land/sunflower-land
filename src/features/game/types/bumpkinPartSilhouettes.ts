import { BumpkinPart } from "features/game/types/bumpkin";

import hatSilhouette from "assets/bumpkins/hat_silhouette.png";
import shirtSilhouette from "assets/bumpkins/shirt_silhouette.png";
import toolSilhouette from "assets/bumpkins/tool_silhouette.png";
import hairSilhouette from "assets/bumpkins/hair_silhouette.png";
import pantsSilhouette from "assets/bumpkins/pants_silhouette.png";
import backgroundSilhouette from "assets/bumpkins/background_silhouette.png";
import bodySilhouette from "assets/bumpkins/body_silhouette.png";
import onesieSilhouette from "assets/bumpkins/onesie_silhouette.png";
import suitSilhouette from "assets/bumpkins/suit_silhouette.png";
import necklaceSilhouette from "assets/bumpkins/necklace_silhouette.png";
import dressSilhouette from "assets/bumpkins/dress_silhouette.png";
import shoesSilhouette from "assets/bumpkins/shoes_silhouette.png";
import wingsSilhouette from "assets/bumpkins/wings_silhouette.png";
import secondaryToolSilhouette from "assets/bumpkins/secondary_tool_silhouette.png";
import coatSilhouette from "assets/bumpkins/coat_silhouette.png";
import beardSilhouette from "assets/bumpkins/beard_silhouette.png";
import auraSilhoutte from "assets/bumpkins/aura_silhoutte.png";

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
  aura: auraSilhoutte,
};
