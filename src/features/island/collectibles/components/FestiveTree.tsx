import React, { useContext, useState } from "react";

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
import { useNow } from "lib/utils/hooks/useNow";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";

const _state = (state: MachineState) => state.context.state;
const _revealing = (state: MachineState) => state.matches("revealing");
const _revealed = (state: MachineState) => state.matches("revealed");

const FestiveTreeImage: React.FC<{
  close: () => void;
  setShowGiftedModal: (show: boolean) => void;
  id: string;
}> = ({ id, setShowGiftedModal }) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const revealing = useSelector(gameService, _revealing);
  const revealed = useSelector(gameService, _revealed);

  const trees = [
    ...(state.collectibles["Festive Tree"] || []),
    ...(state.home.collectibles["Festive Tree"] || []),
  ];
  const tree = trees.find((t) => t.id === id);

  const [isRevealing, setIsRevealing] = useState(false);
  const nowTimestamp = useNow();

  const shake = () => {
    setIsRevealing(true);

    const now = new Date(nowTimestamp);
    const month = now.getMonth();
    const day = now.getDate();
    const currentYear = now.getFullYear();

    // Check if tree was shaken in the same festive season
    // Festive season spans Dec 20 - Jan 5, so we need to check if both dates
    // fall within the same festive period (not just the same calendar year)
    if (tree?.shakenAt) {
      const shakenDate = new Date(tree.shakenAt);
      const shakenMonth = shakenDate.getMonth();
      const shakenDay = shakenDate.getDate();
      const shakenYear = shakenDate.getFullYear();

      let isSameFestiveSeason = false;

      if (month === 11) {
        // Currently in December - check if shaken in same December or following January
        isSameFestiveSeason =
          (shakenMonth === 11 && shakenYear === currentYear) ||
          (shakenMonth === 0 &&
            shakenDay <= 5 &&
            shakenYear === currentYear + 1);
      } else if (month === 0) {
        // Currently in January - check if shaken in previous December or same January
        isSameFestiveSeason =
          (shakenMonth === 11 &&
            shakenDay >= 20 &&
            shakenYear === currentYear - 1) ||
          (shakenMonth === 0 && shakenYear === currentYear);
      }

      if (isSameFestiveSeason) {
        // Close the popover because we have a modal to show instead
        close();
        setShowGiftedModal(true);
        return;
      }
    }

    const isValidPeriod =
      (month === 11 && day >= 20) || (month === 0 && day <= 5);
    if (!isValidPeriod) {
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

  return (
    <div
      className={classNames("absolute w-full h-full", {
        "cursor-pointer hover:img-highlight": true,
      })}
      onClick={shake}
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

      {revealing && isRevealing && (
        <Modal show>
          <Panel>
            <ChestRevealing type="Festive Tree Rewards" />
          </Panel>
        </Modal>
      )}
      {revealed && isRevealing && (
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
        {({ close }) => (
          <>
            <PopoverButton as="div" className="cursor-pointer">
              <FestiveTreeImage
                id={id}
                close={close}
                setShowGiftedModal={setShowGiftedModal}
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
