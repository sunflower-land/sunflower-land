import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { ButtonPanel } from "components/ui/Panel";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import {
  BOUNTY_CATEGORIES,
  generateBountyCoins,
  generateBountyTicket,
} from "features/game/events/landExpansion/sellBounty";
import { Context } from "features/game/GameProvider";
import { weekResetsAt } from "features/game/lib/factions";
import { MachineState } from "features/game/lib/gameMachine";
import { getKeys } from "features/game/types/decorations";
import { BountyRequest, GameState } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { getChapterTicket } from "features/game/types/chapters";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NPC_WEARABLES } from "lib/npcs";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { useNow } from "lib/utils/hooks/useNow";
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
      <FlowerBountiesModal readonly={readonly} state={state} />
    </CloseButtonPanel>
  );
};

export const FlowerBountiesModal: React.FC<{
  readonly?: boolean;
  state: GameState;
}> = ({ readonly, state }) => {
  const { t } = useAppTranslation();
  const now = useNow();
  const ticket = getChapterTicket(now);
  const expiresAt = useCountdown(weekResetsAt());
  const [deal, setDeal] = useState<BountyRequest>();
  const { bounties: exchange, inventory } = state;

  const deals = exchange.requests.filter(BOUNTY_CATEGORIES["Flower Bounties"]);

  if (deal) {
    return (
      <Deal
        deal={deal}
        onClose={() => setDeal(undefined)}
        onSold={() => setDeal(undefined)}
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
          const isSold = !!exchange.completed.find(
            (request) => request.id === deal.id,
          );

          const isDisabled = !inventory[deal.name]?.gt(0);
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
                            {name !== ticket
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

export const Deal: React.FC<{
  deal: BountyRequest;
  onClose: () => void;
  onSold: () => void;
  state: GameState;
}> = ({ deal, onClose, onSold, state }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const now = useNow();
  const ticket = getChapterTicket(now);
  const sell = () => {
    gameService.send({ type: "bounty.sold", requestId: deal.id });

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
              {name !== ticket
                ? deal.items?.[name]
                : generateBountyTicket({
                    game: state,
                    bounty: deal,
                  })}
            </Label>
          ))}
        </div>

        <p>
          {deal.coins && t("bounties.sell.coins", { amount: deal.coins })}
          {BOUNTY_CATEGORIES["Obsidian Bounties"](deal) &&
            t("bounties.sell.sfl", {
              amount: deal.sfl ?? 0,
            })}
          {deal.items &&
            t("bounties.sell.items", {
              amount: getKeys(deal.items ?? {})
                .map(
                  (name) =>
                    `${
                      name !== ticket
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
