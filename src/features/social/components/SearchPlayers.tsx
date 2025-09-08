import React, { useContext, useState } from "react";
import { SearchBar } from "./SearchBar";
import { Detail } from "../actions/getFollowNetworkDetails";
import { FollowDetailPanel } from "./FollowDetailPanel";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { playerModalManager } from "../lib/playerModalManager";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const _farmId = (state: MachineState) =>
  state.context.visitorId ?? state.context.farmId;

export const SearchPlayers: React.FC = () => {
  const { gameService } = useContext(Context);

  const { t } = useAppTranslation();

  const [searchResults, setSearchResults] = useState<Detail[]>([]);
  const farmId = useSelector(gameService, _farmId);

  const handlePlayerClick = (playerId: number) => {
    playerModalManager.open({
      farmId: playerId,
    });
  };

  return (
    <div className="flex flex-col">
      <SearchBar context="all" onSearchResults={setSearchResults} />
      <div className="flex flex-col gap-1 h-80 mt-1 overflow-y-auto scrollable">
        {searchResults.length === 0 && (
          <div className="flex p-1 h-full">
            <p className="text-sm">{t("playerSearch.startTyping")}</p>
          </div>
        )}
        <div className="flex flex-col pr-0.5">
          {searchResults.map((result) => (
            <FollowDetailPanel
              loggedInFarmId={farmId}
              clothing={result.clothing}
              playerId={result.id}
              key={result.id}
              username={result.username}
              lastOnlineAt={result.lastUpdatedAt}
              hasCookingPot={result.hasCookingPot}
              helpedThemToday={result.helpedThemToday}
              helpedYouToday={result.helpedYouToday}
              socialPoints={result.socialPoints}
              navigateToPlayer={handlePlayerClick}
              helpStreak={result.helpStreak}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
