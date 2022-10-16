import React from "react";
import lock from "assets/skills/lock.png";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { OuterPanel } from "components/ui/Panel";
import { getBumpkinLevel } from "features/game/lib/level";
import { Bumpkin } from "features/game/types/game";
import goblin from "assets/buildings/goblin_sign.png";
import human from "assets/npcs/bumpkin.png";
import merchant from "assets/npcs/merchant.png";
import snowman from "assets/npcs/snowman.png";

const CONTENT_HEIGHT = 380;

interface Island {
  name: string;
  levelRequired: number;
  path: string;
  image?: string;
}

interface Props extends Island {
  bumpkin: Bumpkin | undefined;
}

const Island = ({ name, levelRequired, path, bumpkin, image }: Props) => {
  const navigate = useNavigate();
  const cannotNavigate =
    !bumpkin || getBumpkinLevel(bumpkin.experience) < levelRequired;

  if (cannotNavigate) {
    return (
      <div>
        <OuterPanel className="flex relative items-center py-2 mb-1 opacity-50">
          {image && (
            <div className="w-16 justify-center flex mr-2">
              <img src={image} className="h-9" />
            </div>
          )}
          <div className="flex-1 flex flex-col justify-center">
            <span className="text-sm">{name}</span>
            <div className="flex items-center">
              <span
                className="bg-error border text-xxs p-1 rounded-md"
                style={{ lineHeight: "10px" }}
              >
                Lvl {levelRequired}
              </span>

              <img src={lock} className="h-4 ml-1" />
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

export const IslandList = ({ bumpkin }: { bumpkin: Bumpkin | undefined }) => {
  const { id } = useParams();
  const location = useLocation();
  const islands: Island[] = [
    {
      name: "Helios",
      levelRequired: 0,
      image: merchant,
      path: `/land/${id}/helios`,
    },
    {
      name: "Snow Kingdom",
      levelRequired: 100,
      image: snowman,
      path: `/snow/${id}`,
    },
    {
      name: "Goblin Retreat",
      levelRequired: 0,
      image: goblin,
      path: `/retreat/${id}`,
    },
    {
      name: "Farm",
      image: human,
      levelRequired: 0,
      path: `/land/${id}`,
    },
  ];

  const islandList = islands
    .filter((item) => item.path !== location.pathname)
    .sort((a, b) => (a.levelRequired > b.levelRequired ? 1 : -1));

  return (
    <div
      style={{ maxHeight: CONTENT_HEIGHT }}
      className="w-full pr-1 pt-2.5 overflow-y-auto scrollable"
    >
      {islandList.map((item) => (
        <Island key={item.name} {...item} bumpkin={bumpkin} />
      ))}
    </div>
  );
};
