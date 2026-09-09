import React from "react";
import classNames from "classnames";

import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { shortenCount } from "lib/utils/formatNumber";
import type { PlayerModalPlayer } from "features/social/lib/playerModalManager";
import type {
  StatsLeaderboardName,
  StatsLeaderboardPlayer,
} from "features/game/expansion/components/leaderboard/actions/statsLeaderboard";

import { SUNNYSIDE } from "assets/sunnyside";
import coinsIcon from "assets/icons/coins.webp";
import xpIcon from "assets/icons/xp.png";
import chickenIcon from "assets/icons/chook.webp";
import deliveryIcon from "assets/icons/delivery.webp";

export const BOARD_ICONS: Record<StatsLeaderboardName, string> = {
  coins: coinsIcon,
  experience: xpIcon,
  cropsHarvested: SUNNYSIDE.icons.plant,
  fishCaught: SUNNYSIDE.icons.fish,
  animalsFed: chickenIcon,
  deliveries: deliveryIcon,
};

interface Props {
  name: StatsLeaderboardName;
  players: StatsLeaderboardPlayer[];
  onPlayerClick: (player: PlayerModalPlayer) => void;
}

/**
 * One board of the Hall of Fame - a heading and its ranked players.
 *
 * Once the boards sit side by side they take a fixed height so the row lines up
 * whatever each board holds, with the list scrolling inside. Stacked on mobile
 * they only cap that height, so a short board doesn't leave a gap.
 */
export const HallOfFameBoard: React.FC<Props> = ({
  name,
  players,
  onPlayerClick,
}) => {
  const { t } = useAppTranslation();

  return (
    <InnerPanel className="flex flex-col max-h-[420px] sm:h-[420px]">
      <div className="flex flex-col gap-1 p-1 shrink-0">
        <Label type="default" icon={BOARD_ICONS[name]}>
          {t(`statsLeaderboard.title.${name}`)}
        </Label>
        <p className="text-xxs italic">
          {t(`statsLeaderboard.description.${name}`)}
        </p>
      </div>

      {players.length === 0 ? (
        <p className="text-xxs p-1">{t("statsLeaderboard.empty")}</p>
      ) : (
        <div className="flex-1 overflow-y-auto scrollable">
          {players.map((player) => (
            <HallOfFameRow
              key={`${player.rank}-${player.farmId}`}
              player={player}
              onClick={onPlayerClick}
            />
          ))}
        </div>
      )}
    </InnerPanel>
  );
};

const HallOfFameRow: React.FC<{
  player: StatsLeaderboardPlayer;
  onClick: (player: PlayerModalPlayer) => void;
}> = ({ player, onClick }) => {
  const { rank, farmId, username, bumpkin, count } = player;

  return (
    <div
      className={classNames("flex items-center gap-1 px-1 py-0.5 text-xxs", {
        "bg-[#ead4aa]": rank % 2 === 1,
        // A deleted farm has no wearables - nothing to open.
        "cursor-pointer hover:brightness-95": !!bumpkin,
      })}
      onClick={() => {
        if (bumpkin) {
          onClick({ farmId, username, clothing: bumpkin });
        }
      }}
    >
      <span className="w-5 text-right shrink-0">{rank}</span>
      <div className="w-6 h-6 shrink-0 flex items-center">
        {bumpkin && <NPCIcon width={22} parts={bumpkin} />}
      </div>
      <span className="flex-1 truncate">{username}</span>
      <span className="shrink-0" title={count.toLocaleString()}>
        {shortenCount(count)}
      </span>
    </div>
  );
};
