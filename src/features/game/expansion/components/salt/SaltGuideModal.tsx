import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import { SquareIcon } from "components/ui/SquareIcon";
import { secondsToString } from "lib/utils/time";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import { BuffLabel } from "features/game/types";
import {
  BUMPKIN_REVAMP_SKILL_TREE,
  BumpkinRevampSkillName,
  BumpkinSkillRevamp,
} from "features/game/types/bumpkinSkills";
import {
  INNER_CANVAS_WIDTH,
  SkillBox,
} from "features/bumpkins/components/revamp/SkillBox";
import { getSkillImage } from "features/bumpkins/components/revamp/SkillPathDetails";
import { SALT_SCULPTURE_VARIANTS } from "features/island/lib/alternateArt";
import {
  getMaxStoredSaltCharges,
  getSaltChargeGenerationTime,
  getSaltYieldPerRake,
  SALT_FARM_MAX_LEVEL,
  SALT_FARM_UPGRADES,
} from "features/game/types/salt";
import { GameState } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import saltNodeEmpty from "assets/buildings/salt/salt_node_empty.webp";
import saltNodeStage1 from "assets/buildings/salt/salt_node_stage_1.webp";
import saltNodeStage2 from "assets/buildings/salt/salt_node_stage_2.webp";
import saltNodeStage3 from "assets/buildings/salt/salt_node_stage_3.webp";

type Tab = "guide" | "extra";

const _state = (state: MachineState) => state.context.state;

export const SaltGuideModal: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const { t } = useAppTranslation();
  const [tab, setTab] = useState<Tab>("guide");

  return (
    <CloseButtonPanel
      className="w-[600px] max-w-[95vw] min-h-[360px]"
      onClose={onClose}
      tabs={[
        {
          id: "guide",
          icon: SUNNYSIDE.icons.expression_confused,
          name: t("guide"),
        },
        {
          id: "extra",
          icon: SUNNYSIDE.icons.lightning,
          name: t("fishing.extras"),
        },
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
      container={OuterPanel}
    >
      {tab === "guide" && <SaltGuide state={state} />}
      {tab === "extra" && <SaltExtras state={state} />}
    </CloseButtonPanel>
  );
};

const GuideItem: React.FC<{ icon: string; children: React.ReactNode }> = ({
  icon,
  children,
}) => (
  <div className="flex items-start gap-2">
    <div className="flex-shrink-0 w-5 h-5 pt-0.5">
      <img src={icon} className="w-full h-full object-contain" />
    </div>
    <p className="text-xs">{children}</p>
  </div>
);

const SaltGuide: React.FC<{ state: GameState }> = ({ state }) => {
  const { t } = useAppTranslation();
  const nodes = Object.values(state.saltFarm.nodes);
  const nodeCount = nodes.length;
  const maxNodes = SALT_FARM_UPGRADES[SALT_FARM_MAX_LEVEL].nodes;
  const { chargeGenerationTimeMs } = getSaltChargeGenerationTime({
    gameState: state,
  });
  const maxCharges = getMaxStoredSaltCharges(
    state.sculptures?.["Salt Sculpture"]?.level ?? 0,
  );

  return (
    <div className="scrollable max-h-[430px] overflow-y-auto overflow-x-hidden">
      <InnerPanel className="mb-1">
        <div className="flex items-center justify-between gap-1 mb-1">
          <Label type="default" icon={ITEM_DETAILS["Salt"].image}>
            {t("saltGuide.title")}
          </Label>
          <Label type="info" icon={saltNodeEmpty}>
            {t("saltGuide.nodesUnlocked", {
              count: nodeCount,
              max: maxNodes,
            })}
          </Label>
        </div>

        <div className="flex flex-wrap gap-1 mb-2">
          <Label type="success" icon={SUNNYSIDE.icons.arrow_up}>
            {t("saltGuide.maxCharges", {
              count: maxCharges,
            })}
          </Label>
          <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
            {secondsToString(chargeGenerationTimeMs / 1000, {
              length: "medium",
            })}
          </Label>
        </div>

        <div className="flex items-center justify-center my-2">
          <div className="flex items-center gap-2">
            <SquareIcon icon={saltNodeStage3} width={18} />
            <SquareIcon icon={saltNodeStage2} width={18} />
            <SquareIcon icon={saltNodeStage1} width={18} />
            <img
              src={ITEM_DETAILS["Salt Rake"].image}
              className="object-contain"
              style={{ width: `${PIXEL_SCALE * 16}px` }}
            />
            <img
              src={SUNNYSIDE.icons.arrow_right}
              className="object-contain"
              style={{ width: `${PIXEL_SCALE * 10}px` }}
            />
            <SquareIcon icon={ITEM_DETAILS["Salt"].image} width={16} />
          </div>
        </div>
      </InnerPanel>

      <InnerPanel>
        <div className="flex flex-col gap-2 p-1">
          <GuideItem icon={saltNodeEmpty}>
            {t("saltGuide.howItWorks.nodes")}
          </GuideItem>
          <GuideItem icon={SUNNYSIDE.icons.stopwatch}>
            {t("saltGuide.howItWorks.charges")}
          </GuideItem>
          <GuideItem icon={ITEM_DETAILS["Salt Rake"].image}>
            {t("saltGuide.howItWorks.rakes")}
          </GuideItem>
          <GuideItem icon={SUNNYSIDE.icons.arrow_up}>
            {t("saltGuide.howItWorks.upgrades")}
          </GuideItem>
        </div>
      </InnerPanel>
    </div>
  );
};

type SaltExtraItem = {
  name: string;
  location: string;
  buff: BuffLabel[];
  isActive: boolean;
  icon?: string;
  isCollectible?: boolean;
  skillName?: BumpkinRevampSkillName;
};

const InactiveIconFrame: React.FC<{ icon: string }> = ({ icon }) => (
  <div
    className="bg-brown-600 relative"
    style={{
      width: `${PIXEL_SCALE * (INNER_CANVAS_WIDTH + 4)}px`,
      height: `${PIXEL_SCALE * (INNER_CANVAS_WIDTH + 4)}px`,
      marginTop: `${PIXEL_SCALE * 3}px`,
      marginBottom: `${PIXEL_SCALE * 2}px`,
      marginLeft: `${PIXEL_SCALE * 2}px`,
      marginRight: `${PIXEL_SCALE * 3}px`,
      ...pixelDarkBorderStyle,
    }}
  >
    <SquareIcon icon={icon} width={INNER_CANVAS_WIDTH} className="silhouette" />
  </div>
);

const ItemIconFrame: React.FC<{
  icon: string;
  isActive: boolean;
  isCollectible?: boolean;
}> = ({ icon, isActive, isCollectible }) => {
  if (!isActive) {
    return <InactiveIconFrame icon={icon} />;
  }

  return (
    <div
      className="bg-brown-600 relative"
      style={{
        width: `${PIXEL_SCALE * (INNER_CANVAS_WIDTH + 4)}px`,
        height: `${PIXEL_SCALE * (INNER_CANVAS_WIDTH + 4)}px`,
        marginTop: `${PIXEL_SCALE * 3}px`,
        marginBottom: `${PIXEL_SCALE * 2}px`,
        marginLeft: `${PIXEL_SCALE * 2}px`,
        marginRight: `${PIXEL_SCALE * 3}px`,
        ...pixelDarkBorderStyle,
      }}
    >
      {isCollectible && (
        <img
          src={SUNNYSIDE.ui.grey_background}
          className="w-full h-full absolute inset-0 rounded-md"
        />
      )}
      <SquareIcon icon={icon} width={INNER_CANVAS_WIDTH} />
      <img
        src={SUNNYSIDE.icons.confirm}
        className="absolute -right-1 -bottom-1"
        style={{ width: `${PIXEL_SCALE * 7}px` }}
      />
    </div>
  );
};

const SkillIconFrame: React.FC<{
  skillName: BumpkinRevampSkillName;
  isActive: boolean;
}> = ({ skillName, isActive }) => {
  const { tree, image, boosts, requirements, npc, power } =
    BUMPKIN_REVAMP_SKILL_TREE[skillName] as BumpkinSkillRevamp;
  const { tier } = requirements;
  const { boostedItemIcon, boostTypeIcon } = boosts.buff;
  const skillImage = getSkillImage(image, boostedItemIcon, tree);

  if (!isActive) {
    return <InactiveIconFrame icon={skillImage} />;
  }

  return (
    <SkillBox
      className="mb-1"
      image={skillImage}
      overlayIcon={
        <img
          src={SUNNYSIDE.icons.confirm}
          alt="claimed"
          className="relative object-contain"
          style={{ width: `${PIXEL_SCALE * 12}px` }}
        />
      }
      tier={tier}
      npc={npc}
      secondaryImage={power ? SUNNYSIDE.icons.lightning : boostTypeIcon}
    />
  );
};

const SaltExtraIcon: React.FC<{ item: SaltExtraItem }> = ({ item }) => {
  if (item.skillName) {
    return (
      <SkillIconFrame skillName={item.skillName} isActive={item.isActive} />
    );
  }

  return (
    <ItemIconFrame
      icon={item.icon ?? ITEM_DETAILS["Salt"].image}
      isActive={item.isActive}
      isCollectible={item.isCollectible}
    />
  );
};

const getSkillBuffs = (skillName: BumpkinRevampSkillName): BuffLabel[] => {
  return Object.values(BUMPKIN_REVAMP_SKILL_TREE[skillName].boosts);
};

const SaltExtras: React.FC<{ state: GameState }> = ({ state }) => {
  const { t } = useAppTranslation();
  const saltSculptureLevel = state.sculptures?.["Salt Sculpture"]?.level ?? 0;
  const saltFarmLevel = state.saltFarm.level;
  const { saltYield } = getSaltYieldPerRake(state);

  const items: SaltExtraItem[] = [
    {
      name: t("saltGuide.extra.saltFarm"),
      location: t("saltGuide.extra.location.saltFarm"),
      icon: saltNodeEmpty,
      isActive: saltFarmLevel > 0,
      buff: [
        {
          shortDescription: t("saltGuide.extra.saltFarm.buff"),
          labelType: "success",
          boostTypeIcon: saltNodeEmpty,
          boostedItemIcon: ITEM_DETAILS["Salt"].image,
        },
      ],
    },
    {
      name: "Salty Seas",
      location: t("saltGuide.extra.location.skillTree"),
      skillName: "Salty Seas",
      isActive: !!state.bumpkin?.skills["Salty Seas"],
      buff: getSkillBuffs("Salty Seas"),
    },
    {
      name: t("saltGuide.extra.saltSculptureSpeed"),
      location: t("saltGuide.extra.location.saltSculpture", { level: 1 }),
      icon: SALT_SCULPTURE_VARIANTS[Math.max(1, saltSculptureLevel)],
      isCollectible: true,
      isActive: saltSculptureLevel >= 1,
      buff: [
        {
          shortDescription: t("saltSculpture.buff.1"),
          labelType: "info",
          boostTypeIcon: SUNNYSIDE.icons.stopwatch,
          boostedItemIcon: ITEM_DETAILS["Salt"].image,
        },
      ],
    },
    {
      name: t("saltGuide.extra.saltSculptureCapacity"),
      location: t("saltGuide.extra.location.saltSculpture", { level: 3 }),
      icon: SALT_SCULPTURE_VARIANTS[Math.max(1, saltSculptureLevel)],
      isCollectible: true,
      isActive: saltSculptureLevel >= 3,
      buff: [
        {
          shortDescription: t("saltSculpture.buff.3"),
          labelType: "success",
          boostTypeIcon: SUNNYSIDE.icons.arrow_up,
          boostedItemIcon: ITEM_DETAILS["Salt"].image,
        },
      ],
    },
    {
      name: "Wide Rakes",
      location: t("saltGuide.extra.location.skillTree"),
      skillName: "Wide Rakes",
      isActive: !!state.bumpkin?.skills["Wide Rakes"],
      buff: getSkillBuffs("Wide Rakes"),
    },
    {
      name: "Sea Blessed",
      location: t("saltGuide.extra.location.skillTree"),
      skillName: "Sea Blessed",
      isActive: !!state.bumpkin?.skills["Sea Blessed"],
      buff: getSkillBuffs("Sea Blessed"),
    },
    {
      name: "Salt Surge",
      location: t("saltGuide.extra.location.powerSkill"),
      skillName: "Salt Surge",
      isActive: !!state.bumpkin?.skills["Salt Surge"],
      buff: getSkillBuffs("Salt Surge"),
    },
    {
      name: "Cheap Rakes",
      location: t("saltGuide.extra.location.skillTree"),
      skillName: "Cheap Rakes",
      isActive: !!state.bumpkin?.skills["Cheap Rakes"],
      buff: getSkillBuffs("Cheap Rakes"),
    },
    {
      name: t("saltGuide.extra.saltSculptureRakeCost"),
      location: t("saltGuide.extra.location.saltSculpture", { level: 4 }),
      icon: SALT_SCULPTURE_VARIANTS[Math.max(1, saltSculptureLevel)],
      isCollectible: true,
      isActive: saltSculptureLevel >= 4,
      buff: [
        {
          shortDescription: t("saltSculpture.buff.4"),
          labelType: "success",
          boostTypeIcon: SUNNYSIDE.ui.coins,
          boostedItemIcon: ITEM_DETAILS["Salt Rake"].image,
        },
      ],
    },
  ];

  return (
    <>
      <InnerPanel className="mb-1">
        <div className="flex items-center justify-between space-x-1 mb-1">
          <Label type="default" icon={ITEM_DETAILS["Salt"].image}>
            {t("saltGuide.extra.title")}
          </Label>
          <Label type="success" icon={ITEM_DETAILS["Salt"].image}>
            {t("saltGuide.saltPerRake", { amount: saltYield })}
          </Label>
        </div>
        <span className="flex text-xs ml-1 my-2">
          {t("saltGuide.extra.description")}
        </span>
      </InnerPanel>
      <InnerPanel className="flex flex-col mb-1 overflow-y-scroll overflow-x-hidden scrollable max-h-[330px]">
        {items.map((item) => (
          <div key={item.name} className="flex -ml-1">
            <SaltExtraIcon item={item} />
            <div className="flex flex-col justify-center space-y-1">
              <div className="flex flex-col space-y-0.5">
                <span className="text-xs">{item.name}</span>
                <span className="text-xxs italic">{item.location}</span>
              </div>
              <div className="flex flex-col gap-1 mr-2">
                {item.buff.map((buff, index) => (
                  <Label
                    key={index}
                    type={buff.labelType}
                    icon={buff.boostTypeIcon}
                    secondaryIcon={buff.boostedItemIcon}
                  >
                    {buff.shortDescription}
                  </Label>
                ))}
              </div>
            </div>
          </div>
        ))}
      </InnerPanel>
    </>
  );
};
