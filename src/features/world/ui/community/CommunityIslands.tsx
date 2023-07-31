import { SUNNYSIDE } from "assets/sunnyside";
import { OuterPanel } from "components/ui/Panel";
import { CONFIG } from "lib/config";
import React from "react";
import { useNavigate } from "react-router-dom";

type CommunityIsland = {
  url: string;
  name: string;
  id: string;
};

export const COMMUNITY_ISLANDS = [
  {
    url: "https://sunflower-land.github.io/community-island-example/public",
    name: "Test Island",
    id: "test_island",
  },
];

export const CommunityIslands: React.FC = () => {
  const navigate = useNavigate();
  const travel = async (island: CommunityIsland) => {
    navigate(`/community/${island.id}`);
  };

  if (CONFIG.NETWORK === "mainnet") {
    return (
      <div className="p-2">
        <p className="mb-2">Travel to community built islands</p>
        <a
          href="https://docs.sunflower-land.com/contributing/community-islands"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-white text-xs"
        >
          Read more
        </a>
      </div>
    );
  }
  return (
    <>
      <div className="p-2">
        <p>Community Islands</p>
        <p className="text-sm">Lorem ipsum</p>
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
            <img src={SUNNYSIDE.icons.happy} className="h-9" />
          </div>
          <div>
            <span>{island.name}</span>
          </div>
        </OuterPanel>
      ))}
    </>
  );
};
