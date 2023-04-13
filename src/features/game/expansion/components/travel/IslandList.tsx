import React, { useContext, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as Auth from "features/auth/lib/Provider";
import { OuterPanel } from "components/ui/Panel";
import { BumpkinLevel, getBumpkinLevel } from "features/game/lib/level";
import { Bumpkin, Inventory } from "features/game/types/game";

import lockIcon from "assets/skills/lock.png";
import levelUpIcon from "assets/icons/level_up.png";

import goblin from "assets/buildings/goblin_sign.png";
import sunflorea from "assets/land/islands/sunflorea.png";
import snowman from "assets/npcs/snowman.png";
import land from "assets/land/islands/island.webp";
import bunnyfower from "assets/events/easter/2023/decorations/bunnyflower.png";
import { VisitLandExpansionForm } from "../VisitLandExpansionForm";
import { useActor } from "@xstate/react";
import { Label } from "components/ui/Label";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
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
}

interface IslandListProps {
  bumpkin: Bumpkin | undefined;
  showVisitList: boolean;
  inventory: Inventory;
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
}) => {
  const navigate = useNavigate();
  const onSameIsland = path === currentPath;
  const notEnoughLevel =
    !bumpkin || getBumpkinLevel(bumpkin.experience) < levelRequired;
  const guestDenied = guestAccess === false && isGuest;
  const cannotNavigate =
    (bumpkin && notEnoughLevel) || onSameIsland || comingSoon || guestDenied;

  if (cannotNavigate) {
    // Disabled item
    return (
      <div>
        <OuterPanel className="flex relative items-center py-2 mb-1 opacity-70">
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
                <Label
                  type="danger"
                  className="flex gap-2 items-center whitespace-nowrap"
                >
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
      </div>
    );
  }

  return (
    <div onClick={() => navigate(path)}>
      <OuterPanel className="flex relative items-center py-2 mb-1 cursor-pointer hover:bg-brown-200">
        {image && (
          <div className="w-16 justify-center flex mr-2">
            <img src={image} className="h-9" />
          </div>
        )}
        <div className="flex-1 flex flex-col justify-center">
          <span className="text-sm">{name}</span>
        </div>
      </OuterPanel>
    </div>
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

export const IslandList: React.FC<IslandListProps> = ({
  bumpkin,
  showVisitList,
  inventory,
}) => {
  const { authService } = useContext(Auth.Context);
  const [authState, send] = useActor(authService);

  const { id } = useParams();
  const location = useLocation();
  const [view, setView] = useState<"list" | "visitForm">("list");

  const farmId = id ?? "guest";

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
      path: `/land/${id}/bunny-trove`,
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
      // Originally it was 50, but BumpkinLevel type has restrictions(current max is 40)
      levelRequired: 40,
      guestAccess: false,
      image: snowman,
      path: `/snow/${farmId}`,
      comingSoon: true,
    },
  ];

  // NOTE: If you're visiting without a session then just show the form by default as there is no option to return to a farm
  const unAuthenticatedVisit = authState.matches("visiting");
  if (view === "visitForm" || unAuthenticatedVisit) {
    return (
      <VisitLandExpansionForm
        onBack={
          unAuthenticatedVisit ? () => send("RETURN") : () => setView("list")
        }
      />
    );
  }

  if (showVisitList) {
    return (
      <>
        {authState.matches({ connected: "authorised" }) && (
          <IslandListItem
            name="Home"
            image={CROP_LIFECYCLE.Sunflower.ready}
            levelRequired={1}
            guestAccess={true}
            isGuest={authState.context.user.type === "GUEST"}
            path={`/land/${authState.context.user.farmId}`}
            bumpkin={bumpkin}
            currentPath={location.pathname}
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
          isGuest={authState.context.user.type === "GUEST"}
          bumpkin={bumpkin}
          currentPath={location.pathname}
        />
      ))}
      {!hideVisitOption && (
        <VisitFriendListItem onClick={() => setView("visitForm")} />
      )}
    </>
  );
};
