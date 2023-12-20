import { SUNNYSIDE } from "assets/sunnyside";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { InnerPanel, OuterPanel, Panel } from "components/ui/Panel";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import { Bud } from "features/island/buds/Bud";
import { budImageDomain } from "features/island/collectibles/components/Bud";
import React from "react";
import { Modal } from "react-bootstrap";

export type ReactionName = "heart" | "happy" | "sad";
interface Props {
  gameState: GameState;
  onReact: (reaction: ReactionName) => void;
  onBudPlace: (tokenId: number) => void;
}

export const BudReaction: React.FC<{
  gameState: GameState;
  onBudPlace: (tokenId: number) => void;
  onClose: () => void;
}> = ({ gameState, onBudPlace, onClose }) => {
  const [selected, setSelected] = React.useState<number>();

  const buds = getKeys(gameState.buds ?? {});

  return (
    <CloseButtonPanel onClose={onClose}>
      <div className="flex flex-wrap justify-center">
        {buds.map((budId) => {
          return (
            <Box
              onClick={() => setSelected(budId)}
              isSelected={selected === budId}
              image={`https://${budImageDomain}.sunflower-land.com/images/${budId}.webp`}
            />
          );
        })}
      </div>
      <Button
        disabled={!selected}
        onClick={() => {
          onBudPlace(selected as number);
          onClose();
        }}
      >
        Place Bud
      </Button>
    </CloseButtonPanel>
  );
};

export const Reactions: React.FC<Props> = ({
  gameState,
  onReact,
  onBudPlace,
}) => {
  const [showBudReactions, setShowBudReactions] = React.useState(false);

  return (
    <OuterPanel>
      <div className="flex  items-center justify-center">
        <Button className="h-7 mr-1" onClick={() => onReact("heart")}>
          <img src={SUNNYSIDE.icons.heart} className="h-4 mt-1" />
        </Button>
        <Button className="h-7 mr-1" onClick={() => onReact("sad")}>
          <img src={SUNNYSIDE.icons.sad} className="h-4 mt-1" />
        </Button>
        <Button className="h-7" onClick={() => onReact("happy")}>
          <img src={SUNNYSIDE.icons.happy} className="h-4 mt-1" />
        </Button>
      </div>
      <Button className="h-7" onClick={() => setShowBudReactions(true)}>
        <img src={SUNNYSIDE.icons.plus} className="h-4 mt-1" />
      </Button>
      <Modal
        centered
        show={showBudReactions}
        onHide={() => setShowBudReactions(false)}
      >
        <BudReaction
          gameState={gameState}
          onBudPlace={onBudPlace}
          onClose={() => setShowBudReactions(false)}
        />
      </Modal>
    </OuterPanel>
  );
};
