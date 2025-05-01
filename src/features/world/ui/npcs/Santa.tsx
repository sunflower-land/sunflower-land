import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES, acknowledgeNPC, isNPCAcknowledged } from "lib/npcs";
import React, { useContext, useEffect, useState } from "react";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import candy from "public/world/candy_icon.png";
import gift from "assets/icons/gift.png";
import token from "assets/icons/flower_token.webp";
import {
  DAILY_CANDY,
  DAILY_CHRISTMAS_REWARDS,
  getDayOfChristmas,
} from "features/game/events/landExpansion/collectCandy";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { getTimeLeft, secondsTillReset, secondsToString } from "lib/utils/time";
import { getKeys } from "features/game/types/craftables";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SquareIcon } from "components/ui/SquareIcon";
import { ITEM_DETAILS } from "features/game/types/images";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { getImageUrl } from "lib/utils/getImageURLS";
import { InventoryItemName } from "features/game/types/game";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  onClose: () => void;
}

export const Santa: React.FC<Props> = ({ onClose }) => {
  const [showIntro, setShowIntro] = useState(!isNPCAcknowledged("santa"));

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const game = gameState.context.state;
  const { t } = useAppTranslation();

  useEffect(() => {
    acknowledgeNPC("santa");
  }, []);

  if (showIntro) {
    return (
      <SpeakingModal
        onClose={() => setShowIntro(false)}
        bumpkinParts={NPC_WEARABLES.santa}
        message={[
          {
            text: t("npcDialogues.santa.intro1"),
          },
          {
            text: t("npcDialogues.santa.intro2"),
          },
          {
            text: t("npcDialogues.santa.intro3"),
          },
        ]}
      />
    );
  }

  const startDate = new Date("2024-12-12T00:00:00.000Z");
  const endDate = new Date("2024-12-28T00:00:00.000Z");

  const getTotalSecondsAvailable = () => {
    return (endDate.getTime() - startDate.getTime()) / 1000;
  };

  const timeRemaining = getTimeLeft(
    startDate.getTime(),
    getTotalSecondsAvailable(),
  );

  const { dayOfChristmas } = getDayOfChristmas(gameState.context.state);

  const candyCollected = game.christmas2024?.day[dayOfChristmas]?.candy ?? 0;

  const remaining = DAILY_CANDY - candyCollected;

  const progress = gameState.context.state.christmas2024?.day ?? {};
  const complete = getKeys(progress).filter(
    (index) =>
      // They have completed the daily requirement
      progress[index].candy >= DAILY_CANDY,
  ).length;

  const rewards = DAILY_CHRISTMAS_REWARDS;

  return (
    <CloseButtonPanel onClose={onClose} bumpkinParts={NPC_WEARABLES.santa}>
      <div className="max-h-[450px] overflow-y-auto scrollable flex flex-col p-2 ">
        {remaining > 0 && (
          <>
            <Label type="vibrant" icon={candy} className="ml-1.5 mb-1">
              {t("candy.remaining", { candies: remaining })}
            </Label>

            <p className="text-sm flex-1 mb-2">
              {t("npcDialogues.santa.dialogue1")}
            </p>
          </>
        )}
        {remaining === 0 && dayOfChristmas <= 11 && (
          <>
            <Label type="success" icon={candy} className="ml-1.5 mb-1">
              {t("chores.complete")}
            </Label>
            <p className="text-sm flex-1 mb-2">
              {t("npcDialogues.santa.dialogue2")}
            </p>
            <div className="flex mb-2 ">
              <p className="text-xs flex-1 mr-2">
                {t("npcDialogues.santa.nextChallenge")}
              </p>
              <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
                {secondsToString(secondsTillReset(), { length: "medium" })}
              </Label>
            </div>
          </>
        )}
        {remaining === 0 && dayOfChristmas === 12 && (
          <>
            <Label type="success" icon={candy} className="ml-1.5 mb-1">
              {t("chores.complete")}
            </Label>
            <p className="text-sm flex-1 mb-2">
              {t("npcDialogues.santa.dialogue3")}
            </p>
          </>
        )}
        <div className="flex justify-between flex-wrap mb-2 gap-1 ml-1.5">
          <Label className="flex" icon={gift} type="default">
            {t("christmas.days.completed", { completed: complete })}
          </Label>

          <Label className="flex" icon={SUNNYSIDE.icons.stopwatch} type="info">
            {t("megaStore.timeRemaining", {
              timeRemaining: secondsToString(timeRemaining, {
                length: "medium",
                removeTrailingZeros: true,
              }),
            })}
          </Label>
        </div>

        <p className="text-xs mb-2">{t("npcDialogues.santa.dialogue4")}</p>

        <div className="flex flex-row justify-center gap-1 flex-wrap overflow-y-auto scrollable max-h-96">
          {Object.entries(rewards).map(([day, reward]) => (
            <div
              key={day}
              className="bg-brown-600 flex-shrink-0 flex flex-col items-center mr-1 mb-1 w-28 sm:w-32 md:w-32 lg:w-34"
              style={{
                ...pixelDarkBorderStyle,
                height: "120px",
              }}
            >
              <Label
                type="default"
                className="text-center bottom-1 text-xxs "
                secondaryIcon={
                  complete >= Number(day) ? SUNNYSIDE.icons.confirm : gift
                }
                style={{
                  width: `calc(100% + ${PIXEL_SCALE * 3}px)`,
                  height: "25px",
                }}
              >
                {t("christmas.days", { day })}
              </Label>

              <div className="flex justify-center w-full h-full overflow-y-auto scrollable">
                {reward.sfl > 0 && (
                  <>
                    <div className="flex flex-col items-center">
                      <SquareIcon key={`${day}-sfl`} icon={token} width={20} />
                      <span className="text-xxs flex text-center">
                        {reward.sfl + " FLOWER"}
                      </span>
                    </div>
                  </>
                )}
                {Object.entries(reward.items).length > 0 && (
                  <div className="flex flex-col">
                    {getKeys(reward.items).map((item) => (
                      <div
                        className="flex items-center flex-col mb-6"
                        key={`${day}-${item}-item`}
                      >
                        <SquareIcon
                          icon={ITEM_DETAILS[item as InventoryItemName].image}
                          width={20}
                        />
                        <span className="text-xxs flex text-center">
                          {reward.items[item] + " " + item}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {Object.entries(reward.wearables).length > 0 && (
                  <div className="flex flex-col">
                    {getKeys(reward.wearables).map((item) => (
                      <div
                        className="flex items-center flex-col mb-6"
                        key={`${day}-${item}-wearable`}
                      >
                        <SquareIcon
                          icon={getImageUrl(ITEM_IDS[item as BumpkinItem])}
                          width={20}
                        />
                        <span className="text-xxs flex text-center">
                          {reward.wearables[item] + " " + item}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </CloseButtonPanel>
  );
};

export const ChristmasReward: React.FC<Props> = ({ onClose }) => {
  const [state, setState] = useState<"intro" | "reward" | "claimed">("intro");
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { dayOfChristmas } = getDayOfChristmas(gameState.context.state);

  useEffect(() => {
    acknowledgeNPC("santa");
  }, []);

  const { t } = useAppTranslation();

  const claimed = () => {
    gameService.send("candy.collected");
    gameService.send("SAVE");
    setState("claimed");
  };

  if (state === "intro") {
    return (
      <SpeakingModal
        onClose={() => {
          setState("reward");
        }}
        bumpkinParts={NPC_WEARABLES.santa}
        message={[
          {
            text: t("npcDialogues.santa.dialogue5"),
          },
        ]}
      />
    );
  }

  if (state === "claimed") {
    return <Santa onClose={onClose} />;
  }

  const reward = DAILY_CHRISTMAS_REWARDS[dayOfChristmas];
  return (
    <CloseButtonPanel bumpkinParts={NPC_WEARABLES.santa}>
      <ClaimReward
        onClaim={claimed}
        reward={{
          createdAt: 0,
          id: "christmas-reward-2024",
          items: reward.items,
          sfl: reward.sfl,
          wearables: reward.wearables,
          coins: 0,
        }}
      />
    </CloseButtonPanel>
  );
};
