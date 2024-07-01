import React, { useContext, useEffect, useState } from "react";

import levelIcon from "assets/icons/level_up.png";
import token from "assets/icons/sfl.webp";

import { Equipped as BumpkinParts } from "features/game/types/bumpkin";
import { DynamicNFT } from "./DynamicNFT";
import { ButtonPanel } from "components/ui/Panel";
import {
  getBumpkinLevel,
  getExperienceToNextLevel,
  isMaxLevel,
} from "features/game/lib/level";

import { AchievementsModal } from "./Achievements";
import { SkillsModal } from "features/bumpkins/components/Skills";
import { CONFIG } from "lib/config";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SkillBadges } from "./SkillBadges";
import { getAvailableBumpkinSkillPoints } from "features/game/events/landExpansion/pickSkill";
import { SUNNYSIDE } from "assets/sunnyside";
import { Bumpkin, GameState, Inventory } from "features/game/types/game";
import { ResizableBar } from "components/ui/ProgressBar";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { BumpkinEquip } from "./BumpkinEquip";
import { AchievementBadges } from "./AchievementBadges";
import { Trade } from "./Trade";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  FloorPrices,
  getListingsFloorPrices,
} from "features/game/actions/getListingsFloorPrices";
import { Context as AuthContext } from "features/auth/lib/Provider";
import { useActor } from "@xstate/react";
import { Loading } from "features/auth/components";

type ViewState = "home" | "achievements" | "skills";

export const BumpkinLevel: React.FC<{ experience?: number }> = ({
  experience = 0,
}) => {
  const maxLevel = isMaxLevel(experience);
  const { currentExperienceProgress, experienceToNextLevel } =
    getExperienceToNextLevel(experience);

  const getProgressPercentage = () => {
    let progressRatio = 1;
    if (!maxLevel) {
      progressRatio = Math.min(
        1,
        currentExperienceProgress / experienceToNextLevel,
      );
    }

    return progressRatio * 100;
  };

  return (
    <div className="flex items-center">
      <ResizableBar
        percentage={getProgressPercentage()}
        type="progress"
        outerDimensions={{
          width: 40,
          height: 7,
        }}
      />

      {/* XP progress text */}
      <p className="font-secondary mt-0.5 ml-2">{`${Math.floor(
        currentExperienceProgress,
      )}/${maxLevel ? "-" : Math.floor(experienceToNextLevel)} XP`}</p>
    </div>
  );
};

interface Props {
  initialView: ViewState;
  onClose: () => void;
  bumpkin: Bumpkin;
  inventory: Inventory;
  readonly: boolean;
  isFullUser: boolean;
  gameState: GameState;
}

export const BumpkinModal: React.FC<Props> = ({
  initialView,
  onClose,
  bumpkin,
  inventory,
  readonly,
  isFullUser,
  gameState,
}) => {
  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthContext);
  const [authState] = useActor(authService);
  const [floorPrices, setFloorPrices] = useState<FloorPrices>({});
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<ViewState>(initialView);

  const [tab, setTab] = useState(0);
  const { t } = useAppTranslation();
  const getVisitBumpkinUrl = () => {
    if (readonly) {
      const baseUrl =
        CONFIG.NETWORK === "mainnet"
          ? `https://opensea.io/assets/matic`
          : `https://testnets.opensea.io/assets/amoy`;

      return `${baseUrl}/${CONFIG.BUMPKIN_CONTRACT}/${bumpkin?.id}`;
    }

    const baseUrl =
      CONFIG.NETWORK === "mainnet"
        ? `https://bumpkins.io/#/bumpkins`
        : `https://testnet.bumpkins.io/#/bumpkins`;

    return `${baseUrl}/${bumpkin?.id}`;
  };

  useEffect(() => {
    if (tab === 2) {
      const load = async () => {
        setIsLoading(true);
        const floorPrices = await getListingsFloorPrices(
          authState.context.user.rawToken,
        );
        setFloorPrices((prevFloorPrices) => ({
          ...prevFloorPrices,
          ...floorPrices,
        }));

        setIsLoading(false);
      };
      load();
    }
  }, [tab]);

  if (view === "achievements") {
    return (
      <AchievementsModal
        readonly={readonly}
        onBack={() => setView("home")}
        onClose={onClose}
      />
    );
  }

  if (view === "skills") {
    return (
      <SkillsModal
        readonly={readonly}
        onBack={() => setView("home")}
        onClose={onClose}
      />
    );
  }

  const experience = bumpkin?.experience ?? 0;
  const level = getBumpkinLevel(experience);
  const maxLevel = isMaxLevel(experience);

  const hasAvailableSP = getAvailableBumpkinSkillPoints(bumpkin) > 0;

  return (
    <CloseButtonPanel
      currentTab={tab}
      setCurrentTab={setTab}
      onClose={onClose}
      tabs={[
        {
          icon: SUNNYSIDE.icons.player,
          name: t("info"),
        },
        ...(!readonly
          ? [
              {
                icon: SUNNYSIDE.icons.wardrobe,
                name: t("equip"),
              },
              {
                icon: token,
                name: t("trades"),
              },
            ]
          : []),
      ]}
    >
      <div
        style={{
          maxHeight: "calc(100vh - 200px)",
          overflowY: "auto",
        }}
        className="scrollable"
      >
        {tab === 0 && (
          <div className="flex flex-wrap">
            <div className="w-full sm:w-1/3 z-10 mr-0 sm:mr-2">
              <div className="w-full rounded-md overflow-hidden mb-1">
                <DynamicNFT
                  showBackground
                  bumpkinParts={bumpkin?.equipped as BumpkinParts}
                />
              </div>
              {/* {isFullUser && (
              <div className="ml-1">
                <a
                  href={getVisitBumpkinUrl()}
                  target="_blank"
                  className="underline text-xxs"
                  rel="noreferrer"
                >
                  Visit Bumpkin
                </a>
              </div>
            )} */}
            </div>

            <div className="flex-1">
              <div className="mb-3">
                <div className="flex items-center ml-1 my-2">
                  <img
                    src={levelIcon}
                    style={{
                      width: `${PIXEL_SCALE * 10}px`,
                      marginRight: `${PIXEL_SCALE * 4}px`,
                    }}
                  />
                  <div>
                    <p>
                      {t("lvl")} {level}
                      {maxLevel ? " (Max)" : ""}
                    </p>
                    {/* Progress bar */}
                    <BumpkinLevel experience={bumpkin.experience} />
                  </div>
                </div>
              </div>

              <ButtonPanel
                onClick={() => setView("skills")}
                className="mb-2 relative mt-1 !px-2 !py-1"
              >
                <div className="flex items-center mb-1 justify-between">
                  <div className="flex items-center">
                    <span className="text-sm">{t("skills")}</span>
                    {hasAvailableSP && !readonly && (
                      <img
                        src={SUNNYSIDE.icons.expression_alerted}
                        className="h-4 ml-2"
                      />
                    )}
                  </div>
                  <span className="text-sm underline">{t("viewAll")}</span>
                </div>
                <SkillBadges
                  inventory={inventory}
                  bumpkin={bumpkin as Bumpkin}
                />
              </ButtonPanel>

              <ButtonPanel
                onClick={() => setView("achievements")}
                className="mb-2 relative mt-1 !px-2 !py-1"
              >
                <div className="flex items-center mb-1 justify-between">
                  <div className="flex items-center">
                    <span className="text-sm">{t("achievements")}</span>
                  </div>
                  <span className="underline text-sm">{t("viewAll")}</span>
                </div>
                <AchievementBadges achievements={bumpkin?.achievements} />
              </ButtonPanel>
            </div>
          </div>
        )}
        {tab === 1 && (
          <BumpkinEquip
            equipment={bumpkin.equipped}
            game={gameState}
            onEquip={(equipment) => {
              gameService.send("bumpkin.equipped", {
                equipment,
              });
              gameService.send("SAVE");
            }}
          />
        )}
        {tab === 2 && isLoading && (
          <div className="my-2">
            <Loading />
          </div>
        )}
        {tab === 2 && !isLoading && <Trade floorPrices={floorPrices} />}
      </div>
    </CloseButtonPanel>
  );
};
