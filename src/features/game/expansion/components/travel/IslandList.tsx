import React, { useContext, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as Auth from "features/auth/lib/Provider";
import { OuterPanel } from "components/ui/Panel";
import { getBumpkinLevel } from "features/game/lib/level";
import { Bumpkin } from "features/game/types/game";

import lock from "assets/skills/lock.png";
import heart from "assets/icons/level_up.png";

import goblin from "assets/buildings/goblin_sign.png";
import farm from "assets/crops/sunflower/planted.png";
import helios from "assets/land/islands/helios_icon.png";
import treasureIsland from "assets/land/islands/treasure_icon.png";
import stoneHaven from "assets/land/islands/stone_haven.png";
import sunflorea from "assets/land/islands/sunflorea.png";
import snowman from "assets/npcs/snowman.png";
import land from "assets/land/islands/island.webp";
import { VisitLandExpansionForm } from "../VisitLandExpansionForm";
import { useActor } from "@xstate/react";
import { Label } from "components/ui/Label";
import { CONFIG } from "lib/config";

const CONTENT_HEIGHT = 380;

interface Island {
  name: string;
  levelRequired: number;
  path: string;
  image?: string;
  comingSoon?: boolean;
}

interface Props extends Island {
  bumpkin: Bumpkin | undefined;
  currentPath: string;
}

const Island = ({
  name,
  levelRequired,
  path,
  bumpkin,
  image,
  comingSoon,
  currentPath,
}: Props) => {
  const navigate = useNavigate();
  const onSameIsland = path === currentPath;
  const notEnoughLevel =
    !bumpkin || getBumpkinLevel(bumpkin.experience) < levelRequired;
  const cannotNavigate = notEnoughLevel || onSameIsland || comingSoon;

  if (cannotNavigate) {
    return (
      <div>
        <OuterPanel className="flex relative items-center py-2 mb-1 opacity-70">
          {image && (
            <div className="w-16 justify-center flex mr-2">
              <img src={image} className="h-9" />
            </div>
          )}
          <div className="flex-1 flex flex-col justify-center">
            <span className="text-sm mb-1">{name}</span>

            {/* Current island */}
            {onSameIsland && (
              <div className="flex items-center">
                <span
                  className="bg-blue-600 border text-xxs p-1 rounded-md"
                  style={{ lineHeight: "10px" }}
                >
                  You are here
                </span>
              </div>
            )}

            {/* Level requirement */}
            {(notEnoughLevel || comingSoon) && (
              <div className="flex items-center">
                <img src={heart} className="h-4 mr-1" />
                <Label type="danger">Lvl {levelRequired}</Label>

                <img src={lock} className="h-4 ml-1" />

                {/* Coming soon */}
                {comingSoon && (
                  <span className="text-xxs ml-2 italic">Coming soon</span>
                )}
              </div>
            )}
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

export const IslandList = ({
  bumpkin,
  showVisitList,
}: {
  bumpkin: Bumpkin | undefined;
  showVisitList: boolean;
}) => {
  const { authService } = useContext(Auth.Context);
  const [authState, send] = useActor(authService);
  const { id } = useParams();
  const location = useLocation();
  const [view, setView] = useState<"list" | "visitForm">("list");

  const islands: Island[] = [
    {
      name: "Home",
      image: farm,
      levelRequired: 0,
      path: `/land/${id}`,
    },
    {
      name: "Helios",
      levelRequired: 1,
      image: helios,
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
      image: treasureIsland,
      path: `/land/${id}/treasure-island`,
      comingSoon: CONFIG.NETWORK === "mainnet",
    },
    {
      name: "Stone Haven",
      levelRequired: 20,
      image: stoneHaven,
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
      levelRequired: 50,
      image: snowman,
      path: `/snow/${id}`,
      comingSoon: true,
    },
  ];

  const handleBackToHomeScreen = () => send("RETURN");

  const islandList = islands.sort((a, b) =>
    a.levelRequired > b.levelRequired ? 1 : -1
  );

  // Someone who is visiting without a loaded session
  const unAuthenticatedVisit = authState.matches("visiting");

  const ModalContent = () => {
    // NOTE: If you're visiting without a session then just show the form by default as there is no option to return to a farm
    if (view === "visitForm" || unAuthenticatedVisit) {
      return (
        <VisitLandExpansionForm
          onBack={
            unAuthenticatedVisit
              ? handleBackToHomeScreen
              : () => setView("list")
          }
        />
      );
    }

    if (showVisitList) {
      return (
        <>
          {authState.matches({ connected: "authorised" }) && (
            <Island
              name="Home"
              image={farm}
              levelRequired={0}
              path={`/land/${authState.context.farmId}`}
              bumpkin={bumpkin}
              currentPath={location.pathname}
            />
          )}
          <VisitFriendListItem onClick={() => setView("visitForm")} />
        </>
      );
    }

    return (
      <>
        {islandList.map((item) => (
          <Island
            key={item.name}
            {...item}
            bumpkin={bumpkin}
            currentPath={location.pathname}
          />
        ))}
        {!location.pathname.includes("retreat") && (
          <VisitFriendListItem onClick={() => setView("visitForm")} />
        )}
      </>
    );
  };

  return (
    <div
      style={{ maxHeight: CONTENT_HEIGHT }}
      className="w-full pr-1 pt-2.5 overflow-y-auto scrollable"
    >
      {ModalContent()}
    </div>
  );
};
