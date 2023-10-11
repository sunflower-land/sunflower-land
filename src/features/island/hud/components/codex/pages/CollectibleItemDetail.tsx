import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import Decimal from "decimal.js-light";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleName } from "features/game/types/craftables";
import { InventoryItemName } from "features/game/types/game";
import { WITHDRAWABLES } from "features/game/types/withdrawables";
import { OPEN_SEA_ITEMS } from "metadata/metadata";
import React, { useContext } from "react";
import { BaseInformation } from "../types";
import { getOpenSeaLink } from "../utils";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";

const _inventory = (state: MachineState) => state.context.state.inventory;
const _collectibles = (state: MachineState) => state.context.state.collectibles;

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
  const { gameService } = useContext(Context);
  const inventory = useSelector(gameService, _inventory);
  const collectibles = useSelector(gameService, _collectibles);
  const name = item.name as InventoryItemName;

  const { image_url, description, attributes } = OPEN_SEA_ITEMS[name];
  const image = image_url.replace("..", "");

  const boosts = attributes.filter((attr) => !!attr.display_type);
  const traits = attributes.filter((attr) => !attr.display_type);

  const ownedCount = Number(inventory[name] ?? new Decimal(0));
  const isPlaced = !!collectibles[name as CollectibleName] ?? false;
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
        <div className="flex gap-1 justify-center">
          {ownedCount > 0 && <Label type="success">Owned by You</Label>}
          {isPlaced && <Label type="success">Active on Farm</Label>}
        </div>
        <div>
          <img
            src={image}
            className="w-2/5 rounded-md overflow-hidden shadow-md float-left mr-2"
          />
          <p className="text-xs">{description}</p>
        </div>
        <div className="border-b-[1px] border-brown-600 mt-3" />
        {/* Item Metadata */}
        {children}
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col">
            <h3 className="text-sm mb-1">Traits</h3>
            <div className="flex flex-col space-y-1">
              {/* Opensea Traits */}
              {traits.map((attr, index) => {
                if (attr.trait_type === "Tradable") {
                  return (
                    <div
                      key={`${name}-trait-${attr.trait_type}-${index}`}
                      className="flex"
                    >
                      <span className="text-xxs">{attr.trait_type}:</span>
                      <img
                        src={
                          withdrawable
                            ? SUNNYSIDE.icons.confirm
                            : SUNNYSIDE.icons.close
                        }
                        className="h-3 ml-1"
                        key={name}
                      />
                    </div>
                  );
                }

                return (
                  <p
                    key={`${name}-trait-${attr.trait_type}-${index}`}
                    className="text-xxs"
                  >{`${attr.trait_type}: ${attr.value}`}</p>
                );
              })}
              {/* In game details */}
              <div className="flex">
                <span className="text-xxs">Withdrawable:</span>
                <img
                  src={
                    withdrawable
                      ? SUNNYSIDE.icons.confirm
                      : SUNNYSIDE.icons.close
                  }
                  className="h-3 ml-1"
                  key={name}
                />
              </div>

              <p className="text-xxs">{`Season: ${
                item.season ?? "Non Seasonal"
              }`}</p>
            </div>
          </div>
          {boosts.length > 0 && (
            <div className="flex flex-col">
              <h3 className="text-sm mb-1">Boosts</h3>
              <div className="flex flex-wrap gap-1">
                {boosts.map((attr) => {
                  if (attr.display_type === "boost_number") {
                    return (
                      <Label
                        key={`${name}-boost-${attr.display_type}`}
                        type="info"
                      >{`${attr.trait_type} ${
                        Number(attr.value) > 0 ? "+" : ""
                      }${attr.value}`}</Label>
                    );
                  }

                  // Percentage
                  return (
                    <Label
                      key={`${name}-boost-${attr.display_type}`}
                      type="info"
                    >{`${attr.trait_type} ${attr.value}%`}</Label>
                  );
                })}
              </div>
            </div>
          )}
          <div className="flex flex-col">
            <h3 className="text-sm mb-1">How to get this item?</h3>
            <ul className="text-xxs space-y-1">
              {item.howToObtain.map((text, index) => {
                if (text === "OpenSea") {
                  return (
                    <li className="flex" key={`how-to-obtain-${index}`}>
                      <div className="mr-1">-</div>
                      <span>
                        Buy on{" "}
                        <a
                          href={getOpenSeaLink(item.id, "collectible")}
                          className="underline text-xxs pb-1 pt-0.5 hover:text-blue-500"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          OpenSea
                        </a>
                      </span>
                    </li>
                  );
                }
                return (
                  <li className="flex" key={`how-to-obtain-${index}`}>
                    <div className="mr-1">-</div>
                    <span>{text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
