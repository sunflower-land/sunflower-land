import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import { getSeasonWeek } from "lib/utils/getSeasonWeek";
import React, { useContext } from "react";

interface Props {
  onClose: () => void;
}

const _springBlossom = (week: number) => (state: MachineState) =>
  state.context.state.springBlossom[week];

export const PageFound: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const seasonWeek = getSeasonWeek();

  const springBlossom = useSelector(gameService, _springBlossom(seasonWeek));

  // This shouldn't happen
  if (!springBlossom) {
    return (
      <CloseButtonPanel onClose={onClose} title={"Page Found"}>
        <div className="flex flex-col items-center w-full">
          <span>Looks like a page from a gardening book...</span>
          <img
            src="public/world/page.png"
            style={{ width: PIXEL_SCALE * 16 * 2 }}
          />
        </div>
      </CloseButtonPanel>
    );
  }

  if (springBlossom.collectedFlowerPages.length >= 3) {
    return (
      <CloseButtonPanel onClose={onClose} title={"Page Found!"}>
        <div className="flex flex-col w-full items-center justify-center">
          <span className="text-sm">
            Fantastic! Well done finding the last page, you can now grow a{" "}
            {springBlossom.weeklyFlower}
          </span>
          <div className="flex w-full mt-2">
            <img
              src={SUNNYSIDE.icons.search}
              style={{
                width: `${PIXEL_SCALE * 12}px`,
              }}
            />
            <span className="pl-2 text-sm">
              Check the Codex to learn more about it!
            </span>
          </div>
          <img
            src="public/world/page.png"
            style={{ width: PIXEL_SCALE * 16 * 2 }}
          />

          <Label type="success" className="mt-2">
            All Pages Found!
          </Label>
        </div>
      </CloseButtonPanel>
    );
  }

  return (
    <CloseButtonPanel onClose={onClose} title={"Page Found!"}>
      <div className="flex flex-col w-full items-center">
        <span className="text-sm">
          Great! This page contains some information about how to grow a{" "}
          {springBlossom.weeklyFlower}!
        </span>
        <img
          src="public/world/page.png"
          style={{ width: PIXEL_SCALE * 16 * 2 }}
        />

        <Label type="info" className="mt-2">
          {springBlossom.collectedFlowerPages.length}/3 Pages Found
        </Label>
      </div>
    </CloseButtonPanel>
  );
};
