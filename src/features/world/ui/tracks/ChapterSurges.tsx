import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import Decimal from "decimal.js-light";
import { useGame } from "features/game/GameProvider";
import { getChapterTicket } from "features/game/types/chapters";
import { ITEM_DETAILS } from "features/game/types/images";
import { useNow } from "lib/utils/hooks/useNow";
import React from "react";

export const ChapterSurges: React.FC = () => {
  const { gameState } = useGame();

  const now = useNow();

  const state = gameState.context.state;
  const surges = state.inventory["Chapter Surge"] ?? new Decimal(0);

  const power = state.chapter?.surge?.power ?? 0;

  if (surges.eq(0) && power <= 0) return null;

  const chapterTicket = getChapterTicket(now);

  return (
    <div>
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center">
          <Box image={ITEM_DETAILS["Chapter Surge"].image} count={surges} />

          {!!power ? (
            <div>
              <Label type="vibrant">Active</Label>
              <p className="text-xxs ml-1">{power} deliveries left</p>
            </div>
          ) : (
            <div className="ml-1">
              <p className="text-xs">Earn +1 {chapterTicket}</p>
              <p className="text-xxs">Valid for 10 deliveries</p>
            </div>
          )}
        </div>

        <Button className="w-auto h-12 " disabled={power >= 0}>
          Activate
        </Button>
      </div>
    </div>
  );
};
