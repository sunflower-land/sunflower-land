import { SUNNYSIDE } from "assets/sunnyside";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { InnerPanel, OuterPanel, Panel } from "components/ui/Panel";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import { Bud } from "features/island/buds/Bud";
import { budImageDomain } from "features/island/collectibles/components/Bud";
import React from "react";

interface Props {
  gameState: GameState;
  onReact: (reaction: "heart" | "angry" | "sad") => void;
  onBudPlace: (tokenId: number) => void;
}

export const Reactions: React.FC<Props> = ({ gameState }) => {
  const buds = getKeys(gameState.buds ?? {});

  return (
    <OuterPanel>
      <div className="flex  items-center justify-center">
        <Button className="h-7 mr-1">
          <img src={SUNNYSIDE.icons.heart} className="h-4 mt-1" />
        </Button>
        <Button className="h-7 mr-1">
          <img src={SUNNYSIDE.icons.sad} className="h-4 mt-1" />
        </Button>
        <Button className="h-7">
          <img src={SUNNYSIDE.icons.happy} className="h-4 mt-1" />
        </Button>
      </div>
      {buds.length > 0 && (
        <div className="flex  items-center justify-center mt-1">
          {buds.map((tokenId) => (
            <Button className="h-7 mr-1">
              <img
                src={`https://${budImageDomain}.sunflower-land.com/images/${tokenId}.webp`}
                className="h-8 -mt-3"
              />
            </Button>
          ))}
        </div>
      )}
    </OuterPanel>
  );
};
