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
import type { MachineState } from "features/game/lib/gameMachine";
import type { AnimalBounty, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { getChapterTicket } from "features/game/types/chapters";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
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
        Object.values(animals).some((animal) =>
          isValidDeal({ animal, deal, game: state }),
        )
      ) {
        ids.add(deal.id);
      }
    });

    return ids;
  }, [deals, state, now]);

  // Cards only, but keep the reward-type grouping order: coins, gems, tickets.
  const orderedDeals = useMemo(() => {
    const coins = deals.filter((deal) => deal.coins !== undefined);
    const gems = deals.filter((deal) => deal.items?.Gem !== undefined);
    const tickets = deals.filter(
      (deal) => deal.coins === undefined && deal.items?.Gem === undefined,
    );

    return [...coins, ...gems, ...tickets];
  }, [deals]);

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
        className="relative shrink-0"
        style={{
          width: `${CARD_SIZE}px`,
          height: `${CARD_SIZE * 1.15}px`,
        }}
      >
        <ButtonPanel
          variant={isAvailable ? "primary" : "secondary"}
          disabled={!isAvailable}
          className={classNames("w-full h-full min-w-0", {
            "opacity-60": !isAvailable,
          })}
          onClick={() => onSelect(isSelected ? undefined : deal)}
        >
          <div className="h-full flex items-center justify-center pt-1 pb-4">
            <img src={ITEM_DETAILS[deal.name].image} className="w-[34px]" />
          </div>

          <Label
            type="formula"
            className="absolute -top-2 -left-2 whitespace-nowrap"
          >
            {t("bounties.minLevel", { level: deal.level })}
          </Label>

          {!!deal.coins && (
            <Label
              type="warning"
              icon={SUNNYSIDE.ui.coinsImg}
              className="absolute -bottom-1 text-center p-1"
              style={{
                left: `${PIXEL_SCALE * -3}px`,
                right: `${PIXEL_SCALE * -3}px`,
                width: `calc(100% + ${PIXEL_SCALE * 6}px)`,
                height: "25px",
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
              className="absolute -bottom-1 text-center p-1"
              style={{
                left: `${PIXEL_SCALE * -3}px`,
                right: `${PIXEL_SCALE * -3}px`,
                width: `calc(100% + ${PIXEL_SCALE * 6}px)`,
                height: "25px",
              }}
            >
              {name !== chapterTicket
                ? deal.items?.[name]
                : generateBountyTicket({ game: state, bounty: deal, now })}
            </Label>
          ))}
        </ButtonPanel>

        {isSold && (
          <img
            src={SUNNYSIDE.icons.confirm}
            alt={t("bounties.sold")}
            className="absolute z-30 -top-2 -right-1 pointer-events-none"
            style={{ width: `${PIXEL_SCALE * 7}px` }}
          />
        )}

        {isSelected && <SelectionCorners />}
      </div>
    );
  };

  return (
    <InnerPanel className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {deals.length > 0 ? (
        // Just the cards: a single scrolling row keeps the panel as short as
        // possible. Top/bottom padding leaves room for the cards' overhanging
        // level and reward labels.
        <div className="scrollable flex flex-nowrap items-start gap-x-3 overflow-x-auto overflow-y-hidden pl-3 pr-1 pt-2.5 pb-1.5">
          {orderedDeals.map(renderDealCard)}
        </div>
      ) : (
        <div className="h-20 flex items-center justify-center px-4">
          <span className="text-xs">{t("bounties.board.empty")}</span>
        </div>
      )}
    </InnerPanel>
  );
};
