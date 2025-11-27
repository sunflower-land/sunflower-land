import React, { useContext, useState } from "react";
import Decimal from "decimal.js-light";
import { ButtonPanel } from "components/ui/Panel";
import sfl from "assets/icons/flower_token.webp";
import lightning from "assets/icons/lightning.png";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { formatNumber } from "lib/utils/formatNumber";
import { getItemId } from "../lib/offers";
import { TradeableDisplay } from "../lib/tradeables";
import { isTradeResource } from "features/game/actions/tradeLimits";
import { InventoryItemName } from "features/game/types/game";
import { secondsToString } from "lib/utils/time";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { BumpkinItem } from "features/game/types/bumpkin";
import { CountLabel } from "components/ui/CountLabel";
import classNames from "classnames";
import { ListViewImage } from "./ListViewImage";
import petNFTEggMarketplace from "assets/pets/pet-nft-egg-marketplace.webp";
import { getPetLevel } from "features/game/types/pets";
import { Label } from "components/ui/Label";
import { useNow } from "lib/utils/hooks/useNow";

type Props = {
  details: TradeableDisplay;
  price?: Decimal;
  lastSalePrice?: Decimal;
  onClick?: () => void;
  expiresAt?: number;
};

const _state = (state: MachineState) => state.context.state;

export const ListViewCard: React.FC<Props> = ({
  details,
  price,
  lastSalePrice,
  onClick,
  expiresAt,
}) => {
  const [isHover, setIsHover] = useState(false);
  const { gameService } = useContext(Context);
  const usd = gameService.getSnapshot().context.prices.sfl?.usd ?? 0.0;

  const { type, name, image, buffs, experience, translatedName } = details;
  const { t } = useAppTranslation();
  const now = useNow();

  const state = useSelector(gameService, _state);

  const itemId = getItemId({ name, collection: type });

  const isResources =
    isTradeResource(name as InventoryItemName) && type === "collectibles";

  // Check inventory count
  const getTotalCount = () => {
    switch (details.type) {
      case "collectibles":
        return (
          state.inventory[details.name as InventoryItemName]?.toNumber() || 0
        );
      case "buds":
        return state.buds?.[itemId] ? 1 : 0;
      case "pets":
        return state.pets?.nfts?.[itemId] ? 1 : 0;
      case "wearables":
        return state.wardrobe[name as BumpkinItem] || 0;

      default:
        return 0;
    }
  };

  const count = getTotalCount();

  return (
    <div
      className="relative cursor-pointer h-full"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{ paddingTop: "1px" }}
    >
      <ButtonPanel
        onClick={onClick}
        variant="card"
        className="h-full flex flex-col"
      >
        <div
          className={classNames("flex flex-col items-center relative", {
            "h-[70px] p-2 pt-4":
              details.type !== "buds" && details.type !== "pets",
            "h-32": details.type === "buds",
            "h-[138px]": details.type === "pets",
          })}
        >
          <ListViewImage
            name={name}
            image={image}
            fallbackImage={
              details.type === "pets" ? petNFTEggMarketplace : undefined
            }
            type={type}
            isResources={isResources}
          />
        </div>

        <div
          className="px-2 py-2 flex-1 z-10 overflow-y-auto scrollable"
          style={{
            background: "#fff0d4",
            borderTop: "1px solid #e4a672",
            margin: "0 -8px",
            marginBottom: "-2.6px",
            height: "100px",
            minHeight: "57px",
          }}
        >
          {price?.gt(0) && (
            <div className="absolute top-0 left-0">
              <div className="flex items-center ">
                <img src={sfl} className="h-4 sm:h-5 mr-1" />
                <p className="text-xs whitespace-nowrap">
                  {isResources
                    ? t("marketplace.pricePerUnit", {
                        price: formatNumber(price, {
                          decimalPlaces: 4,
                        }),
                      })
                    : `${formatNumber(price, {
                        decimalPlaces: 4,
                      })}`}
                </p>
              </div>
              {!isResources && (
                <p className="text-xxs">
                  {`$${new Decimal(usd).mul(price).toFixed(2)}`}
                </p>
              )}
            </div>
          )}

          {count > 0 ? (
            <CountLabel
              isHover={isHover}
              count={new Decimal(count)}
              labelType="default"
              rightShiftPx={-11}
              topShiftPx={-12}
            />
          ) : null}

          <div className="flex justify-between items-center gap-1">
            <p className="text-xs mb-1 py-0.5 truncate text-[#181425]">
              {translatedName ?? name}
            </p>

            {type === "pets" && (
              <Label type="info" className="mb-1">
                <span className="text-xxs">
                  {t("pets.level", {
                    level: getPetLevel(experience ?? 0).level,
                  })}
                </span>
              </Label>
            )}
          </div>

          {buffs.map((buff) => (
            <div key={buff.shortDescription} className="flex items-center">
              <img
                src={buff.boostedItemIcon ?? lightning}
                className={classNames("h-4 mr-1", {
                  "h-auto w-4": buff.shortDescription.includes("XP"),
                })}
              />
              <p className="text-xs truncate pb-0.5">{buff.shortDescription}</p>
            </div>
          ))}

          {expiresAt && (
            <div className="flex items-center">
              <img src={SUNNYSIDE.icons.stopwatch} className="h-4 mr-1" />
              <p className="text-xs truncate pb-0.5">
                {" "}
                {`${secondsToString((expiresAt - now) / 1000, {
                  length: "short",
                })} left`}
              </p>
            </div>
          )}

          {lastSalePrice?.gt(0) && (
            <p className="text-xxs truncate pb-0.5">
              {`Last sale: ${formatNumber(lastSalePrice, {
                decimalPlaces: 4,
              })} FLOWER`}
            </p>
          )}
        </div>
      </ButtonPanel>
    </div>
  );
};
