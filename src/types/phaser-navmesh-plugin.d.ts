declare module "phaser-navmesh" {
  import Phaser from "phaser";

  export class PhaserNavMeshPlugin extends Phaser.Plugins.ScenePlugin {
    constructor(
      scene: Phaser.Scene,
      pluginManager: Phaser.Plugins.PluginManager,
    );

    buildMeshFromTiled(
      key: string,
      objectLayer: Phaser.Tilemaps.ObjectLayer,
      tileWidth: number,
      tileHeight?: number,
    ): PhaserNavMesh;
    findPath(
      start: Phaser.Math.Vector2,
      end: Phaser.Math.Vector2,
    ): Phaser.Math.Vector2[] | null;
  }

  export class PhaserNavMesh {
    constructor(
      scene: Phaser.Scene,
      meshPolygonPoints: Phaser.Types.Tilemaps.TiledObject[],
      config?: any,
    );

    findPath(
      startPoint: Phaser.Types.Math.Vector2Like,
      endPoint: Phaser.Types.Math.Vector2Like,
    ): Phaser.Types.Math.Vector2Like[] | null;
  }
}
