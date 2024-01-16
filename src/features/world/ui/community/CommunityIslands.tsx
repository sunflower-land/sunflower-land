import { OuterPanel } from "components/ui/Panel";
import React from "react";
import { useNavigate } from "react-router-dom";

import dignity from "assets/icons/dignity.png";
import unicorn from "assets/icons/unicorn.png";
import { translate } from "lib/i18n/translate";

type CommunityIsland = {
  url: string;
  project: string;
  name: string;
  id: string;
  icon: string;
  special?: boolean;
};

export const COMMUNITY_ISLANDS: CommunityIsland[] = [
  {
    url: "https://0xsacul.github.io/valoria-isle/",
    name: "Valoria Isle",
    id: "valoria_isle",
    icon: dignity,
    project: "Valoria",
  },
  {
    url: "https://sunflower-land.github.io/crypto-unicorn-community-island/",
    // url: "http://localhost:3003/",
    name: "Unicorn Island",
    id: "unicorn_island",
    icon: unicorn,
    project: "Crypto Unicorns",
    special: true,
  },
];

export const CommunityIslands: React.FC = () => {
  const navigate = useNavigate();
  const travel = async (island: CommunityIsland) => {
    navigate(`/community/${island.id}`);
  };

  return (
    <>
      <div className="p-2">
        <p className="mb-2">{translate("comunity.Travel")}</p>
      </div>

      {COMMUNITY_ISLANDS.map((island) => (
        <OuterPanel
          key={island.id}
          onClick={() => travel(island)}
          className={
            "flex relative items-center py-2 mb-1 cursor-pointer hover:bg-brown-200"
          }
        >
          <div className="w-16 justify-center flex mr-2">
            <img src={island.icon} className="h-9" />
          </div>
          <div>
            <span>{island.name}</span>
          </div>
        </OuterPanel>
      ))}
      <a
        href="https://docs.sunflower-land.com/contributing/community-islands"
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-white text-xs"
      >
        {translate("read.more")}
      </a>
    </>
  );
};
