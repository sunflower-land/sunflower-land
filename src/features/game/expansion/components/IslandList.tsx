import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { OuterPanel } from "components/ui/Panel";
import { getBumpkinLevel } from "features/game/lib/level";
import { Bumpkin } from "features/game/types/game";

import lock from "assets/skills/lock.png";
import heart from "assets/icons/heart.png";

import goblin from "assets/buildings/goblin_sign.png";
import farm from "assets/crops/sunflower/planted.png";
import helios from "assets/land/islands/helios_icon.png";
import treasureIsland from "assets/land/islands/treasure_icon.png";
import stoneHaven from "assets/land/islands/stone_haven.png";
import sunflorea from "assets/land/islands/sunflorea.png";
import snowman from "assets/npcs/snowman.png";

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
            <span className="text-sm">{name}</span>

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
            {notEnoughLevel && (
              <div className="flex items-center">
                <img src={heart} className="h-4 mr-1" />
                <span
                  className="bg-error border text-xxs p-1 rounded-md"
                  style={{ lineHeight: "10px" }}
                >
                  Lvl {levelRequired}
                </span>
                <img src={lock} className="h-4 ml-1" />
              </div>
            )}

            {/* Coming soon */}
            {comingSoon && (
              <span className="text-xxs ml-2 italic">Coming soon</span>
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

export const IslandList = ({ bumpkin }: { bumpkin: Bumpkin | undefined }) => {
  const { id } = useParams();
  const location = useLocation();
  const islands: Island[] = [
    {
      name: "Farm",
      image: farm,
      levelRequired: 0,
      path: `/land/${id}`,
    },
    {
      name: "Helios",
      levelRequired: 3,
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
      path: `/treasure/${id}`,
      comingSoon: true,
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

  const islandList = islands.sort((a, b) =>
    a.levelRequired > b.levelRequired ? 1 : -1
  );

  return (
    <div
      style={{ maxHeight: CONTENT_HEIGHT }}
      className="w-full pr-1 pt-2.5 overflow-y-auto scrollable"
    >
      {islandList.map((item) => (
        <Island
          key={item.name}
          {...item}
          bumpkin={bumpkin}
          currentPath={location.pathname}
        />
      ))}
    </div>
  );
};
