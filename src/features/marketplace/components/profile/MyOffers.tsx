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
import { tradeToId } from "../../lib/offers";
import Decimal from "decimal.js-light";
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
import { KNOWN_IDS } from "features/game/types";
import { InventoryItemName } from "features/game/types/game";
import { formatNumber } from "lib/utils/formatNumber";

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

  const filteredOffers = params.id
    ? Object.fromEntries(
        Object.entries(offers).filter(([_, offer]) => {
          const offerItemName = getKeys(
            offer.items ?? {},
          )[0] as InventoryItemName;
          const offerItemId = KNOWN_IDS[offerItemName];
          return offerItemId === Number(params.id);
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
              <table className="w-full text-xs border-collapse bg-[#ead4aa] ">
                <thead>
                  <tr>
                    <th className="p-1.5 text-left">
                      <p>{t("marketplace.item")}</p>
                    </th>
                    <th className="p-1.5 text-left">
                      <p>{t("marketplace.unitPrice")}</p>
                    </th>

                    <th className="p-1.5 "></th>
                  </tr>
                </thead>
                <tbody>
                  {getKeys(filteredOffers).map((id, index) => {
                    const offer = filteredOffers[id];

                    const itemId = tradeToId({ details: offer });
                    const details = getTradeableDisplay({
                      id: itemId,
                      type: offer.collection,
                    });
                    const itemName = getKeys(
                      offer.items ?? {},
                    )[0] as InventoryItemName;
                    const quantity = offer.items[itemName];
                    const isResource = offer.collection === "resources";

                    return (
                      <tr
                        key={index}
                        className={classNames(
                          "relative bg-[#ead4aa] !py-10 transition-all",
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
                          navigate(`/marketplace/${details.type}/${itemId}`)
                        }
                      >
                        <td className="p-1.5 w-2/5 text-left">
                          <div className="flex items-center">
                            <img src={details.image} className="h-8 mr-4" />
                            <p className="text-sm">{`${isResource ? quantity + " x" : ""} ${details.name}`}</p>
                          </div>
                        </td>
                        <td className="p-1.5 text-left relative">
                          <div className="flex items-center">
                            <img src={sflIcon} className="h-5 mr-1" />
                            <p className="text-sm">
                              {new Decimal(
                                isResource
                                  ? formatNumber(offer.sfl / Number(quantity), {
                                      decimalPlaces: 4,
                                    })
                                  : offer.sfl,
                              ).toFixed(2)}
                            </p>
                          </div>
                        </td>

                        <td className="p-1.5 truncate flex items-center justify-end pr-2 h-full">
                          <Button
                            variant="secondary"
                            className="w-auto h-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setRemoveId(id);
                            }}
                          >
                            {t("cancel")}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </InnerPanel>
    </>
  );
};
