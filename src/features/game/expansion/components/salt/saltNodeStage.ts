import saltNodeEmpty from "assets/buildings/salt/salt_node_empty.webp";
import saltNodeStage1 from "assets/buildings/salt/salt_node_stage_1.webp";
import saltNodeStage2 from "assets/buildings/salt/salt_node_stage_2.webp";
import saltNodeStage3 from "assets/buildings/salt/salt_node_stage_3.webp";
import saltNodeStage4 from "assets/buildings/salt/salt_node_stage_4.webp";
import saltNodeStage5 from "assets/buildings/salt/salt_node_stage_5.webp";

export function getSaltNodeSprite(storedCharges: number): string {
  if (storedCharges >= 5) return saltNodeStage5;
  if (storedCharges === 4) return saltNodeStage4;
  if (storedCharges === 3) return saltNodeStage3;
  if (storedCharges === 2) return saltNodeStage2;
  if (storedCharges === 1) return saltNodeStage1;
  return saltNodeEmpty;
}

export function canInstantHarvestSaltNode({
  visiting,
  storedCharges,
  availableRakes,
  rakeFree = false,
}: {
  visiting: boolean;
  storedCharges: number;
  availableRakes: number;
  /**
   * Ascended Idol lets a node be harvested without spending a Salt Rake,
   * mirroring how Foreman Beaver removes the Axe requirement for chopping.
   */
  rakeFree?: boolean;
}) {
  return !visiting && storedCharges > 0 && (rakeFree || availableRakes > 0);
}
