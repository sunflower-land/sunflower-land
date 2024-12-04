import { Label } from "components/ui/Label";
import { InnerPanel, Panel } from "components/ui/Panel";
import React, { useContext, useState } from "react";

import lock from "assets/icons/lock.png";
import trade from "assets/icons/trade.png";

import * as Auth from "features/auth/lib/Provider";

import { Context } from "features/game/GameProvider";
import { useActor, useSelector } from "@xstate/react";
import { getKeys } from "features/game/types/decorations";
import { getTradeableDisplay } from "../../lib/tradeables";
import { getItemId, tradeToId } from "../../lib/offers";
import { useNavigate, useParams } from "react-router-dom";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Modal } from "components/ui/Modal";
import { RemoveOffer } from "../RemoveOffer";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { NPC_WEARABLES } from "lib/npcs";
import { AuthMachineState } from "features/auth/lib/authMachine";
import sflIcon from "assets/icons/sfl.webp";
import classNames from "classnames";
import { Button } from "components/ui/Button";
import { InventoryItemName } from "features/game/types/game";
import { formatNumber } from "lib/utils/formatNumber";
import { TRADE_LIMITS } from "features/game/actions/tradeLimits";

const _authToken = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

export const MyOffers: React.FC = () => {
  const { t } = useAppTranslation();
  const params = useParams();

  const { gameService } = useContext(Context);
  const { authService } = useContext(Auth.Context);
  const [gameState] = useActor(gameService);

  const [claimId, setClaimId] = useState<string>();
  const [removeId, setRemoveId] = useState<string>();

  const authToken = useSelector(authService, _authToken);

  const { trades } = gameState.context.state;
  const offers = trades.offers ?? {};

  const filteredOffers =
    params.id && params.collection
      ? Object.fromEntries(
          Object.entries(offers).filter(([_, offer]) => {
            const offerItemName = getKeys(
              offer.items ?? {},
            )[0] as InventoryItemName;
            const offerItemId = getItemId({
              name: offerItemName,
              collection: offer.collection,
            });
            return (
              offerItemId === Number(params.id) &&
              offer.collection === params.collection
            );
          }),
        )
      : offers;

  const navigate = useNavigate();

  if (getKeys(filteredOffers).length === 0) return null;

  const escrowedSFL = getKeys(offers).reduce(
    (total, id) => total + offers[id].sfl,
    0,
  );

  const claim = () => {
    const offer = offers[claimId as string];

    gameService.send("offer.claimed", {
      tradeId: claimId,
    });

    // For on chain items let's fire a refresh
    if (offer.signature) {
      gameService.send("RESET");
    }

    setClaimId(undefined);
  };

  return (
    <>
      <Modal show={!!claimId} onHide={() => setClaimId(undefined)}>
        <Panel bumpkinParts={NPC_WEARABLES["hammerin harry"]}>
          <ClaimReward
            onClaim={claim}
            onClose={() => setClaimId(undefined)}
            reward={{
              createdAt: Date.now(),
              id: "offer-claimed",
              items:
                offers[claimId as string]?.collection === "collectibles"
                  ? offers[claimId as string].items
                  : {},
              wearables:
                offers[claimId as string]?.collection === "wearables"
                  ? offers[claimId as string].items
                  : {},
              sfl: 0,
              coins: 0,
              message: t("marketplace.offerClaimed"),
            }}
          />
        </Panel>
      </Modal>

      <Modal show={!!removeId} onHide={() => setRemoveId(undefined)}>
        <RemoveOffer
          authToken={authToken}
          id={removeId as string}
          offer={offers[removeId as string]}
          onClose={() => setRemoveId(undefined)}
        />
      </Modal>

      <InnerPanel className="mb-1">
        <div className="p-2">
          <div className="flex justify-between items-center">
            <Label className="mb-2" type="default" icon={trade}>
              {t("marketplace.myOffers")}
            </Label>
            <Label className="mb-2" type="formula" icon={lock}>
              {t("marketplace.sflEscrowed", {
                sfl: formatNumber(escrowedSFL, { decimalPlaces: 4 }),
              })}
            </Label>
          </div>
          <div className="flex flex-wrap">
            {getKeys(filteredOffers).length === 0 ? (
              <p className="text-sm">{t("marketplace.noMyOffers")}</p>
            ) : (
              <div className="w-full text-xs border-collapse mb-2">
                {getKeys(filteredOffers).map((id, index) => {
                  const offer = filteredOffers[id];
                  const itemName = getKeys(
                    offer.items ?? {},
                  )[0] as InventoryItemName;
                  const itemId = tradeToId({
                    details: {
                      collection: offer.collection,
                      items: offer.items,
                    },
                  });
                  const details = getTradeableDisplay({
                    id: itemId,
                    type: offer.collection,
                  });

                  const isResource =
                    getKeys(TRADE_LIMITS).includes(itemName) &&
                    offer.collection === "collectibles";

                  const quantity = offer.items[itemName];
                  const price = offer.sfl;
                  const unitPrice = price / (quantity ?? 1);

                  return (
                    <div
                      key={index}
                      className={classNames(
                        "relative bg-[#ead4aa] transition-all flex items-center",
                        {
                          "hover:shadow-md hover:scale-[100.5%] cursor-pointer":
                            Number(params.id) !== itemId,
                        },
                      )}
                      style={{
                        borderBottom: "1px solid #b96f50",
                        borderTop: index === 0 ? "1px solid #b96f50" : "",
                      }}
                      onClick={() =>
                        navigate(`/marketplace/${offer.collection}/${itemId}`)
                      }
                    >
                      <div className="p-1.5 flex w-1/2 sm:w-1/3 items-center">
                        <div className="flex items-center">
                          <img
                            src={details.image}
                            className="h-8 w-8 object-contain mr-3 sm:mr-4"
                          />
                          <p className="py-0.5 text-xxs sm:text-sm">
                            {`${isResource ? `${quantity} x` : ""} ${details.name}`}
                          </p>
                        </div>
                      </div>
                      <div className="p-1.5 truncate flex flex-1 items-center">
                        <div className="flex flex-col items-start justify-center">
                          <div className="flex justify-start space-x-1">
                            <img src={sflIcon} className="h-5" />
                            <span className="sm:text-sm">
                              {price.toFixed(2)}
                            </span>
                          </div>
                          {isResource && (
                            <div className="text-xxs w-full text-end">
                              {t("bumpkinTrade.price/unit", {
                                price: unitPrice.toFixed(4),
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-1 text-center w-[65px] sm:min-w-[94px]">
                        <Button
                          variant="secondary"
                          className="w-full h-8 rounded-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRemoveId(id);
                          }}
                        >
                          <p className="text-xxs sm:text-sm">{t("cancel")}</p>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </InnerPanel>
    </>
  );
};
