import React, { useContext, useEffect, useState } from "react";

import levelIcon from "assets/icons/level_up.png";

import { ButtonPanel, InnerPanel, OuterPanel } from "components/ui/Panel";
import {
  getAscensionDisplayText,
  getAscensionLevel,
  getExperienceToNextLevel,
  getMaxBumpkinLevel,
  isMaxLevel,
  type BumpkinLevel as BumpkinLevelValue,
} from "features/game/lib/level";

import { AchievementsModal } from "./Achievements";
import { Skills } from "./revamp/Skills";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import type { Bumpkin, GameState, Inventory } from "features/game/types/game";
import { ResizableBar } from "components/ui/ProgressBar";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { BumpkinEquip } from "./BumpkinEquip";
import { AchievementBadges } from "./AchievementBadges";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useSelector } from "@xstate/react";
import { formatNumber } from "lib/utils/formatNumber";
import type { MachineState } from "features/game/lib/gameMachine";
import { MyReputation } from "features/island/hud/components/reputation/Reputation";
import { ITEM_DETAILS } from "features/game/types/images";
import { LEGACY_BADGE_TREE } from "features/game/types/skills";
import { setImageWidth } from "lib/images";
import { LegacyBadges } from "./LegacyBadges";
import { getKeys } from "lib/object";
import { PowerSkills } from "features/island/hud/components/PowerSkills";
import type { PanelTabs } from "features/game/components/CloseablePanel";
import foodIcon from "assets/food/chicken_drumstick.png";
import type { Equipped } from "features/game/types/bumpkin";
import { Feed } from "features/island/bumpkin/components/Feed";
import { LevelUp } from "features/island/bumpkin/components/LevelUp";
import { getAvailableFood } from "features/game/lib/availableFood";
import type { ConsumableName } from "features/game/types/consumables";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import {
  getPowerSkills,
  type BumpkinSkillRevamp,
  type BumpkinRevampSkillName,
} from "features/game/types/bumpkinSkills";
import { getSkillCooldown } from "features/game/events/landExpansion/skillUsed";
import { getAvailableBumpkinSkillPoints } from "features/game/events/landExpansion/choseSkill";
import { useNow } from "lib/utils/hooks/useNow";

export type ViewState =
  | "home"
  | "achievements"
  | "skills"
  | "legacyBadges"
  | "powerSkills";

const _experience = (state: MachineState) =>
  state.context.state.bumpkin?.experience ?? 0;

export const BumpkinLevel: React.FC<{
  experience?: number;
  ascensionLevel?: number;
  maxLevel?: BumpkinLevelValue;
}> = ({ experience = 0, ascensionLevel = 0, maxLevel }) => {
  const ascension =
    ascensionLevel >= 1
      ? getAscensionLevel({ experience, ascensionLevel })
      : undefined;
  const atMax = ascension
    ? ascension.isReadyToAscend
    : isMaxLevel(experience, maxLevel);
  const { currentExperienceProgress, experienceToNextLevel } =
    ascension ?? getExperienceToNextLevel(experience, maxLevel);

  const getProgressPercentage = () => {
    let progressRatio = 1;
    if (!atMax) {
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
      )}/${atMax ? "-" : formatNumber(experienceToNextLevel, { decimalPlaces: 0 })} XP`}</p>
    </div>
  );
};
type Tab = "info" | "equip" | "skills" | "feed";

interface Props {
  initialTab: Tab;
  // When true, always open on `initialTab` instead of restoring the last-used
  // tab. Used when clicking the Bumpkin NPC so it always lands on Feed.
  forceTab?: boolean;
  onClose: () => void;
  bumpkin: Bumpkin;
  inventory: Inventory;
  readonly: boolean;
  gameState: GameState;
}

export const BumpkinModal: React.FC<Props> = ({
  initialTab,
  forceTab = false,
  onClose,
  bumpkin,
  inventory,
  readonly,
  gameState,
}) => {
  const { gameService } = useContext(Context);
  const { openModal } = useContext(ModalContext);
  const experience = useSelector(gameService, _experience);
  const ascensionLevel = gameState.island.ascensionLevel ?? 0;
  const maxBumpkinLevel = getMaxBumpkinLevel(gameState);
  const isAscended = ascensionLevel >= 1;
  const ascension = getAscensionLevel({
    experience,
    ascensionLevel,
    maxLevel: maxBumpkinLevel,
  });
  // Displayed level: within-ascension (0..50) when ascended, else the capped Bumpkin level.
  const level = ascension.level;
  const maxLevel = isAscended
    ? ascension.isReadyToAscend
    : isMaxLevel(experience, maxBumpkinLevel);
  // Fires the level-up modal once per level; the within-ascension (or legacy) level
  // increments per level-up and resets on ascend (no spurious modal on prestige).
  const currentBumpkinLevel = ascension.level;
  const [view, setView] = useState<ViewState>("home");
  const [tab, setTab] = useState<Tab>(() => {
    if (forceTab || initialTab !== "feed" || readonly) return initialTab;
    const stored = localStorage.getItem("bumpkinModalTab") as Tab | null;
    const valid: Tab[] = ["feed", "equip", "skills", "info"];
    return stored && valid.includes(stored) ? stored : initialTab;
  });
  const { t } = useAppTranslation();
  const now = useNow();

  useEffect(() => {
    if (!readonly) {
      localStorage.setItem("bumpkinModalTab", tab);
    }
  }, [tab, readonly]);

  const powerSkills = getPowerSkills();
  const powerSkillsUnlocked = powerSkills.filter(
    (skill) =>
      !!gameState.bumpkin?.skills[skill.name as BumpkinRevampSkillName],
  );
  const hasPowerSkills = powerSkillsUnlocked.length > 0;
  const powerSkillsReady =
    hasPowerSkills &&
    powerSkillsUnlocked
      .filter((skill: BumpkinSkillRevamp) => {
        const fertiliserSkill: BumpkinRevampSkillName[] = [
          "Sprout Surge",
          "Root Rocket",
          "Blend-tastic",
        ];
        return !fertiliserSkill.includes(skill.name as BumpkinRevampSkillName);
      })
      .some((skill: BumpkinSkillRevamp) => {
        const boostedCooldown = getSkillCooldown({
          cooldown: skill.requirements.cooldown ?? 0,
          state: gameState,
          skillName: skill.name as BumpkinRevampSkillName,
        });
        const nextSkillUse =
          (gameState.bumpkin?.previousPowerUseAt?.[
            skill.name as BumpkinRevampSkillName
          ] ?? 0) + boostedCooldown;
        return nextSkillUse < now;
      });

  const [acknowledgedLevel, setAcknowledgedLevel] =
    useState(currentBumpkinLevel);
  const hasLeveledUp = currentBumpkinLevel > acknowledgedLevel;
  const acknowledgeLevelUp = () => setAcknowledgedLevel(currentBumpkinLevel);

  const [selectedFoodName, setSelectedFoodName] = useState<
    ConsumableName | undefined
  >(undefined);

  const availableFood = getAvailableFood(inventory);
  const availableSkillPoints = getAvailableBumpkinSkillPoints(gameState);

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
        id: "feed",
        icon: foodIcon,
        name: t("feed"),
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
      {
        id: "info",
        icon: SUNNYSIDE.icons.player,
        name: t("info"),
      },
    ];
  };

  return (
    <CloseButtonPanel
      currentTab={tab}
      setCurrentTab={setTab}
      onClose={onClose}
      tabs={renderTabs()}
      container={tab === "skills" || tab === "feed" ? OuterPanel : undefined}
    >
      {tab === "feed" && !hasLeveledUp && (
        <InnerPanel className="flex items-center p-2 mb-1">
          <img
            src={levelIcon}
            style={{
              width: `${PIXEL_SCALE * 10}px`,
              marginRight: `${PIXEL_SCALE * 4}px`,
            }}
          />
          <div className="flex-1">
            <p className="text-sm">
              {getAscensionDisplayText({ ascension, length: "full" })}
              {maxLevel ? " (Max)" : ""}
            </p>
            <BumpkinLevel
              experience={bumpkin.experience}
              ascensionLevel={ascensionLevel}
              maxLevel={maxBumpkinLevel}
            />
          </div>
          {availableSkillPoints > 0 && (
            <p className="hidden sm:block text-xs text-right ml-2">
              {t("skillTier.skillPoints.available", {
                points: availableSkillPoints,
              })}
            </p>
          )}
        </InnerPanel>
      )}
      <div
        style={{
          maxHeight: "calc(100vh - 200px)",
          overflowY: "auto",
        }}
        className="scrollable"
      >
        {tab === "info" && (
          <BumpkinInfo
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
              gameService.send("bumpkin.equipped", {
                equipment,
              });
              gameService.send("SAVE");
            }}
          />
        )}
        {tab === "skills" && <Skills readonly={readonly} />}
        {tab === "feed" && (
          <>
            {hasLeveledUp ? (
              <InnerPanel>
                <LevelUp
                  level={level}
                  ascension={isAscended ? ascensionLevel : undefined}
                  onClose={() => {
                    if (currentBumpkinLevel === 2 && !isAscended) {
                      onClose();
                      openModal("SECOND_LEVEL");
                      setTimeout(() => acknowledgeLevelUp(), 500);
                    } else {
                      acknowledgeLevelUp();
                    }
                  }}
                  wearables={bumpkin.equipped as Equipped}
                />
              </InnerPanel>
            ) : (
              <Feed
                food={availableFood}
                selectedName={selectedFoodName}
                setSelectedName={setSelectedFoodName}
              />
            )}
          </>
        )}
      </div>
    </CloseButtonPanel>
  );
};

export const BumpkinInfo: React.FC<{
  gameState: GameState;
  setView: (view: ViewState) => void;
  powerSkillsReady: boolean;
  hasPowerSkills: boolean;
  readonly: boolean;
}> = ({ gameState, setView, powerSkillsReady, hasPowerSkills, readonly }) => {
  const { t } = useAppTranslation();
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

  return (
    <div>
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
  );
};
