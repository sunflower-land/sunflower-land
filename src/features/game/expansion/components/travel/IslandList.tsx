import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "@xstate/react";
import classNames from "classnames";

import * as Auth from "features/auth/lib/Provider";
import { OuterPanel } from "components/ui/Panel";
import { BumpkinLevel, getBumpkinLevel } from "features/game/lib/level";
import { Bumpkin, GameState } from "features/game/types/game";
import { VisitLandExpansionForm } from "../VisitLandExpansionForm";
import { Label } from "components/ui/Label";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { AuthMachineState } from "features/auth/lib/authMachine";

import lockIcon from "assets/skills/lock.png";
import levelUpIcon from "assets/icons/level_up.png";
import goblin from "assets/buildings/goblin_sign.png";

import land from "assets/land/islands/island.webp";
import blueBottle from "assets/decorations/blue_bottle.webp";

import { SUNNYSIDE } from "assets/sunnyside";
import { onboardingAnalytics } from "lib/onboardingAnalytics";
import { ITEM_DETAILS } from "features/game/types/images";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { GoblinState } from "features/game/lib/goblinMachine";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Island {
  name: string;
  levelRequired: BumpkinLevel;
  path: string;
  image?: string;
  comingSoon?: boolean;
  beta?: boolean;
  passRequired?: boolean;
  labels: ReturnType<typeof Label>[];
}

interface IslandProps extends Island {
  bumpkin: Bumpkin | undefined;
  currentPath: string;
  disabled: boolean;
  onClose: () => void;
}

interface IslandListProps {
  bumpkin: Bumpkin | undefined;
  showVisitList: boolean;
  gameState: GameState | GoblinState;
  travelAllowed: boolean;
  hasBetaAccess?: boolean;
  onClose: () => void;
}

const IslandListItem: React.FC<IslandProps> = ({
  name,
  levelRequired,
  path,
  bumpkin,
  image,
  comingSoon,
  currentPath,
  disabled,
  passRequired,
  beta,
  onClose,
  labels,
}) => {
  const { t } = useAppTranslation();
  const { openModal } = useContext(ModalContext);
  const navigate = useNavigate();
  const onSameIsland = path === currentPath;
  const notEnoughLevel =
    (!bumpkin || getBumpkinLevel(bumpkin.experience) < levelRequired) &&
    levelRequired > 1;
  const cannotNavigate =
    notEnoughLevel || onSameIsland || comingSoon || disabled;

  const onClick = () => {
    if (passRequired) {
      openModal("GOLD_PASS");
      onClose();
      return;
    }

    if (cannotNavigate) return;

    navigate(path);
    onboardingAnalytics.logEvent("select_content", {
      content_type: "island",
      content_id: name,
    });
    onClose();
  };

  return (
    <OuterPanel
      onClick={onClick}
      className={classNames(
        "flex relative items-center !py-2 mb-1",
        cannotNavigate ? "opacity-70" : "cursor-pointer hover:bg-brown-200"
      )}
    >
      {image && (
        <div className="w-16 min-h-[36px] h-auto justify-center flex mr-2">
          <img src={image} className="scale-[1.8] object-contain" />
        </div>
      )}
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex gap-2 items-center mb-1">
          {(notEnoughLevel || comingSoon) && (
            <img src={lockIcon} className="h-4" />
          )}
          <span className="text-sm">{name}</span>
        </div>

        <div className="flex items-center gap-x-3 gap-y-1 flex-wrap">
          {/* Current island */}
          {onSameIsland && <Label type="info">{t("you.are.here")}</Label>}
          {/* Level requirement */}
          {notEnoughLevel && (
            <Label type="danger" icon={levelUpIcon}>
              {t("lvl")} {levelRequired}
            </Label>
          )}
          {/* Coming soon */}
          {comingSoon && <Label type="warning">{t("coming.soon")}</Label>}
          {beta && <Label type="info">{t("beta")}</Label>}
          {passRequired && (
            <Label type="danger" icon={ITEM_DETAILS["Gold Pass"].image}>
              {t("pass.required")}
            </Label>
          )}
          {labels}
        </div>
      </div>
    </OuterPanel>
  );
};

const VisitFriendListItem: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => {
  const { t } = useAppTranslation();
  return (
    <div onClick={onClick}>
      <OuterPanel className="flex relative items-center !py-2 mb-1 cursor-pointer hover:bg-brown-200">
        <div className="w-16 justify-center flex mr-2">
          <img src={land} className="h-9" />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <span className="text-sm">{t("visit.friend")}</span>
        </div>
      </OuterPanel>
    </div>
  );
};

const stateSelector = (state: AuthMachineState) => ({
  isAuthorised: state.matches("connected"),
  isVisiting: state.matches("visiting"),
});

export const IslandList: React.FC<IslandListProps> = ({
  bumpkin,
  showVisitList,
  travelAllowed,
  gameState,
  onClose,
}) => {
  const { authService } = useContext(Auth.Context);
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const state = useSelector(authService, stateSelector);
  const farmId = gameService.state.context.farmId;

  const location = useLocation();
  const [view, setView] = useState<"list" | "visitForm">("list");

  useEffect(() => {
    gameService.send("SAVE");
  }, []);

  const islands: Island[] = [
    {
      name: "Home",
      image: CROP_LIFECYCLE.Sunflower.ready,
      levelRequired: 1,
      path: `/`,
      labels: [],
    },
    {
      name: "Pumpkin Plaza",
      levelRequired: 3 as BumpkinLevel,
      image: CROP_LIFECYCLE.Pumpkin.crop,
      path: `/world/plaza`,
      labels: [
        <Label type="default" key="trading" icon={SUNNYSIDE.icons.player_small}>
          {t("trading")}
        </Label>,
        <Label type="default" key="deliveries" icon={SUNNYSIDE.icons.heart}>
          {t("deliveries")}
        </Label>,

        <Label type="default" key="shopping" icon={SUNNYSIDE.icons.basket}>
          {t("shopping")}
        </Label>,
        <Label type="vibrant" key="auctions" icon={SUNNYSIDE.icons.timer}>
          {t("auctions")}
        </Label>,
      ],
    },
    {
      name: "Beach",
      levelRequired: 3 as BumpkinLevel,
      image: SUNNYSIDE.resource.crab,
      path: `/world/beach`,
      labels: [
        <Label
          type="default"
          key="treasure_island"
          icon={SUNNYSIDE.icons.heart}
        >
          {t("deliveries")}
        </Label>,
      ],
    },
    {
      name: "Woodlands",
      levelRequired: 3 as BumpkinLevel,
      image: SUNNYSIDE.resource.wild_mushroom,
      path: `/world/woodlands`,
      labels: [
        <Label type="vibrant" key="potion_house" icon={blueBottle}>
          {"Potion House"}
        </Label>,
      ],
    },

    {
      name: "Goblin Retreat",
      levelRequired: 5 as BumpkinLevel,
      image: goblin,
      path: `/retreat/${farmId}`,
      passRequired: true,
      labels: [
        <Label type="default" key="trading" icon={SUNNYSIDE.icons.player_small}>
          {t("trading")}
        </Label>,
        <Label
          type="default"
          key="withdraw"
          icon={SUNNYSIDE.decorations.treasure_chest_opened}
        >
          {t("withdraw")}
        </Label>,
        <Label type="default" key="crafting" icon={SUNNYSIDE.icons.hammer}>
          {t("crafting")}
        </Label>,
      ],
    },
    {
      name: "Helios",
      levelRequired: 10 as BumpkinLevel,
      image: SUNNYSIDE.icons.helios,
      path: `/helios`,
      labels: [
        <Label type="default" key="shopping" icon={SUNNYSIDE.icons.basket}>
          {t("shopping")}
        </Label>,
        <Label type="default" key="trash" icon={SUNNYSIDE.icons.cancel}>
          {t("trash.collection")}
        </Label>,
      ],
    },
  ];

  // NOTE: If you're visiting without a session then just show the form by default as there is no option to return to a farm
  if (view === "visitForm") {
    return (
      <VisitLandExpansionForm
        onBack={
          state.isVisiting
            ? () => authService.send("RETURN")
            : () => setView("list")
        }
      />
    );
  }

  if (showVisitList) {
    return (
      <>
        {state.isAuthorised && (
          <IslandListItem
            name="Home"
            image={CROP_LIFECYCLE.Sunflower.ready}
            levelRequired={1}
            path={`/land/${farmId}`}
            bumpkin={bumpkin}
            currentPath={location.pathname}
            disabled={!travelAllowed}
            onClose={onClose}
            labels={[]}
          />
        )}
        <VisitFriendListItem onClick={() => setView("visitForm")} />
      </>
    );
  }

  const level = bumpkin ? getBumpkinLevel(bumpkin.experience) : 1;

  const hideVisitOption =
    level <= 3 ||
    location.pathname.includes("retreat") ||
    location.pathname.includes("community-garden");
  return (
    <>
      {islands.map((item) => (
        <IslandListItem
          key={item.name}
          {...item}
          onClose={onClose}
          bumpkin={bumpkin}
          currentPath={location.pathname}
          disabled={!travelAllowed}
          passRequired={item.passRequired && !gameState.inventory["Gold Pass"]}
        />
      ))}
      {!hideVisitOption && (
        <VisitFriendListItem onClick={() => setView("visitForm")} />
      )}
    </>
  );
};
