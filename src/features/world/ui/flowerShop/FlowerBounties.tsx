import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { ButtonPanel, Panel } from "components/ui/Panel";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { Context } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { weekResetsAt } from "features/game/lib/factions";
import { MachineState } from "features/game/lib/gameMachine";
import { getKeys } from "features/game/types/decorations";
import { FLOWERS } from "features/game/types/flowers";
import { BountyRequest } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NPC_WEARABLES } from "lib/npcs";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import React, { useContext, useState } from "react";

const _exchange = (state: MachineState) => state.context.state.bounties;

interface Props {
  onClose: () => void;
}

function acknowledgeIntro() {
  localStorage.setItem(
    "flower.bounties.acknowledged",
    new Date().toISOString(),
  );
}

function hasReadIntro() {
  return !!localStorage.getItem("flower.bounties.acknowledged");
}

export const FlowerBounties: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const exchange = useSelector(gameService, _exchange);

  const { t } = useAppTranslation();

  const [showIntro, setShowIntro] = useState(!hasReadIntro());
  const [deal, setDeal] = useState<BountyRequest>();

  const state = gameService.getSnapshot().context.state;

  const deals = exchange.requests.filter((deal) => deal.name in FLOWERS);

  const expiresAt = useCountdown(weekResetsAt());

  if (showIntro) {
    return (
      <SpeakingModal
        message={[
          {
            text: t("bounties.flower.intro.one"),
          },
          {
            text: t("bounties.flower.intro.two"),
          },
        ]}
        bumpkinParts={NPC_WEARABLES.poppy}
        onClose={() => {
          acknowledgeIntro();
          setShowIntro(false);
        }}
      />
    );
  }

  if (deal) {
    return (
      <Deal
        deal={deal}
        onClose={() => setDeal(undefined)}
        onSold={() => setDeal(undefined)}
      />
    );
  }

  return (
    <CloseButtonPanel bumpkinParts={NPC_WEARABLES.poppy} onClose={onClose}>
      <div className="p-1">
        <div className="flex flex-wrap items-center mb-2">
          <Label type="default" className="mr-2">
            {t("bounties.board")}
          </Label>
          <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
            <TimerDisplay time={expiresAt} />
          </Label>
        </div>

        <p className="text-xs mb-2">{t("bounties.board.info")}</p>
        <div className="flex flex-wrap">
          {deals.length === 0 && (
            <p className="text-sm">{t("bounties.board.empty")}</p>
          )}
          {deals.map((deal) => {
            const isSold = !!state.bounties.completed.find(
              (request) => request.id === deal.id,
            );

            const isDisabled = isSold || !state.inventory[deal.name]?.gt(0);

            return (
              <div
                key={deal.id}
                className={classNames("w-1/3 sm:w-1/4 pr-1.5 pb-1.5", {
                  "pointer-events-none": isSold,
                })}
              >
                <ButtonPanel
                  disabled={isDisabled}
                  className="h-full"
                  onClick={() => {
                    if (isDisabled) {
                      return;
                    }
                    setDeal(deal);
                  }}
                >
                  <div className="flex justify-center items-center my-2 mb-6">
                    <div className="relative mr-2">
                      <img
                        src={ITEM_DETAILS[deal.name].image}
                        className="h-8 z-20"
                      />
                    </div>
                    <span className="text-xxs flex-1 text-left leading-snug">
                      {deal.name}
                    </span>
                  </div>

                  {!!isSold && (
                    <Label
                      type="success"
                      className={"absolute -top-3.5 text-center p-1 "}
                      style={{
                        right: `${PIXEL_SCALE * -3}px`,
                        // width: `calc(100% + ${PIXEL_SCALE * 6}px)`,
                        height: "25px",
                      }}
                    >
                      {t("bounties.sold")}
                    </Label>
                  )}

                  {!!deal.coins && (
                    <Label
                      type="warning"
                      icon={SUNNYSIDE.ui.coinsImg}
                      className={"absolute -bottom-2 text-center p-1 "}
                      style={{
                        left: `${PIXEL_SCALE * -3}px`,
                        right: `${PIXEL_SCALE * -3}px`,
                        width: `calc(100% + ${PIXEL_SCALE * 6}px)`,
                        height: "25px",
                      }}
                    >
                      {deal.coins}
                    </Label>
                  )}

                  {getKeys(deal.items ?? {}).map((name) => {
                    return (
                      <Label
                        key={name}
                        type="warning"
                        icon={ITEM_DETAILS[name].image}
                        className={"absolute -bottom-2 text-center p-1 "}
                        style={{
                          left: `${PIXEL_SCALE * -3}px`,
                          right: `${PIXEL_SCALE * -3}px`,
                          width: `calc(100% + ${PIXEL_SCALE * 6}px)`,
                          height: "25px",
                        }}
                      >
                        {deal.items?.[name]}
                      </Label>
                    );
                  })}
                </ButtonPanel>
              </div>
            );
          })}
        </div>
      </div>
    </CloseButtonPanel>
  );
};

const Deal: React.FC<{
  deal: BountyRequest;
  onClose: () => void;
  onSold: () => void;
}> = ({ deal, onClose, onSold }) => {
  const { gameService } = useContext(Context);

  const { t } = useAppTranslation();
  const sell = () => {
    gameService.send("bounty.sold", {
      requestId: deal.id,
    });

    onSold();
  };

  if (!deal) {
    return null;
  }

  return (
    <Panel bumpkinParts={NPC_WEARABLES.poppy}>
      <div className="p-2">
        <div className="mb-2 flex flex-wrap">
          <Label
            type="default"
            icon={ITEM_DETAILS[deal.name].image}
            className="mr-2"
          >
            {deal.name}
          </Label>
          {!!deal.coins && (
            <Label type="warning" icon={SUNNYSIDE.ui.coinsImg}>
              {deal.coins}
            </Label>
          )}

          {getKeys(deal.items ?? {}).map((name) => (
            <Label key={name} type="warning" icon={ITEM_DETAILS[name].image}>
              {deal.items?.[name]}
            </Label>
          ))}
        </div>

        <p>
          {deal.coins
            ? t("bounties.sell.coins", { amount: deal.coins })
            : t("bounties.sell.items", {
                amount: getKeys(deal.items ?? {})
                  .map((name) => `${deal.items?.[name]} x ${name}`)
                  .join(" - "),
              })}
        </p>
      </div>
      <div className="flex">
        <Button className="mr-1" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button onClick={sell}>{t("confirm")}</Button>
      </div>
    </Panel>
  );
};
