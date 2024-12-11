import { Label } from "components/ui/Label";
import { InnerPanel, Panel } from "components/ui/Panel";
import React, { useContext, useState } from "react";
import * as Auth from "features/auth/lib/Provider";
import { Context } from "features/game/GameProvider";
import { useActor, useSelector } from "@xstate/react";
import { getKeys } from "features/game/types/decorations";
import { getTradeableDisplay } from "../../lib/tradeables";
import { getItemId, tradeToId } from "../../lib/offers";
import { useLocation, useNavigate, useParams } from "react-router";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Modal } from "components/ui/Modal";
import { RemoveOffer } from "../RemoveOffer";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { NPC_WEARABLES } from "lib/npcs";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { InventoryItemName } from "features/game/types/game";
import { formatNumber } from "lib/utils/formatNumber";
import { TRADE_LIMITS } from "features/game/actions/tradeLimits";
import { MyTableRow } from "./MyTableRow";

import lock from "assets/icons/lock.png";
import trade from "assets/icons/trade.png";

const _authToken = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

export const MyOffers: React.FC = () => {
  const { t } = useAppTranslation();
  const params = useParams();
  const isWorldRoute = useLocation().pathname.includes("/world");

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

  const usd = gameService.getSnapshot().context.prices.sfl?.usd ?? 0.0;

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
                    state: gameState.context.state,
                  });

                  const isResource =
                    getKeys(TRADE_LIMITS).includes(itemName) &&
                    offer.collection === "collectibles";

                  const quantity = offer.items[itemName];
                  const price = offer.sfl;
                  const unitPrice = price / (quantity ?? 1);

                  return (
                    <MyTableRow
                      key={index}
                      index={index}
                      id={id}
                      itemId={itemId}
                      pageItemId={params.id ?? ""}
                      itemName={itemName}
                      quantity={quantity ?? 0}
                      price={price}
                      collection={offer.collection}
                      unitPrice={unitPrice}
                      usdPrice={usd}
                      isFulfilled={!!offer.fulfilledAt}
                      isResource={isResource}
                      onCancel={() => setRemoveId(id)}
                      onRowClick={() =>
                        navigate(
                          `${isWorldRoute ? "/world" : ""}/marketplace/${details.type}/${itemId}`,
                        )
                      }
                      onClaim={() => setClaimId(id)}
                    />
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
