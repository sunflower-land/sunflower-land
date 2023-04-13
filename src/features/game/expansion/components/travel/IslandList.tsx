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
import sunflorea from "assets/land/islands/sunflorea.png";
import snowman from "assets/npcs/snowman.png";
import land from "assets/land/islands/island.webp";
import bunnyfower from "assets/events/easter/2023/decorations/bunnyflower.png";
import { SUNNYSIDE } from "assets/sunnyside";

interface Island {
  name: string;
  levelRequired: BumpkinLevel;
  guestAccess: boolean;
  path: string;
  image?: string;
  comingSoon?: boolean;
}

interface IslandProps extends Island {
  bumpkin: Bumpkin | undefined;
  currentPath: string;
  isGuest: boolean;
  disabled: boolean;
}

interface IslandListProps {
  bumpkin: Bumpkin | undefined;
  showVisitList: boolean;
  inventory: Inventory;
  travelAllowed: boolean;
}

const IslandListItem: React.FC<IslandProps> = ({
  name,
  levelRequired,
  path,
  bumpkin,
  guestAccess,
  image,
  comingSoon,
  currentPath,
  isGuest,
  disabled,
}) => {
  const navigate = useNavigate();
  const onSameIsland = path === currentPath;
  const notEnoughLevel =
    !bumpkin || getBumpkinLevel(bumpkin.experience) < levelRequired;
  const guestDenied = guestAccess === false && isGuest;
  const cannotNavigate =
    notEnoughLevel || onSameIsland || comingSoon || guestDenied || disabled;

  const onClick = () => {
    if (!cannotNavigate) {
      navigate(path);
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
            <Label type="danger" className="flex gap-2 items-center">
              <img src={levelUpIcon} className="h-4" />
              Lvl {levelRequired}
            </Label>
          )}
          {guestDenied && !comingSoon && (
            <Label type="info">Full access required</Label>
          )}
          {/* Coming soon */}
          {comingSoon && <Label type="warning">Coming soon</Label>}
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
  inventory,
  travelAllowed,
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
      guestAccess: true,
      path: `/land/${farmId}`,
    },
    {
      name: "Helios",
      levelRequired: 1 as BumpkinLevel,
      guestAccess: true,
      image: SUNNYSIDE.icons.helios,
      path: `/land/${farmId}/helios`,
    },
    {
      name: "Bunny Trove",
      levelRequired: 1 as BumpkinLevel,
      guestAccess: false,
      image: bunnyfower,
      path: `/land/${farmId}/bunny-trove`,
    },
    {
      name: "Goblin Retreat",
      levelRequired: 5 as BumpkinLevel,
      guestAccess: false,
      image: goblin,
      path: `/retreat/${farmId}`,
    },
    {
      name: "Treasure Island",
      levelRequired: 10 as BumpkinLevel,
      guestAccess: false,
      image: SUNNYSIDE.icons.treasure,
      path: `/land/${farmId}/treasure-island`,
    },
    {
      name: "Stone Haven",
      levelRequired: 20 as BumpkinLevel,
      guestAccess: false,
      image: SUNNYSIDE.resource.boulder,
      path: `/treasure/${farmId}`,
      comingSoon: true,
    },
    {
      name: "Sunflorea",
      levelRequired: 30 as BumpkinLevel,
      guestAccess: false,
      image: sunflorea,
      path: `/treasure/${farmId}`,
      comingSoon: true,
    },
    {
      name: "Snow Kingdom",
      levelRequired: 50 as BumpkinLevel,
      guestAccess: false,
      image: snowman,
      path: `/snow/${farmId}`,
      comingSoon: true,
    },
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
            guestAccess={true}
            isGuest={userType === "GUEST"}
            path={`/land/${farmId}`}
            bumpkin={bumpkin}
            currentPath={location.pathname}
            disabled={!travelAllowed}
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
          isGuest={userType === "GUEST"}
          bumpkin={bumpkin}
          currentPath={location.pathname}
          disabled={!travelAllowed}
        />
      ))}
      {!hideVisitOption && (
        <VisitFriendListItem onClick={() => setView("visitForm")} />
      )}
    </>
  );
};
