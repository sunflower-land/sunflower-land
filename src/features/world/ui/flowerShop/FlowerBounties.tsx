import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { ButtonPanel } from "components/ui/Panel";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import {
  generateBountyCoins,
  generateBountyTicket,
} from "features/game/events/landExpansion/sellBounty";
import { Context } from "features/game/GameProvider";
import { weekResetsAt } from "features/game/lib/factions";
import {
  MachineInterpreter,
  MachineState,
} from "features/game/lib/gameMachine";
import { getKeys } from "features/game/types/decorations";
import { FLOWERS } from "features/game/types/flowers";
import { BountyRequest, GameState } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { getSeasonalTicket } from "features/game/types/seasons";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NPC_WEARABLES } from "lib/npcs";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import React, { useContext, useState } from "react";

interface Props {
  readonly?: boolean;
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

const _state = (state: MachineState) => state.context.state;

export const FlowerBounties: React.FC<Props> = ({ readonly, onClose }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);

  const [showIntro, setShowIntro] = useState(!hasReadIntro());

  if (showIntro && !readonly) {
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

  return (
    <CloseButtonPanel bumpkinParts={NPC_WEARABLES.poppy} onClose={onClose}>
      <FlowerBountiesModal
        readonly={readonly}
        gameService={gameService}
        state={state}
      />
    </CloseButtonPanel>
  );
};

export const FlowerBountiesModal: React.FC<{
  readonly?: boolean;
  gameService: MachineInterpreter;
  state: GameState;
}> = ({ readonly, state, gameService }) => {
  const { t } = useAppTranslation();
  const expiresAt = useCountdown(weekResetsAt());
  const [deal, setDeal] = useState<BountyRequest>();

  const { bounties: exchange } = state;

  const deals = exchange.requests.filter((deal) => deal.name in FLOWERS);

  if (deal) {
    return (
      <Deal
        deal={deal}
        onClose={() => setDeal(undefined)}
        onSold={() => setDeal(undefined)}
        gameService={gameService}
        state={state}
      />
    );
  }

  return (
    <div className="p-1">
      <div className="flex flex-wrap items-center mb-2">
        <Label type="default" className="mr-2">
          {`Flower ${t("bounties.board")}`}
        </Label>
        <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
          <TimerDisplay time={expiresAt} />
        </Label>
      </div>

      <p className="text-xs mb-2">
        {t(readonly ? "bounties.board.travel" : "bounties.board.info")}
      </p>
      <div className="flex flex-wrap">
        {deals.length === 0 && (
          <p className="text-sm">{t("bounties.board.empty")}</p>
        )}
        {deals.map((deal) => {
          const isSold = !!state.bounties.completed.find(
            (request) => request.id === deal.id,
          );

          const isDisabled = !state.inventory[deal.name]?.gt(0);
          const { coins } = generateBountyCoins({
            game: state,
            bounty: deal,
          });

          return (
            <div
              key={deal.id}
              className={classNames("w-full pb-0.5", {
                "pointer-events-none": isSold || readonly,
              })}
            >
              <ButtonPanel
                disabled={isDisabled}
                variant={isSold ? "secondary" : "primary"}
                className="h-full"
                onClick={() => {
                  if (isDisabled || readonly) {
                    return;
                  }
                  setDeal(deal);
                }}
              >
                <div className="flex items-center">
                  <div className="relative mr-2">
                    <img
                      src={ITEM_DETAILS[deal.name].image}
                      className="h-8 z-20"
                    />
                  </div>
                  <div className="flex items-center flex-wrap justify-between w-full">
                    <p className="text-xs text-left leading-snug">
                      {deal.name}
                    </p>

                    {!isSold && !!deal.coins && (
                      <Label type="warning" icon={SUNNYSIDE.ui.coinsImg}>
                        {/* For Future proofing */}
                        {coins}
                      </Label>
                    )}

                    {!isSold &&
                      getKeys(deal.items ?? {}).map((name) => {
                        return (
                          <Label
                            key={name}
                            type="warning"
                            icon={ITEM_DETAILS[name].image}
                          >
                            {name !== getSeasonalTicket()
                              ? deal.items?.[name]
                              : generateBountyTicket({
                                  game: state,
                                  bounty: deal,
                                })}
                          </Label>
                        );
                      })}

                    {!!isSold && <Label type="success">{t("completed")}</Label>}
                  </div>
                </div>
              </ButtonPanel>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Deal: React.FC<{
  deal: BountyRequest;
  onClose: () => void;
  onSold: () => void;
  gameService: MachineInterpreter;
  state: GameState;
}> = ({ deal, onClose, onSold, gameService, state }) => {
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
    <>
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
              {name !== getSeasonalTicket()
                ? deal.items?.[name]
                : generateBountyTicket({
                    game: state,
                    bounty: deal,
                  })}
            </Label>
          ))}
        </div>

        <p>
          {deal.coins
            ? t("bounties.sell.coins", { amount: deal.coins })
            : t("bounties.sell.items", {
                amount: getKeys(deal.items ?? {})
                  .map(
                    (name) =>
                      `${
                        name !== getSeasonalTicket()
                          ? deal.items?.[name]
                          : generateBountyTicket({
                              game: state,
                              bounty: deal,
                            })
                      } x ${name}`,
                  )
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
    </>
  );
};
