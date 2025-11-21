import { useActor } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";

import festiveTreeImage from "assets/sfts/festive_tree.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { Revealed } from "features/game/components/Revealed";
import { Panel } from "components/ui/Panel";
import { Modal } from "components/ui/Modal";
import classNames from "classnames";
import { Label } from "components/ui/Label";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ChestRevealing } from "features/world/ui/chests/ChestRevealing";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { SFTDetailPopoverContent } from "components/ui/SFTDetailPopover";

const FestiveTreeImage = ({
  open,
  id,
  setShowGiftedModal,
}: {
  open: boolean;
  close: () => void;
  setShowGiftedModal: () => void;
  id: string;
}) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const trees = [
    ...(gameState.context.state.collectibles["Festive Tree"] || []),
    ...(gameState.context.state.home.collectibles["Festive Tree"] || []),
  ];
  const tree = trees.find((t) => t.id === id);

  const [isRevealing, setIsRevealing] = useState(false);

  const shake = () => {
    setIsRevealing(true);

    if (
      tree?.shakenAt &&
      new Date(tree.shakenAt).getFullYear() === new Date().getFullYear()
    ) {
      // Close the popover because we have a modal to show instead
      close();
      setShowGiftedModal();
      return;
    }

    if (new Date().getMonth() !== 11 || new Date().getDate() < 20) {
      return;
    }

    // Close the popover because we have a modal to show instead
    close();
    gameService.send("REVEAL", {
      event: {
        type: "festiveTree.shook",
        id,
        createdAt: new Date(),
      },
    });
  };

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      shake();
    }
  }, [open]);

  return (
    <div
      className={classNames("absolute w-full h-full", {
        "cursor-pointer hover:img-highlight": true,
      })}
    >
      <img
        src={festiveTreeImage}
        style={{
          width: `${PIXEL_SCALE * 30}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
          left: `${PIXEL_SCALE * 1}px`,
        }}
        className="absolute pointer-events-none"
        alt="Festive Tree"
      />

      {gameState.matches("revealing") && isRevealing && (
        <Modal show>
          <Panel>
            <ChestRevealing type="Festive Tree Rewards" />
          </Panel>
        </Modal>
      )}
      {gameState.matches("revealed") && isRevealing && (
        <Modal show>
          <Panel bumpkinParts={NPC_WEARABLES.santa}>
            <Revealed onAcknowledged={() => setIsRevealing(false)} />
          </Panel>
        </Modal>
      )}
    </div>
  );
};

interface Props {
  id: string;
}

export const FestiveTree: React.FC<Props> = ({ id }) => {
  const { t } = useAppTranslation();
  const [showGiftedModal, setShowGiftedModal] = useState(false);

  return (
    <>
      <Modal
        show={showGiftedModal}
        onHide={() => {
          setShowGiftedModal(false);
        }}
      >
        <CloseButtonPanel
          bumpkinParts={NPC_WEARABLES.santa}
          onClose={() => setShowGiftedModal(false)}
        >
          <div className="p-2">
            <Label type="danger">{t("festivetree.greedyBumpkin")}</Label>
            <p className="text-sm mt-2">{t("festivetree.alreadyGifted")}</p>
          </div>
        </CloseButtonPanel>
      </Modal>
      <Popover>
        {({ open, close }) => (
          <>
            <PopoverButton as="div" className="cursor-pointer">
              <FestiveTreeImage
                open={open}
                id={id}
                close={close}
                setShowGiftedModal={() => setShowGiftedModal(true)}
              />
            </PopoverButton>
            <PopoverPanel
              anchor={{ to: "left" }}
              className="flex pointer-events-none"
            >
              <SFTDetailPopoverContent name={"Festive Tree"} />
            </PopoverPanel>
          </>
        )}
      </Popover>
    </>
  );
};
