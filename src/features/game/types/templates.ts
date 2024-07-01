export type Template = {
  dimensions?: {
    width: number;
    height: number;
  };
  isWithdrawable: () => boolean;
};
