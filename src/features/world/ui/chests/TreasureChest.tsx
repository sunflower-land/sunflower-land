import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Revealed } from "features/game/components/Revealed";
import { ITEM_DETAILS } from "features/game/types/images";

import React, { useContext, useState } from "react";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ChestRevealing } from "./ChestRevealing";
import { Keys } from "features/game/types/game";
import { ChestRewardsList } from "components/ui/ChestRewardsList";
import rewardsIcon from "assets/icons/stock.webp";
import basicChest from "public/world/basic_chest.png";
import rareChest from "public/world/wooden_chest.png";
import luxuryChest from "public/world/luxury_chest.png";

interface Props {
  onClose: () => void;
  location: "plaza";
  type: Keys;
  setIsLoading?: (isLoading: boolean) => void;
}

export const TreasureChest: React.FC<Props> = ({
  onClose,
  location,
  type,
  setIsLoading,
}) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { t } = useAppTranslation();

  const [tab, setTab] = useState(0);

  const tabs = [
    ...(type === "Treasure Key"
      ? [
          {
            icon: basicChest,
            name: t("chestRewardsList.treasureChest.tabTitle1"),
          },
        ]
      : type === "Rare Key"
        ? [
            {
              icon: rareChest,
              name: t("chestRewardsList.treasureChest.tabTitle2"),
            },
          ]
        : [
            {
              icon: luxuryChest,
              name: t("chestRewardsList.treasureChest.tabTitle3"),
            },
          ]),
    {
      icon: rewardsIcon,
      name: t("chestRewardsList.rewardsTitle"),
    },
  ];

  // Just a prolonged UI state to show the shuffle of items animation
  const [isPicking, setIsPicking] = useState(false);

  const [isRevealing, setIsRevealing] = useState(false);

  const hasKey = !!gameState.context.state.inventory[type]?.gte(1);

  const open = async () => {
    setIsLoading && setIsLoading(true);
    setIsPicking(true);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    gameService.send("REVEAL", {
      event: {
        key: type,
        location,
        type: "treasureChest.opened",
        createdAt: new Date(),
      },
    });
    setIsRevealing(true);
    setIsPicking(false);
    setIsLoading && setIsLoading(false);
  };

  if (isPicking || (gameState.matches("revealing") && isRevealing)) {
    return (
      <Panel>
        <ChestRevealing type={type} />
      </Panel>
    );
  }

  if (gameState.matches("revealed") && isRevealing) {
    return (
      <Panel>
        <Revealed
          onAcknowledged={() => {
            setIsRevealing(false);
            onClose();
          }}
        />
      </Panel>
    );
  }

  if (!hasKey) {
    return (
      <CloseButtonPanel
        tabs={tabs}
        currentTab={tab}
        setCurrentTab={setTab}
        onClose={onClose}
      >
        {tab === 0 && (
          <div className="p-2">
            <Label
              type="danger"
              className="mb-2"
              icon={ITEM_DETAILS[type].image}
            >
              {t("basic.treasure.missingKey")}
            </Label>
            <p className="text-xs mb-2">
              {type === "Treasure Key" && t("basic.treasure.needKey")}
              {type === "Rare Key" && t("rare.treasure.needKey")}
              {type === "Luxury Key" && t("luxury.treasure.needKey")}
              {"."}
            </p>
            <p className="text-xs">
              {t("basic.treasure.getKey")}
              {"."}
            </p>
          </div>
        )}

        {tab === 1 && <ChestRewardsList type={type} />}
      </CloseButtonPanel>
    );
  }

  // const isValentinesDayUTC =
  //   new Date().getUTCMonth() === 1 && new Date().getUTCDate() <= 17;

  return (
    <CloseButtonPanel
      tabs={tabs}
      currentTab={tab}
      setCurrentTab={setTab}
      onClose={onClose}
    >
      {tab === 0 && (
        <>
          <div className="p-2">
            <div className="flex flex-wrap mr-12">
              <Label
                type="default"
                icon={ITEM_DETAILS[type].image}
                className="mb-2 mr-3 capitalize"
                secondaryIcon={SUNNYSIDE.icons.confirm}
              >
                {type}
              </Label>
              {/* {isValentinesDayUTC && (
            <Label
              className="mb-2"
              type="vibrant"
              icon={SUNNYSIDE.icons.stopwatch}
            >
              {t("event.valentines.rewards")}
            </Label>
          )} */}
            </div>
            <p className="text-xs mb-2">{t("basic.treasure.congratsKey")}</p>
            <p className="text-xs mb-2">{t("basic.treasure.openChest")}</p>
          </div>
          <Button onClick={open}>{t("open")}</Button>
        </>
      )}

      {tab === 1 && <ChestRewardsList type={type} />}
    </CloseButtonPanel>
  );
};
