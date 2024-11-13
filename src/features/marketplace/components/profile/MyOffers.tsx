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
import { getItemId } from "../../lib/offers";
import Decimal from "decimal.js-light";
import { useNavigate } from "react-router-dom";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Modal } from "components/ui/Modal";
import { RemoveOffer } from "../RemoveOffer";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { NPC_WEARABLES } from "lib/npcs";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { ListViewCard } from "../ListViewCard";
import { getTradeType } from "features/marketplace/lib/getTradeType";

const _authToken = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

export const MyOffers: React.FC = () => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const { authService } = useContext(Auth.Context);
  const [gameState] = useActor(gameService);

  const [claimId, setClaimId] = useState<string>();
  const [removeId, setRemoveId] = useState<string>();

  const authToken = useSelector(authService, _authToken);

  const { trades } = gameState.context.state;
  const offers = trades.offers ?? {};

  const navigate = useNavigate();

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
    const itemId = getItemId({ details: offer });
    if (
      getTradeType({ collection: offer.collection, id: itemId }) === "onchain"
    ) {
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

      <InnerPanel className="mb-2">
        <div className="p-2">
          <div className="flex justify-between items-center">
            <Label className="mb-2" type="default" icon={trade}>
              {t("marketplace.myOffers")}
            </Label>
            <Label className="mb-2" type="formula" icon={lock}>
              {t("marketplace.sflEscrowed", { sfl: escrowedSFL })}
            </Label>
          </div>
          <div className="flex flex-wrap">
            {getKeys(offers).length === 0 && (
              <p className="text-sm">{t("marketplace.noMyOffers")}</p>
            )}
            {getKeys(offers).map((id) => {
              const offer = offers[id];

              const itemId = getItemId({ details: offer });
              const details = getTradeableDisplay({
                id: itemId,
                type: offer.collection,
              });

              return (
                <div
                  className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 pr-1 pb-1"
                  key={id}
                >
                  <ListViewCard
                    name={details.name}
                    hasBoost={!!details.buff}
                    price={new Decimal(offer.sfl)}
                    image={details.image}
                    supply={0}
                    type={details.type}
                    id={itemId}
                    isSold={!!offer.fulfilledAt}
                    onClick={
                      offer.fulfilledAt
                        ? () => setClaimId(id)
                        : () => {
                            navigate(`/marketplace/${details.type}/${itemId}`);
                          }
                    }
                    onRemove={
                      offer.fulfilledAt
                        ? undefined
                        : () => {
                            setRemoveId(id);
                          }
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      </InnerPanel>
    </>
  );
};
