import React, { useContext, useMemo } from "react";
import { useSelector } from "@xstate/react";
import classNames from "classnames";

import { SUNNYSIDE } from "assets/sunnyside";
import { ButtonPanel, InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { isValidDeal } from "features/game/events/landExpansion/sellAnimal";
import {
  generateBountyCoins,
  generateBountyTicket,
} from "features/game/events/landExpansion/sellBounty";
import { Context } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { weekResetsAt } from "features/game/lib/factions";
import type { MachineState } from "features/game/lib/gameMachine";
import type { AnimalBounty, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { getChapterTicket } from "features/game/types/chapters";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { useNow } from "lib/utils/hooks/useNow";
import { getKeys } from "lib/object";

const _game = (state: MachineState) => state.context.state;
const CARD_SIZE = PIXEL_SCALE * 28;
const SELECT_CORNER_SIZE = PIXEL_SCALE * 8;

interface Props {
  animalTypes: InventoryItemName[];
  selectedDeal?: AnimalBounty;
  onSelect: (deal?: AnimalBounty) => void;
}

export const SelectionCorners: React.FC = () => (
  <div className="absolute inset-0 z-40 pointer-events-none">
    <img
      src={SUNNYSIDE.ui.selectBoxTL}
      className="absolute top-0 left-0"
      style={{ width: `${SELECT_CORNER_SIZE}px` }}
    />
    <img
      src={SUNNYSIDE.ui.selectBoxTR}
      className="absolute top-0 right-0"
      style={{ width: `${SELECT_CORNER_SIZE}px` }}
    />
    <img
      src={SUNNYSIDE.ui.selectBoxBL}
      className="absolute bottom-0 left-0"
      style={{ width: `${SELECT_CORNER_SIZE}px` }}
    />
    <img
      src={SUNNYSIDE.ui.selectBoxBR}
      className="absolute bottom-0 right-0"
      style={{ width: `${SELECT_CORNER_SIZE}px` }}
    />
  </div>
);

export const AnimalBountyQuickPanel: React.FC<Props> = ({
  animalTypes,
  selectedDeal,
  onSelect,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _game);
  const now = useNow({ live: true, intervalMs: 60_000 });
  const chapterTicket = getChapterTicket(now);
  const expiresAt = useCountdown(weekResetsAt());

  const deals = useMemo(
    () =>
      (
        (state.bounties.requests ?? []).filter((deal) =>
          animalTypes.includes(deal.name),
        ) as AnimalBounty[]
      ).sort((a, b) => a.level - b.level),
    [state.bounties.requests, animalTypes],
  );

  const availableDealIds = useMemo(() => {
    // isValidDeal checks Date.now(), so refresh eligibility with the clock.
    void now;
    const ids = new Set<string>();

    deals.forEach((deal) => {
      const animals =
        deal.name === "Chicken" ? state.henHouse.animals : state.barn.animals;

      if (
        Object.values(animals).some((animal) => isValidDeal({ animal, deal }))
      ) {
        ids.add(deal.id);
      }
    });

    return ids;
  }, [deals, state.henHouse.animals, state.barn.animals, now]);

  const dealGroups = useMemo(() => {
    const coins = deals.filter((deal) => deal.coins !== undefined);
    const gems = deals.filter((deal) => deal.items?.Gem !== undefined);
    const tickets = deals.filter(
      (deal) => deal.coins === undefined && deal.items?.Gem === undefined,
    );

    return [
      {
        id: "coins",
        label: t("bountyType.label", { type: "coins" }),
        icon: SUNNYSIDE.ui.coinsImg,
        deals: coins,
      },
      {
        id: "gems",
        label: t("bountyType.label", { type: "Gem" }),
        icon: ITEM_DETAILS.Gem.image,
        deals: gems,
      },
      {
        id: "tickets",
        label: t("bountyType.label", { type: chapterTicket }),
        icon: ITEM_DETAILS[chapterTicket].image,
        deals: tickets,
      },
    ].filter((group) => group.deals.length > 0);
  }, [deals, chapterTicket, t]);

  const renderDealCard = (deal: AnimalBounty) => {
    const isSold = state.bounties.completed.some(
      (completed) => completed.id === deal.id,
    );
    const isAvailable = !isSold && availableDealIds.has(deal.id);
    const isSelected = selectedDeal?.id === deal.id;
    const { coins } = generateBountyCoins({ game: state, bounty: deal });

    return (
      <div
        key={deal.id}
        className={classNames("relative shrink-0", {
          "opacity-60": !isAvailable,
        })}
        style={{
          width: `${CARD_SIZE}px`,
          height: `${CARD_SIZE * 1.25}px`,
        }}
      >
        <ButtonPanel
          variant={isAvailable ? "primary" : "secondary"}
          disabled={!isAvailable}
          className="w-full h-full min-w-0"
          onClick={() => onSelect(isSelected ? undefined : deal)}
        >
          <div className="h-full flex items-center justify-center pt-2 pb-5">
            <img src={ITEM_DETAILS[deal.name].image} className="w-[34px]" />
          </div>

          <Label
            type="formula"
            className="absolute -top-3 -left-1 whitespace-nowrap text-xxs"
          >
            {t("bounties.minLevel", { level: deal.level })}
          </Label>

          {isSold && (
            <Label type="success" className="absolute -top-2 -right-1 text-xxs">
              {t("bounties.sold")}
            </Label>
          )}

          {!!deal.coins && (
            <Label
              type="warning"
              icon={SUNNYSIDE.ui.coinsImg}
              className="absolute text-center text-xxs p-1"
              style={{
                left: `${PIXEL_SCALE * -2}px`,
                bottom: `${PIXEL_SCALE * -2}px`,
                width: `calc(100% + ${PIXEL_SCALE * 4}px)`,
                height: "23px",
              }}
            >
              {coins}
            </Label>
          )}

          {getKeys(deal.items ?? {}).map((name) => (
            <Label
              key={name}
              type="warning"
              icon={ITEM_DETAILS[name].image}
              className="absolute text-center text-xxs p-1"
              style={{
                left: `${PIXEL_SCALE * -2}px`,
                bottom: `${PIXEL_SCALE * -2}px`,
                width: `calc(100% + ${PIXEL_SCALE * 4}px)`,
                height: "23px",
              }}
            >
              {name !== chapterTicket
                ? deal.items?.[name]
                : generateBountyTicket({ game: state, bounty: deal, now })}
            </Label>
          ))}
        </ButtonPanel>

        {isSelected && <SelectionCorners />}
      </div>
    );
  };

  return (
    <InnerPanel className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-1">
        <Label type="default">{t("bounties.board")}</Label>
        <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
          <TimerDisplay time={expiresAt} />
        </Label>
      </div>
      <p className="text-xs mb-2">{t("bounties.board.info")}</p>

      <div className="scrollable min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-1">
        {deals.length > 0 ? (
          <div className="flex flex-col py-2 sm:flex-row sm:flex-wrap sm:items-start sm:gap-x-3 sm:gap-y-3">
            {dealGroups.map((group) => (
              <div
                key={group.id}
                className="mb-3 sm:w-fit sm:flex-none sm:mb-0"
              >
                <Label type="default" icon={group.icon} className="mb-2 ml-2">
                  {group.label}
                </Label>
                <div className="flex flex-wrap gap-x-1 gap-y-2">
                  {group.deals.map(renderDealCard)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-20 flex items-center justify-center px-4">
            <span className="text-xs">{t("bounties.board.empty")}</span>
          </div>
        )}
      </div>
      {deals.length > 0 && (
        <p className="text-xs mt-1">
          {t("bounties.board.ticketAmount", { chapterTicket })}
        </p>
      )}
    </InnerPanel>
  );
};
