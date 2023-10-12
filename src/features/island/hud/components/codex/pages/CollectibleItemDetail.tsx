import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { InventoryItemName } from "features/game/types/game";
import { WITHDRAWABLES } from "features/game/types/withdrawables";
import { OPEN_SEA_ITEMS } from "metadata/metadata";
import React from "react";
import { BaseInformation } from "../types";
import { getOpenSeaLink } from "../utils";

/**
 * Base Layout for Collectible Item Details Page in Codex
 * It can be extended by passing in addition children components
 */
type Props = {
  item: BaseInformation;
  children?: React.ReactNode;
  onBack: () => void;
};

export const CollectibleItemDetail: React.FC<Props> = ({
  item,
  onBack,
  children,
}) => {
  const name = item.name as InventoryItemName;

  const { image_url, description } = OPEN_SEA_ITEMS[name];
  const image = image_url.replace("..", "");
  const withdrawable = WITHDRAWABLES[name]();

  return (
    <div className="p-2 relative">
      <div className="flex mb-1">
        <img
          src={SUNNYSIDE.icons.arrow_left}
          className="cursor-pointer flex-none"
          onClick={onBack}
          style={{
            width: `${PIXEL_SCALE * 11}px`,
          }}
        />
        <div className="flex-1 flex justify-center">
          <h2>{name}</h2>
        </div>
        <div
          className="flex-none"
          style={{
            width: `${PIXEL_SCALE * 11}px`,
          }}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex">
          <img
            src={image}
            className="w-2/5 rounded-md overflow-hidden shadow-md mr-2"
          />
          {item.boosts.length > 0 && (
            <div className="flex flex-col">
              <div className="flex flex-wrap gap-1">
                {item.boosts.map((boost) => {
                  if (boost.type === "special") {
                    // TODO - add special label
                    return (
                      <Label key={`${name}-boost-${boost.type}`} type="warning">
                        Special
                      </Label>
                    );
                  }

                  // TODO - add quantity label
                  return (
                    <Label
                      key={`${name}-boost-${boost.type}`}
                      type="success"
                    >{`${boost.boost}`}</Label>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <p className="text-xs">{description}</p>
        {item.season && (
          <div className="flex item-center">
            <span className="text-xxs mr-1">{"Season: Witches' Eve"}</span>
          </div>
        )}

        <div className="border-b-[1px] border-brown-600 mt-3" />
        <div className="flex flex-col">
          <h3 className="text-sm mb-1">How to get this item?</h3>
          <ul className="text-xxs space-y-1">
            {item.howToObtain.map((text, index) => (
              <li className="flex" key={`how-to-obtain-${index}`}>
                <div className="mr-1">-</div>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Item Metadata */}
        {children}
        <div className="flex">
          <a
            href={getOpenSeaLink(item.id, "collectible")}
            className="underline text-xxs pb-1 pt-0.5 hover:text-blue-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenSea
          </a>
        </div>
      </div>
    </div>
  );
};
