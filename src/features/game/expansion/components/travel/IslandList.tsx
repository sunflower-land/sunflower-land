import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "@xstate/react";
import classNames from "classnames";

import * as Auth from "features/auth/lib/Provider";
import { OuterPanel } from "components/ui/Panel";
import { BumpkinLevel, getBumpkinLevel } from "features/game/lib/level";
import { Bumpkin, Inventory } from "features/game/types/game";
import { VisitLandExpansionForm } from "../VisitLandExpansionForm";
import { Label } from "components/ui/Label";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { AuthMachineState } from "features/auth/lib/authMachine";

import lockIcon from "assets/skills/lock.png";
import levelUpIcon from "assets/icons/level_up.png";
import goblin from "assets/buildings/goblin_sign.png";
//import sunflorea from "assets/land/islands/sunflorea.png";
//import snowman from "assets/npcs/snowman.png";
import dawnBreakerBanner from "assets/decorations/banners/dawn_breaker_banner.png";
import land from "assets/land/islands/island.webp";
import { SUNNYSIDE } from "assets/sunnyside";
import { analytics } from "lib/analytics";
import { ITEM_DETAILS } from "features/game/types/images";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { hasFeatureAccess } from "lib/flags";
import { SEASONS } from "features/game/types/seasons";

interface Island {
  name: string;
  levelRequired: BumpkinLevel;
  path: string;
  image?: string;
  comingSoon?: boolean;
  beta?: boolean;
  passRequired?: boolean;
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
  inventory: Inventory;
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
}) => {
  const { openModal } = useContext(ModalContext);
  const navigate = useNavigate();
  const onSameIsland = path === currentPath;
  const notEnoughLevel =
    !bumpkin || getBumpkinLevel(bumpkin.experience) < levelRequired;
  const cannotNavigate =
    notEnoughLevel || onSameIsland || comingSoon || disabled;

  const onClick = () => {
    if (passRequired) {
      openModal("GOLD_PASS");
      onClose();
      return;
    }
    if (!cannotNavigate) {
      navigate(path);
      analytics.logEvent("select_content", {
        content_type: "island",
        content_id: name,
      });
    }
  };

  return (
    <OuterPanel
      onClick={onClick}
      className={classNames(
        "flex relative items-center py-2 mb-1",
        cannotNavigate ? "opacity-70" : "cursor-pointer hover:bg-brown-200"
      )}
    >
      {image && (
        <div className="w-16 justify-center flex mr-2">
          <img src={image} className="h-9" />
        </div>
      )}
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex gap-2 items-center mb-1">
          {(notEnoughLevel || comingSoon) && (
            <img src={lockIcon} className="h-4" />
          )}
          <span className="text-sm">{name}</span>
        </div>

        <div className="flex gap-2 items-center">
          {/* Current island */}
          {onSameIsland && <Label type="info">You are here</Label>}
          {/* Level requirement */}
          {notEnoughLevel && (
            <Label type="danger" icon={levelUpIcon}>
              Lvl {levelRequired}
            </Label>
          )}
          {/* Coming soon */}
          {comingSoon && <Label type="warning">Coming soon</Label>}
          {beta && <Label type="info">Beta</Label>}
          {passRequired && (
            <Label type="danger" icon={ITEM_DETAILS["Gold Pass"].image}>
              Pass Required
            </Label>
          )}
        </div>
      </div>
    </OuterPanel>
  );
};

const VisitFriendListItem: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => {
  return (
    <div onClick={onClick}>
      <OuterPanel className="flex relative items-center py-2 mb-1 cursor-pointer hover:bg-brown-200">
        <div className="w-16 justify-center flex mr-2">
          <img src={land} className="h-9" />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <span className="text-sm">Visit Friend</span>
        </div>
      </OuterPanel>
    </div>
  );
};

const userTypeSelector = (state: AuthMachineState) => state.context.user.type;
const farmIdSelector = (state: AuthMachineState) =>
  state.context.user.farmId ?? "guest";
const stateSelector = (state: AuthMachineState) => ({
  isAuthorised: state.matches({ connected: "authorised" }),
  isVisiting: state.matches("visiting"),
});

export const IslandList: React.FC<IslandListProps> = ({
  bumpkin,
  showVisitList,
  travelAllowed,
  inventory,
  hasBetaAccess = false,
  onClose,
}) => {
  const { authService } = useContext(Auth.Context);
  const userType = useSelector(authService, userTypeSelector);
  const farmId = useSelector(authService, farmIdSelector);
  const state = useSelector(authService, stateSelector);

  const location = useLocation();
  const [view, setView] = useState<"list" | "visitForm">("list");

  const islands: Island[] = [
    {
      name: "Home",
      image: CROP_LIFECYCLE.Sunflower.ready,
      levelRequired: 1,
      path: `/land/${farmId}`,
    },
    ...(hasFeatureAccess(inventory, "PUMPKIN_PLAZA") ||
    Date.now() > SEASONS["Witches' Eve"].startDate.getTime()
      ? [
          {
            name: "Pumpkin Plaza",
            levelRequired: 1 as BumpkinLevel,
            image: CROP_LIFECYCLE.Pumpkin.ready,
            path: `/world/plaza`,
            beta: true,
          },
        ]
      : []),
    {
      name: "Helios",
      levelRequired: 1 as BumpkinLevel,
      image: SUNNYSIDE.icons.helios,
      path: `/land/${farmId}/helios`,
    },
    ...(Date.now() < SEASONS["Witches' Eve"].startDate.getTime()
      ? [
          {
            name: "Dawn Breaker",
            image: dawnBreakerBanner,
            levelRequired: 2 as BumpkinLevel,
            path: `/world/dawn_breaker`,
            beta: true,
          },
        ]
      : []),

    {
      name: "Goblin Retreat",
      levelRequired: 1 as BumpkinLevel,
      image: goblin,
      path: `/retreat/${farmId}`,
      passRequired: true,
    },
    {
      name: "Treasure Island",
      levelRequired: 10 as BumpkinLevel,
      image: SUNNYSIDE.icons.treasure,
      path: `/land/${farmId}/treasure-island`,
    },
    //{
    //  name: "Stone Haven",
    //  levelRequired: 20 as BumpkinLevel,
    //  image: SUNNYSIDE.resource.boulder,
    //  path: `/treasure/${farmId}`,
    //  comingSoon: true,
    //},
    //{
    //  name: "Sunflorea",
    //  levelRequired: 30 as BumpkinLevel,
    //  image: sunflorea,
    //  path: `/treasure/${farmId}`,
    //  comingSoon: true,
    //},
    //{
    //  name: "Snow Kingdom",
    //  levelRequired: 50 as BumpkinLevel,
    //  image: snowman,
    //  path: `/snow/${farmId}`,
    //  comingSoon: true,
    //},
  ];

  // NOTE: If you're visiting without a session then just show the form by default as there is no option to return to a farm
  if (view === "visitForm" || state.isVisiting) {
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
          />
        )}
        <VisitFriendListItem onClick={() => setView("visitForm")} />
      </>
    );
  }

  const hideVisitOption =
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
          passRequired={item.passRequired && !inventory["Gold Pass"]}
        />
      ))}
      {!hideVisitOption && (
        <VisitFriendListItem onClick={() => setView("visitForm")} />
      )}
    </>
  );
};
