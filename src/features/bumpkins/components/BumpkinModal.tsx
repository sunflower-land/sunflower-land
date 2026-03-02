import React, { useContext, useState } from "react";

import levelIcon from "assets/icons/level_up.png";

import { Equipped as BumpkinParts } from "features/game/types/bumpkin";
import { DynamicNFT } from "./DynamicNFT";
import { ButtonPanel, OuterPanel } from "components/ui/Panel";
import {
  getBumpkinLevel,
  getExperienceToNextLevel,
  isMaxLevel,
} from "features/game/lib/level";

import { AchievementsModal } from "./Achievements";
import { Skills } from "./revamp/Skills";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { Bumpkin, GameState, Inventory } from "features/game/types/game";
import { ResizableBar } from "components/ui/ProgressBar";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { BumpkinEquip } from "./BumpkinEquip";
import { AchievementBadges } from "./AchievementBadges";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useSelector } from "@xstate/react";
import { formatNumber } from "lib/utils/formatNumber";
import { MachineState } from "features/game/lib/gameMachine";
import { MyReputation } from "features/island/hud/components/reputation/Reputation";
import { ITEM_DETAILS } from "features/game/types/images";
import { LEGACY_BADGE_TREE } from "features/game/types/skills";
import { setImageWidth } from "lib/images";
import { LegacyBadges } from "./LegacyBadges";
import { getKeys } from "features/game/types/decorations";
import { PowerSkills } from "features/island/hud/components/PowerSkills";
import { isBuffActive } from "features/game/types/buffs";
import { Label } from "components/ui/Label";
import { secondsToString } from "lib/utils/time";
import { useNow } from "lib/utils/hooks/useNow";
import { PanelTabs } from "features/game/components/CloseablePanel";

export type ViewState =
  | "home"
  | "achievements"
  | "skills"
  | "legacyBadges"
  | "powerSkills";

const _experience = (state: MachineState) =>
  state.context.state.bumpkin?.experience ?? 0;

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
      <p className="font-secondary mt-0.5 ml-2">{`${formatNumber(
        currentExperienceProgress,
        { decimalPlaces: 0 },
      )}/${maxLevel ? "-" : formatNumber(experienceToNextLevel, { decimalPlaces: 0 })} XP`}</p>
    </div>
  );
};
type Tab = "info" | "equip" | "skills";

interface Props {
  initialTab: Tab;
  onClose: () => void;
  bumpkin: Bumpkin;
  inventory: Inventory;
  readonly: boolean;
  gameState: GameState;
  powerSkillsReady: boolean;
  hasPowerSkills: boolean;
}

export const BumpkinModal: React.FC<Props> = ({
  initialTab,
  onClose,
  bumpkin,
  inventory,
  readonly,
  gameState,
  powerSkillsReady,
  hasPowerSkills,
}) => {
  const { gameService } = useContext(Context);
  const experience = useSelector(gameService, _experience);
  const level = getBumpkinLevel(experience);
  const maxLevel = isMaxLevel(experience);
  const [view, setView] = useState<ViewState>("home");
  const [tab, setTab] = useState(initialTab);
  const { t } = useAppTranslation();

  if (view === "achievements") {
    return (
      <AchievementsModal
        readonly={readonly}
        onBack={() => setView("home")}
        onClose={onClose}
      />
    );
  }

  if (view === "legacyBadges") {
    return (
      <LegacyBadges
        onBack={() => setView("home")}
        onClose={onClose}
        inventory={inventory}
      />
    );
  }

  if (view === "powerSkills") {
    return (
      <PowerSkills
        onHide={onClose}
        onBack={() => setView("home")}
        readonly={readonly}
      />
    );
  }

  const renderTabs = (): PanelTabs<Tab>[] => {
    if (readonly) {
      return [
        {
          id: "info",
          icon: SUNNYSIDE.icons.player,
          name: t("info"),
        },
      ];
    }

    return [
      {
        id: "info",
        icon: SUNNYSIDE.icons.player,
        name: t("info"),
      },
      {
        id: "equip",
        icon: SUNNYSIDE.icons.wardrobe,
        name: t("equip"),
      },
      {
        id: "skills",
        icon: SUNNYSIDE.badges.seedSpecialist,
        name: t("skills"),
      },
    ];
  };

  return (
    <CloseButtonPanel
      currentTab={tab}
      setCurrentTab={setTab}
      onClose={onClose}
      tabs={renderTabs()}
      container={tab === "skills" ? OuterPanel : undefined}
    >
      <div
        style={{
          maxHeight: "calc(100vh - 200px)",
          overflowY: "auto",
        }}
        className="scrollable"
      >
        {tab === "info" && (
          <BumpkinInfo
            level={level}
            maxLevel={maxLevel}
            gameState={gameState}
            setView={setView}
            powerSkillsReady={powerSkillsReady}
            hasPowerSkills={hasPowerSkills}
            readonly={readonly}
          />
        )}

        {tab === "equip" && (
          <BumpkinEquip
            equipment={bumpkin.equipped}
            onEquip={(equipment) => {
              gameService.send({ type: "bumpkin.equipped", equipment });
              gameService.send({ type: "SAVE" });
            }}
          />
        )}
        {tab === "skills" && <Skills readonly={readonly} />}
      </div>
    </CloseButtonPanel>
  );
};

export const BumpkinInfo: React.FC<{
  level: number;
  maxLevel: boolean;
  gameState: GameState;
  setView: (view: ViewState) => void;
  powerSkillsReady: boolean;
  hasPowerSkills: boolean;
  readonly: boolean;
}> = ({
  level,
  maxLevel,
  gameState,
  setView,
  powerSkillsReady,
  hasPowerSkills,
  readonly,
}) => {
  const { t } = useAppTranslation();
  const now = useNow();
  const { bumpkin, inventory } = gameState;
  const BADGES = getKeys(LEGACY_BADGE_TREE);

  const badges = BADGES.map((badge) => {
    if (inventory[badge]) {
      return (
        <img
          key={badge}
          src={ITEM_DETAILS[badge].image}
          alt={badge}
          style={{
            opacity: 0,
            marginRight: `${PIXEL_SCALE * 2}px`,
            marginBottom: `${PIXEL_SCALE * 2}px`,
          }}
          onLoad={(e) => setImageWidth(e.currentTarget)}
        />
      );
    }

    return null;
  }).filter(Boolean);

  const isPowerHourActive = isBuffActive({
    buff: "Power hour",
    game: gameState,
  });

  return (
    <div className="flex flex-wrap">
      <div className="w-full sm:w-1/3 z-10 mr-0 sm:mr-2">
        <div className="w-full rounded-md overflow-hidden mb-1">
          <DynamicNFT
            showBackground
            bumpkinParts={bumpkin?.equipped as BumpkinParts}
          />
        </div>
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

        <MyReputation />
        {hasPowerSkills && !readonly && (
          <ButtonPanel
            onClick={() => setView("powerSkills")}
            className="mb-2 relative mt-1 !px-2 !py-1"
          >
            <div className="flex items-center mb-1 justify-between">
              <div className="flex items-center">
                <span className="text-sm">{t("powerSkills.title")}</span>
                {powerSkillsReady && (
                  <img
                    src={SUNNYSIDE.icons.expression_alerted}
                    className="ml-2 w-2"
                    alt="Exclamation"
                  />
                )}
              </div>
              <span className="underline text-sm">{t("viewAll")}</span>
            </div>
          </ButtonPanel>
        )}
        {badges.length > 0 && (
          <ButtonPanel
            className="mb-2 relative mt-1 !px-2 !py-1"
            onClick={() => setView("legacyBadges")}
          >
            <div className="flex items-center mb-1 justify-between">
              <div className="flex items-center">
                <span className="text-sm">{`Legacy Badges`}</span>
              </div>
              <span className="underline text-sm">{t("viewAll")}</span>
            </div>
            <div className="flex flex-wrap items-center mt-2">{badges}</div>
          </ButtonPanel>
        )}

        {isPowerHourActive && (
          <div className="flex items-center">
            <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
              {`Power hour`}
            </Label>
            <span className="text-xs ml-2">
              {secondsToString(
                ((gameState.buffs?.["Power hour"]?.startedAt ?? 0) +
                  (gameState.buffs?.["Power hour"]?.durationMS ?? 0) -
                  now) /
                  1000,
                { length: "medium" },
              )}
            </span>
          </div>
        )}

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
  );
};
