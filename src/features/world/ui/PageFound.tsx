import { useSelector } from "@xstate/react";
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

  return (
    <CloseButtonPanel onClose={onClose} title={"Page Found"}></CloseButtonPanel>
  );
};
