import { Rock } from "features/game/types/game";
import { ResourceItem } from "../placeable/lib/collisionDetection";
import { Coordinates } from "../components/MapPlacement";

export function canMine(
  rock: Rock,
  recoveryTime: number,
  now: number = Date.now(),
) {
  return now - rock.stone.minedAt >= recoveryTime * 1000;
}

/**
 * getEntries is a ref to Object.entries, but the return is typed literally.
 */
export const getObjectEntries = Object.entries as <T extends object>(
  obj: T,
) => Array<[keyof T, T[keyof T]]>;

/**
 * Get all active nodes from a record of nodes.
 * @param nodes - The record of nodes to get active nodes from.
 * @returns The active nodes (nodes with x and y) with compulsory coordinates.
 */
export const getActiveNodes = <T extends ResourceItem>(
  nodes: Record<string, T>,
): [string, T & Coordinates][] => {
  return getObjectEntries(nodes).filter(([_, node]) => isActiveNode(node)) as [
    string,
    T & Coordinates,
  ][];
};

/**
 * Check if a node is active.
 * @param node - The node to check.
 * @returns True if the node is active, false otherwise.
 */
export const isActiveNode = <T extends ResourceItem>(
  node: T,
): node is T & Coordinates => {
  return node.x !== undefined && node.y !== undefined;
};
