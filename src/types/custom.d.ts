import { PhaserNavMeshPlugin } from "phaser-navmesh";

declare module "phaser" {
  interface Scene {
    navMeshPlugin: PhaserNavMeshPlugin;
  }
}
