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
import { getSkillImage } from "features/bumpkins/components/revamp/SkillPathDetails";
import { startCase } from "lodash";
import { BudNFTName } from "features/game/types/marketplace";
import { TranslationKeys } from "lib/i18n/dictionaries/types";
import classNames from "classnames";
import { getBudImage } from "lib/buds/types";

const BOOSTS_PANEL_ESTIMATED_HEIGHT = 220;

const isBumpkinSkill = (boost: BoostName): boost is BumpkinRevampSkillName =>
  boost in BUMPKIN_REVAMP_SKILL_TREE;

const isCollectible = (boost: BoostName): boost is InventoryItemName =>
  boost in KNOWN_IDS;

const isWearable = (boost: BoostName): boost is BumpkinItem =>
  boost in ITEM_IDS;

const isBud = (boost: BoostName): boost is BudNFTName =>
  boost.startsWith("Bud #");

const isCalendarEvent = (boost: BoostName): boost is SeasonalEventName =>
  boost in CALENDAR_EVENT_ICONS;

export const getBoostLabel = (
  name: BoostName,
  t: (key: TranslationKeys) => string,
): string => {
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

export const getBoostIcon = (boost: BoostName, state: GameState): string => {
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

  // Wearable check runs before collectible because some boost sources
  // (e.g. "Green Amulet") are listed in both KNOWN_IDS and ITEM_IDS — the
  // boost is granted by the worn item, so the wearable image is correct.
  if (isWearable(boost)) {
    return getTradeableDisplay({
      id: ITEM_IDS[boost],
      type: "wearables",
      state,
    }).image;
  }

  if (isCollectible(boost)) {
    return getTradeableDisplay({
      id: KNOWN_IDS[boost],
      type: "collectibles",
      state,
    }).image;
  }

  if (isBud(boost)) {
    const budId = Number(boost.split("#")[1]);
    return getBudImage(budId);
  }

  return SUNNYSIDE.icons.lightning;
};

export const BoostsDisplay: React.FC<{
  boosts: { name: BoostName; value: string }[];
  show: boolean;
  state: GameState;
  onClick: () => void;
  className?: string;
  portalAlign?: "left" | "center" | "right";
  /** When provided, renders in a portal to avoid clipping by scroll containers. Positions above trigger when it would clip below. */
  anchorRef?: React.RefObject<HTMLElement | null>;
}> = ({
  boosts,
  show,
  state,
  onClick,
  className,
  portalAlign = "right",
  anchorRef,
}) => {
  const { t } = useAppTranslation();
  const [portalStyle, setPortalStyle] = useState<React.CSSProperties>({});
  const [anchorVisible, setAnchorVisible] = useState(true);

  useEffect(() => {
    if (!show || !anchorRef?.current) return;

    const anchor = anchorRef.current;

    const scrollableAncestors: HTMLElement[] = [];
    let parent: HTMLElement | null = anchor.parentElement;
    while (parent) {
      const { overflowY, overflowX, overflow } =
        window.getComputedStyle(parent);
      if (/(auto|scroll|overlay)/.test(overflowY + overflowX + overflow)) {
        scrollableAncestors.push(parent);
      }
      parent = parent.parentElement;
    }

    const isAnchorInView = (rect: DOMRect) => {
      for (const ancestor of scrollableAncestors) {
        const aRect = ancestor.getBoundingClientRect();
        if (
          rect.bottom <= aRect.top ||
          rect.top >= aRect.bottom ||
          rect.right <= aRect.left ||
          rect.left >= aRect.right
        ) {
          return false;
        }
      }
      return true;
    };

    const computeAndSetPortalStyle = () => {
      const rect = anchor.getBoundingClientRect();
      const visible = isAnchorInView(rect);
      setAnchorVisible(visible);
      if (!visible) return;
      const spaceBelow = window.innerHeight - rect.bottom;
      const positionAbove = spaceBelow < BOOSTS_PANEL_ESTIMATED_HEIGHT;

      const horizontalStyle =
        portalAlign === "center"
          ? {
              left: rect.left + rect.width / 2,
              right: "auto",
            }
          : portalAlign === "left"
            ? {
                left: rect.left,
                right: "auto",
              }
            : {
                right: window.innerWidth - rect.right,
                left: "auto",
              };

      if (positionAbove) {
        setPortalStyle({
          position: "fixed",
          bottom: window.innerHeight - rect.top,
          top: "auto",
          zIndex: 50,
          ...horizontalStyle,
        });
      } else {
        setPortalStyle({
          position: "fixed",
          top: rect.bottom + 4,
          bottom: "auto",
          zIndex: 50,
          ...horizontalStyle,
        });
      }
    };

    computeAndSetPortalStyle();

    let rafId: number | null = null;
    const scheduleUpdate = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        computeAndSetPortalStyle();
      });
    };

    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("scroll", scheduleUpdate, true);
    scrollableAncestors.forEach((el) =>
      el.addEventListener("scroll", scheduleUpdate),
    );

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("scroll", scheduleUpdate, true);
      scrollableAncestors.forEach((el) =>
        el.removeEventListener("scroll", scheduleUpdate),
      );
    };
  }, [show, anchorRef, portalAlign]);

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
              icon={getBoostIcon(buff.name, state)}
              className="ml-3"
            >
              {`${buff.value} ${getBoostLabel(buff.name, t)}`}
            </Label>
          ))}
        </div>
      </div>
    </AnimatedPanel>
  );

  if (anchorRef && show) {
    if (!anchorVisible) return null;
    return createPortal(panelContent, document.body);
  }

  return panelContent;
};
