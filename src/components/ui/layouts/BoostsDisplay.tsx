import { SUNNYSIDE } from "assets/sunnyside";
import { KNOWN_IDS } from "features/game/types";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import {
  BumpkinRevampSkillName,
  BUMPKIN_REVAMP_SKILL_TREE,
  BumpkinSkillRevamp,
} from "features/game/types/bumpkinSkills";
import { BoostName, InventoryItemName } from "features/game/types/game";
import { GameState } from "features/game/types/game";
import { getTradeableDisplay } from "features/marketplace/lib/tradeables";
import { AnimatedPanel } from "features/world/ui/AnimatedPanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Label } from "../Label";
import {
  CALENDAR_EVENT_ICONS,
  SeasonalEventName,
} from "features/game/types/calendar";
import { budImageDomain } from "features/island/collectibles/components/Bud";
import { getSkillImage } from "features/bumpkins/components/revamp/SkillPathDetails";
import { startCase } from "lodash";
import { BudNFTName } from "features/game/types/marketplace";
import { TranslationKeys } from "lib/i18n/dictionaries/types";
import classNames from "classnames";

const BOOSTS_PANEL_ESTIMATED_HEIGHT = 220;

export const BoostsDisplay: React.FC<{
  boosts: { name: BoostName; value: string }[];
  show: boolean;
  state: GameState;
  onClick: () => void;
  className?: string;
  /** When provided, renders in a portal to avoid clipping by scroll containers. Positions above trigger when it would clip below. */
  anchorRef?: React.RefObject<HTMLElement | null>;
}> = ({ boosts, show, state, onClick, className, anchorRef }) => {
  const { t } = useAppTranslation();
  const [portalStyle, setPortalStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!show || !anchorRef?.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const positionAbove = spaceBelow < BOOSTS_PANEL_ESTIMATED_HEIGHT;

    if (positionAbove) {
      setPortalStyle({
        position: "fixed",
        bottom: window.innerHeight - rect.top,
        right: window.innerWidth - rect.right,
        left: "auto",
        top: "auto",
        zIndex: 50,
      });
    } else {
      setPortalStyle({
        position: "fixed",
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
        left: "auto",
        bottom: "auto",
        zIndex: 50,
      });
    }
  }, [show, anchorRef]);
  const isBumpkinSkill = (
    boost: BoostName,
  ): boost is BumpkinRevampSkillName => {
    return boost in BUMPKIN_REVAMP_SKILL_TREE;
  };

  const isCollectible = (boost: BoostName): boost is InventoryItemName => {
    return boost in KNOWN_IDS;
  };
  const isWearable = (boost: BoostName): boost is BumpkinItem => {
    return boost in ITEM_IDS;
  };
  const isBud = (boost: BoostName): boost is BudNFTName => {
    return boost.startsWith("Bud #");
  };
  const isCalendarEvent = (boost: BoostName): boost is SeasonalEventName => {
    return boost in CALENDAR_EVENT_ICONS;
  };

  const getBoostLabel = (name: BoostName): string => {
    if (isCalendarEvent(name)) {
      const key: TranslationKeys = `calendar.events.${name}.title`;
      const translated = t(key);
      return translated !== key ? translated : startCase(name);
    }
    // startCase strips/alters punctuation (e.g. "Luna's Hat" → "Lunas Hat", "Dr." → "Dr"), so preserve names that have it
    if (/[^a-zA-Z0-9 ]/.test(name)) {
      return name;
    }
    return startCase(name);
  };

  const getBoostIcon = (boost: BoostName) => {
    if (boost === "Building Oil") {
      return SUNNYSIDE.icons.stopwatch;
    }

    if (isCalendarEvent(boost)) {
      return CALENDAR_EVENT_ICONS[boost];
    }

    if (isBumpkinSkill(boost)) {
      const {
        image,
        tree,
        boosts: {
          buff: { boostedItemIcon },
        },
      } = BUMPKIN_REVAMP_SKILL_TREE[boost] as BumpkinSkillRevamp;

      return getSkillImage(image, boostedItemIcon, tree);
    }

    if (isCollectible(boost)) {
      return getTradeableDisplay({
        id: KNOWN_IDS[boost],
        type: "collectibles",
        state,
      }).image;
    }

    if (isWearable(boost)) {
      return getTradeableDisplay({
        id: ITEM_IDS[boost],
        type: "wearables",
        state,
      }).image;
    }

    if (isBud(boost)) {
      const budId = Number(boost.split("#")[1]);
      return `https://${budImageDomain}.sunflower-land.com/images/${budId}.webp`;
    }

    return SUNNYSIDE.icons.lightning;
  };

  const panelContent = (
    <AnimatedPanel
      show={show}
      onClick={onClick}
      onBackdropClick={onClick}
      className={classNames("flex flex-col gap-1 max-h-5", className)}
      style={anchorRef ? portalStyle : undefined}
    >
      <div className="overflow-y-auto scrollable min-w-36 max-h-52 py-1 px-0.5">
        <div className="flex space-x-1 mb-1">
          <img src={SUNNYSIDE.icons.lightning} alt="Boost" className="w-3" />
          <span className="text-xs whitespace-nowrap">
            {t("faction.boostsApplied")}
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {boosts.map((buff, index) => (
            <Label
              key={`${buff.name}-${buff.value}-${index}`}
              type="transparent"
              icon={getBoostIcon(buff.name)}
              className="ml-3"
            >
              {`${buff.value} ${getBoostLabel(buff.name)}`}
            </Label>
          ))}
        </div>
      </div>
    </AnimatedPanel>
  );

  if (anchorRef && show) {
    return createPortal(panelContent, document.body);
  }

  return panelContent;
};
