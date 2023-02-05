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
import { VisitLandExpansionForm } from "../VisitLandExpansionForm";
import { useActor } from "@xstate/react";
import { Label } from "components/ui/Label";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { SUNNYSIDE } from "assets/sunnyside";
import { hasFeatureAccess } from "lib/flags";

interface Island {
  name: string;
  levelRequired: BumpkinLevel;
  path: string;
  image?: string;
  comingSoon?: boolean;
}

interface IslandProps extends Island {
  bumpkin: Bumpkin | undefined;
  currentPath: string;
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
  image,
  comingSoon,
  currentPath,
}) => {
  const navigate = useNavigate();
  const onSameIsland = path === currentPath;
  const notEnoughLevel =
    !bumpkin || getBumpkinLevel(bumpkin.experience) < levelRequired;
  const cannotNavigate =
    (bumpkin && notEnoughLevel) || onSameIsland || comingSoon;

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
                <Label type="danger" className="flex gap-2 items-center">
                  <img src={levelUpIcon} className="h-4" />
                  Lvl {levelRequired}
                </Label>
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

  const islands: Island[] = [
    {
      name: "Home",
      image: CROP_LIFECYCLE.Sunflower.ready,
      levelRequired: 1,
      path: `/land/${id}`,
    },
    ...(hasFeatureAccess(inventory, "PUMPKIN_PLAZA")
      ? [
          {
            name: "Pumpkin Plaza",
            levelRequired: 1,
            image: CROP_LIFECYCLE.Pumpkin.crop,
            path: `/land/${id}/plaza`,
          } as Island,
        ]
      : []),
    {
      name: "Helios",
      levelRequired: 1,
      image: SUNNYSIDE.icons.helios,
      path: `/land/${id}/helios`,
    },
    {
      name: "Goblin Retreat",
      levelRequired: 5,
      image: goblin,
      path: `/retreat/${id}`,
    },
    {
      name: "Treasure Island",
      levelRequired: 10,
      image: SUNNYSIDE.icons.treasure,
      path: `/land/${id}/treasure-island`,
      comingSoon: !hasFeatureAccess(inventory, "TREASURE_ISLAND"),
    },
    {
      name: "Stone Haven",
      levelRequired: 20,
      image: SUNNYSIDE.resource.boulder,
      path: `/treasure/${id}`,
      comingSoon: true,
    },
    {
      name: "Sunflorea",
      levelRequired: 30,
      image: sunflorea,
      path: `/treasure/${id}`,
      comingSoon: true,
    },
    {
      name: "Snow Kingdom",
      // Originally it was 50, but BumpkinLevel type has restrictions(current max is 40)
      levelRequired: 40,
      image: snowman,
      path: `/snow/${id}`,
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
            path={`/land/${authState.context.farmId}`}
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
