import React from "react";

import { getKeys } from "features/game/types/decorations";

import { ITEM_DETAILS } from "features/game/types/images";
import { CompetitionPrize, PRIZES } from "features/game/types/competitions";
import { ITEM_IDS } from "features/game/types/bumpkin";

type PrizeRow = CompetitionPrize & { from: number; to?: number };

export const CompetitionPrizes: React.FC = () => {
  // Group together rows that have the same prize
  const prizes: PrizeRow[] = [];
  let previous: PrizeRow | undefined = undefined;
  getKeys(PRIZES).forEach((key, index) => {
    const prize = PRIZES[key];

    let isSameAsPrevious = false;
    if (previous) {
      const { from, to, ...old } = previous;
      isSameAsPrevious = JSON.stringify(prize) === JSON.stringify(old);
    }

    if (!isSameAsPrevious) {
      if (previous) {
        prizes.push({ ...previous, to: index }); // Close the previous prize range
      }

      previous = {
        ...prize,
        from: index + 1,
      };
    } else if (previous) {
      previous.to = index + 1; // Extend the current prize range
    }
  });

  if (previous) prizes.push(previous as PrizeRow);

  return (
    <>
      <table className="w-full text-xs table-auto border-collapse">
        <tbody>
          {prizes.map((prize, index) => {
            return (
              <tr key={index}>
                <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                  {prize.from === prize.to || !prize.to
                    ? prize.from
                    : [prize.from, prize.to].join(" - ")}
                </td>
                <td
                  style={{ border: "1px solid #b96f50" }}
                  className="truncate"
                >
                  <div className="flex items-center space-x-2 pl-1 flex-wrap">
                    {getKeys(prize.items)
                      .filter((item) => (prize.items[item] ?? 0) > 0)
                      .map((item, index) => (
                        <div key={index} className="flex items-center mr-1">
                          <span className="text-xs">{`${item} `}</span>
                          <img
                            src={ITEM_DETAILS[item].image}
                            className="h-4 ml-0.5"
                          />
                        </div>
                      ))}
                    {getKeys(prize.wearables)
                      .filter((item) => (prize.wearables[item] ?? 0) > 0)
                      .map((item, index) => (
                        <div key={index} className="flex items-center mr-1">
                          <span className="text-xs">{`${item} `}</span>
                          <img
                            src={
                              new URL(
                                `/src/assets/wearables/${ITEM_IDS[item]}.webp`,
                                import.meta.url,
                              ).href
                            }
                            className="h-4 ml-0.5"
                          />
                        </div>
                      ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
