export interface CanvasImageProps {
  src: string;
  /** Canvas pixels, from the top-left corner. */
  x: number;
  y: number;
  width: number;
  height: number;
  /** 0–1, defaults to 1. */
  opacity?: number;
}

/**
 * A host "instance" of the custom renderer — the canvas analogue of a DOM
 * node. `hidden` is toggled by the reconciler when Suspense hides a subtree.
 */
export interface ImageInstance {
  type: "image";
  props: CanvasImageProps;
  hidden: boolean;
}

export interface CachedImage {
  img: HTMLImageElement;
  state: "loading" | "loaded" | "error";
}
