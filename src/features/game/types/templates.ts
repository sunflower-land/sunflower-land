export type Template = {
  dimensions?: {
    width: number;
    height: number;
    offsetX?: number;
    offsetY?: number;
  };
  isWithdrawable: () => boolean;
};
