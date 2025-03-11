import { SUNNYSIDE } from "assets/sunnyside";
import { RoundButton } from "components/ui/RoundButton";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useSound } from "lib/utils/hooks/useSound";
import React from "react";

export const BasketButton: React.FC<{
  onClick: () => void;
}> = ({ onClick }) => {
  const inventory = useSound("inventory");
  return (
    <RoundButton
      onClick={() => {
        inventory.play();
        onClick();
      }}
      className="mb-2"
    >
      <img
        src={SUNNYSIDE.icons.basket}
        className="absolute group-active:translate-y-[2px]"
        style={{
          top: `${PIXEL_SCALE * 5}px`,
          left: `${PIXEL_SCALE * 5}px`,
          width: `${PIXEL_SCALE * 12}px`,
        }}
      />
    </RoundButton>
  );
};
