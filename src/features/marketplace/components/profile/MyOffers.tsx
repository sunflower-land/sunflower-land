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
import { KNOWN_IDS, KNOWN_ITEMS } from "features/game/types";
import { formatNumber } from "lib/utils/formatNumber";
import { TRADE_LIMITS } from "features/game/actions/tradeLimits";
import { ITEM_NAMES } from "features/game/types/bumpkin";

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
            return (
              offer.itemId === Number(params.id) &&
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
                  ? {
                      [KNOWN_ITEMS[offers[claimId as string].itemId]]:
                        offers[claimId as string].quantity,
                    }
                  : {},
              wearables:
                offers[claimId as string]?.collection === "wearables"
                  ? {
                      [ITEM_NAMES[offers[claimId as string].itemId]]:
                        offers[claimId as string].quantity,
                    }
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

                    const details = getTradeableDisplay({
                      id: offer.itemId,
                      type: offer.collection,
                    });
                    const quantity = offer.quantity;
                    const isResource =
                      offer.collection === "collectibles" &&
                      getKeys(TRADE_LIMITS).some(
                        (name) => KNOWN_IDS[name] === offer.itemId,
                      );

                    return (
                      <tr
                        key={index}
                        className={classNames(
                          "relative bg-[#ead4aa] !py-10 transition-all",
                          {
                            "hover:shadow-md hover:scale-[100.5%] cursor-pointer":
                              Number(params.id) !== offer.itemId,
                          },
                        )}
                        style={{
                          borderBottom: "1px solid #b96f50",
                          borderTop: index === 0 ? "1px solid #b96f50" : "",
                        }}
                        onClick={() =>
                          navigate(
                            `/marketplace/${details.type}/${offer.itemId}`,
                          )
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
