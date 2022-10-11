import React from "react";

import lock from "assets/skills/lock.png";
import { useNavigate, useParams } from "react-router-dom";
import { OuterPanel } from "components/ui/Panel";
import { getBumpkinLevel } from "features/game/lib/level";
import { Bumpkin } from "features/game/types/game";

const CONTENT_HEIGHT = 380;

interface Island {
  name: string;
  levelRequired: number;
  path: string;
}

interface Props extends Island {
  bumpkin: Bumpkin | undefined;
}

const Island = ({ name, levelRequired, path, bumpkin }: Props) => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(path)}>
      <OuterPanel className="flex relative items-center py-2 mb-1 cursor-pointer hover:bg-brown-200">
        <div className="flex-1 flex flex-col justify-center">
          <span className="text-sm">{name}</span>

          {!bumpkin ||
            (getBumpkinLevel(bumpkin.experience) < levelRequired && (
              <div className="flex items-center">
                <span
                  className="bg-error border text-xxs p-1 rounded-md"
                  style={{ lineHeight: "10px" }}
                >
                  Lvl {levelRequired}
                </span>

                <img src={lock} className="h-4 ml-1" />
              </div>
            ))}
        </div>
      </OuterPanel>
    </div>
  );
};

export const IslandList = ({ bumpkin }: { bumpkin: Bumpkin | undefined }) => {
  const { id } = useParams();
  const islands: Island[] = [
    {
      name: "Helios",
      levelRequired: 0,
      path: `/land/${id}/helios`,
    },
    {
      name: "Snow",
      levelRequired: 0,
      path: `/snow/${id}`,
    },
    {
      name: "Goblin Retreat",
      levelRequired: 100,
      path: "/",
    },
  ];

  return (
    <div
      style={{ maxHeight: CONTENT_HEIGHT }}
      className="w-full pr-1 pt-2.5 overflow-y-auto scrollable"
    >
      {islands.map((item) => (
        <Island key={item.name} {...item} bumpkin={bumpkin} />
      ))}
    </div>
  );
};
