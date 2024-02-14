import { SUNNYSIDE } from "assets/sunnyside";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import { budImageDomain } from "features/island/collectibles/components/Bud";
import { SceneId } from "features/world/mmoMachine";
import React from "react";
import { Modal } from "react-bootstrap";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export type ReactionName = "heart" | "happy" | "sad";
interface Props {
  gameState: GameState;
  onReact: (reaction: ReactionName) => void;
  onBudPlace: (tokenId: number) => void;
  scene: SceneId;
}

export const BudReaction: React.FC<{
  gameState: GameState;
  onBudPlace: (tokenId: number) => void;
  onClose: () => void;
}> = ({ gameState, onBudPlace, onClose }) => {
  const [selected, setSelected] = React.useState<number>();

  const buds = getKeys(gameState.buds ?? {});
  const { t } = useAppTranslation();

  return (
    <CloseButtonPanel onClose={onClose}>
      <div className="p-1">
        <Label type="default" className="mx-1" icon={SUNNYSIDE.icons.heart}>
          {t("reaction.bud.show")}
        </Label>
        <p className="text-xs my-2">
          {t("reaction.bud.select")}
          {"."}
        </p>

        <div className="flex flex-wrap">
          {buds.length === 0 && (
            <Label type={"danger"}>
              {t("reaction.bud.noFound")}
              {"."}
            </Label>
          )}
          {buds.map((budId) => {
            return (
              <Box
                key={budId}
                onClick={() => setSelected(budId)}
                isSelected={selected === budId}
                image={`https://${budImageDomain}.sunflower-land.com/images/${budId}.webp`}
              />
            );
          })}
        </div>
      </div>
      <Button
        disabled={!selected}
        onClick={() => {
          onBudPlace(selected as number);
          onClose();
        }}
      >
        {t("place")}
      </Button>
    </CloseButtonPanel>
  );
};

export const Reactions: React.FC<Props> = ({
  gameState,
  onReact,
  onBudPlace,
  scene,
}) => {
  const [showBudReactions, setShowBudReactions] = React.useState(false);

  return (
    <>
      <div className="flex flex-col  items-center justify-center">
        <Button className="h-12  w-12 mt-1" onClick={() => onReact("heart")}>
          <img src={SUNNYSIDE.icons.heart} className="h-6 mt-1" />
        </Button>
        <Button className="h-12 w-12 mt-1" onClick={() => onReact("sad")}>
          <img src={SUNNYSIDE.icons.sad} className="h-6 mt-1" />
        </Button>
        <Button className="h-12  w-12 mt-1" onClick={() => onReact("happy")}>
          <img src={SUNNYSIDE.icons.happy} className="h-6 mt-1" />
        </Button>
        {scene === "plaza" && (
          <Button
            className="h-12 w-12 mt-1"
            onClick={() => setShowBudReactions(true)}
          >
            <img src={SUNNYSIDE.icons.drag} className="h-6 mt-1" />
          </Button>
        )}
      </div>

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
    </>
  );
};
