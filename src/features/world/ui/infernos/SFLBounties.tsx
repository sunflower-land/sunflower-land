import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { Label } from "components/ui/Label";
import { ButtonPanel } from "components/ui/Panel";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { Context } from "features/game/GameProvider";
import { weekResetsAt } from "features/game/lib/factions";
import { MachineState } from "features/game/lib/gameMachine";
import {
  BountyRequest,
  GameState,
  ObsidianBounty,
} from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NPC_WEARABLES } from "lib/npcs";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import React, { useContext, useState } from "react";
import { Deal } from "../flowerShop/FlowerBounties";
import sflIcon from "assets/icons/flower_token.webp";

interface Props {
  readonly?: boolean;
  onClose: () => void;
}

const _state = (state: MachineState) => state.context.state;

export const SFLBounties: React.FC<Props> = ({ readonly, onClose }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);

  const [showIntro, setShowIntro] = useState(
    !state.farmActivity["Obsidian Bountied"],
  );

  if (showIntro && !readonly) {
    return (
      <SpeakingModal
        message={[
          {
            text: t("bounties.sfl.intro.one"),
          },
          {
            text: t("bounties.sfl.intro.two"),
          },
        ]}
        bumpkinParts={NPC_WEARABLES.gilda}
        onClose={() => {
          setShowIntro(false);
        }}
      />
    );
  }

  return (
    <CloseButtonPanel bumpkinParts={NPC_WEARABLES.gilda} onClose={onClose}>
      <SFLBountiesModal readonly={readonly} state={state} />
    </CloseButtonPanel>
  );
};

export const SFLBountiesModal: React.FC<{
  readonly?: boolean;
  state: GameState;
}> = ({ readonly, state }) => {
  const { t } = useAppTranslation();
  const expiresAt = useCountdown(weekResetsAt());
  const [deal, setDeal] = useState<BountyRequest>();
  const { bounties: exchange, inventory } = state;

  const deals = exchange.requests.filter(
    (deal) => (deal as ObsidianBounty).sfl,
  ) as ObsidianBounty[];

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
          {`FLOWER ${t("bounties.board")}`}
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

                    {!isSold && (
                      <Label type="warning" icon={sflIcon}>
                        {deal.sfl}
                      </Label>
                    )}

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
