import React from "react";
import classNames from "classnames";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "features/game/types/craftables";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { getImageUrl } from "lib/utils/getImageURLS";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import sflIcon from "assets/icons/flower_token.webp";
import { RaffleWinner } from "../../../world/ui/chapterRaffles/actions/loadRaffleResults";
import raffleTicketIcon from "assets/icons/raffle_icon.png";
import { shortenCount } from "lib/utils/formatNumber";
import petEggNFT from "assets/icons/pet_nft_egg.png";
import budSeedling from "assets/icons/bud_seedling.png";
import { RafflePrize } from "./types";
import { toOrdinalSuffix } from "./AuctionLeaderboardTable";

type Props = {
  winners: RaffleWinner[];
  farmId: number;
};

export const RaffleLeaderboardTable: React.FC<Props> = ({
  winners,
  farmId,
}) => {
  const { t } = useAppTranslation();

  if (!winners?.length) {
    return <p className="text-xxs">{t("auction.raffle.noWinners")}</p>;
  }

  return (
    <table className="w-full text-xs table-fixed border-collapse">
      <tbody>
        {winners.map((winner) => {
          const name = winner.profile?.username ?? `#${winner.farmId}`;
          const level = winner.profile?.level ?? "-";

          return (
            <tr
              key={`${winner.farmId}-${winner.position}`}
              className={classNames({
                "bg-green-500": winner.farmId === farmId,
              })}
            >
              <td
                style={{ border: "1px solid #b96f50" }}
                className="p-1.5 pb-2 w-8"
              >
                {`${winner.position}`}
              </td>
              <td
                style={{ border: "1px solid #b96f50" }}
                className="p-1.5 text-left pl-8 relative truncate"
              >
                {winner.profile?.equipped && (
                  <div
                    className="absolute"
                    style={{ left: "4px", top: "-0px" }}
                  >
                    <NPCIcon width={24} parts={winner.profile.equipped} />
                  </div>
                )}
                <p className="relative truncate">
                  {`${name} - ${t("auction.raffle.levelShort", { level })}`}
                </p>
              </td>

              <td
                style={{ border: "1px solid #b96f50" }}
                className="p-1.5 w-16"
              >
                <div className="flex space-x-1 ">
                  <img src={raffleTicketIcon} className="h-4 mr-0.5" />
                  <span className="text-xs">
                    {shortenCount(winner.ticketsUsed)}
                  </span>
                </div>
              </td>

              <td
                style={{ border: "1px solid #b96f50" }}
                className="p-1.5 w-16"
              >
                <div className="flex space-x-1 flex-wrap space-y-1">
                  {winner.sfl && winner.sfl > 0 && (
                    <div className="flex w-16 items-center">
                      <img src={sflIcon} className="h-4 mr-0.5" />
                      <span className="text-xs">{winner.sfl}</span>
                    </div>
                  )}
                  {getKeys(winner.items ?? {}).map((name) => (
                    <div className="flex w-16 items-center" key={name}>
                      <img
                        src={ITEM_DETAILS[name].image}
                        className="h-4 mr-0.5"
                      />
                      <span className="text-xs">{winner.items?.[name]}</span>
                    </div>
                  ))}
                  {getKeys(winner.wearables ?? {}).map((wearable) => (
                    <div className="flex w-16 items-center" key={wearable}>
                      <img
                        src={getImageUrl(ITEM_IDS[wearable])}
                        className="h-4 mr-0.5"
                      />
                      <span className="text-xs">
                        {winner.wearables?.[wearable]}
                      </span>
                    </div>
                  ))}
                  {winner.nft && (
                    <div className="flex w-16 items-center">
                      <img
                        src={
                          winner.nft.includes("Bud") ? budSeedling : petEggNFT
                        }
                        className="h-4 mr-0.5"
                      />
                      <span className="text-xs truncate">
                        {winner.nft.includes("Bud") ? "Bud NFT ?" : "Pet NFT ?"}
                      </span>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export const RafflePrizeTable: React.FC<{
  prizes: Record<number, RafflePrize>;
}> = ({ prizes }) => {
  const { t } = useAppTranslation();
  const prizeValues = Object.values(prizes);

  if (!prizeValues?.length) {
    return <p className="text-xxs">{t("auction.raffle.noPrizes")}</p>;
  }

  return (
    <table className="w-full text-xs table-fixed border-collapse">
      <tbody>
        {prizeValues.map((prize, index) => {
          return (
            <tr key={index}>
              <td
                style={{ border: "1px solid #b96f50" }}
                className="p-1.5 pb-2 w-12"
              >
                {toOrdinalSuffix(index + 1)}
              </td>

              <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                <div className="flex space-x-1 flex-wrap space-y-1">
                  {getKeys(prize.items ?? {}).map((name) => (
                    <div className="flex items-center" key={name}>
                      <img
                        src={ITEM_DETAILS[name].image}
                        className="h-4 mr-1"
                      />
                      <span className="text-xs">{`${prize.items?.[name]} x ${name}`}</span>
                    </div>
                  ))}
                  {getKeys(prize.wearables ?? {}).map((wearable) => (
                    <div className="flex items-center" key={wearable}>
                      <img
                        src={getImageUrl(ITEM_IDS[wearable])}
                        className="h-4 mr-1"
                      />
                      <span className="text-xs">{`${prize.wearables?.[wearable]} x ${wearable}`}</span>
                    </div>
                  ))}
                  {prize.nft && (
                    <div className="flex items-center">
                      <img
                        src={
                          prize.nft.includes("Bud") ? budSeedling : petEggNFT
                        }
                        className="h-4 mr-1"
                      />
                      <span className="text-xs truncate">{`${prize.nft.includes("Bud") ? "Bud NFT ?" : "Pet NFT ?"}`}</span>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
