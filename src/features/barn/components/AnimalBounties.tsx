import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { Button } from "components/ui/Button";
import { HudContainer } from "components/ui/HudContainer";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { ButtonPanel, InnerPanel, Panel } from "components/ui/Panel";
import {
  getSickAnimalRewardAmount,
  isValidDeal,
} from "features/game/events/landExpansion/sellAnimal";
import {
  generateBountyCoins,
  generateBountyTicket,
} from "features/game/events/landExpansion/sellBounty";
import { Context, useGame } from "features/game/GameProvider";
import { getAnimalLevel } from "features/game/lib/animals";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { weekResetsAt } from "features/game/lib/factions";
import type { MachineState } from "features/game/lib/gameMachine";
import { useIsMobile } from "lib/utils/hooks/useIsMobile";
import { getKeys } from "lib/object";
import type {
  Animal,
  AnimalBounty,
  BountyRequest,
  GameState,
  InventoryItemName,
} from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getChapterTicket,
  getCurrentChapter,
} from "features/game/types/chapters";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NPC_WEARABLES } from "lib/npcs";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { useNow } from "lib/utils/hooks/useNow";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import chapterPoints from "assets/icons/red_medal_short.webp";

import { getChapterTaskPoints } from "features/game/types/tracks";
import { BulkBountyAnimalPicker, BulkBountyCard } from "./BulkBountyCard";

const _game = (state: MachineState) => state.context.state;

interface Props {
  type: InventoryItemName[];
  onExchanging: (deal: AnimalBounty) => void;
  reward?: "coins" | "tickets";
  readonly?: boolean;
}

/**
 * Renders a reward amount, showing a strikethrough original alongside the
 * sick-discounted amount when they differ. Shared by the single-sell
 * AnimalDeal confirmation so the sick reward reduction is easy to compare.
 */
export const renderSickRewardLabel = (
  amount: number,
  label: string,
  icon: string,
) => {
  const sickAmount = getSickAnimalRewardAmount(amount);

  if (amount === sickAmount) {
    return (
      <Label type="warning" icon={icon} className="text-sm">
        {`x ${sickAmount} ${label}`}
      </Label>
    );
  }

  return (
    <>
      <Label type="warning" icon={icon} className="text-sm">
        <span className="line-through">{`x ${amount} ${label}`}</span>
      </Label>
      <Label type="warning" icon={icon} className="text-sm">
        {`x ${sickAmount} ${label}`}
      </Label>
    </>
  );
};

const ConfirmButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
}> = ({ children, className, onClick }) => {
  const mountedAt = useNow(); // live:false → stable snapshot at mount
  const { totalSeconds } = useCountdown(mountedAt + 1000);

  return (
    <Button className={className} disabled={totalSeconds > 0} onClick={onClick}>
      {children}
    </Button>
  );
};

export const AnimalBounties: React.FC<Props> = ({
  type,
  onExchanging,
  reward,
  readonly,
}) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _game);
  const exchange = state.bounties;

  const { t } = useAppTranslation();
  const now = useNow({ live: true, intervalMs: 60_000 });
  const chapterTicket = getChapterTicket(now);
  const { requests = [] } = exchange;
  const isMobile = useIsMobile();

  const [confirmationSale, setConfirmationSale] = useState<{
    deal: AnimalBounty;
    animalId: string;
  }>();
  // Only one bounty card's animal list may be expanded at a time.
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(
    null,
  );
  const expandedPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!expandedRequestId) return;

    const animationFrame = window.requestAnimationFrame(() => {
      expandedPickerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [expandedRequestId]);

  const eligibleAnimalsByRequest = useMemo(() => {
    const map: Record<string, Animal[]> = {};
    requests.forEach((request) => {
      if (!type.includes(request.name)) return;
      const animals =
        request.name === "Chicken"
          ? state.henHouse.animals
          : state.barn.animals;
      map[request.id] = Object.values(animals).filter((animal) =>
        isValidDeal({ animal, deal: request }),
      );
    });
    return map;
  }, [requests, type, state.henHouse.animals, state.barn.animals]);

  const handleSellAnimal = (deal: AnimalBounty, animalId: string) => {
    const currentState = gameService.getSnapshot().context.state;
    const currentAnimal =
      deal.name === "Chicken"
        ? currentState.henHouse.animals[animalId]
        : currentState.barn.animals[animalId];
    const isCompleted = currentState.bounties.completed.some(
      (completed) => completed.id === deal.id,
    );

    if (
      !currentAnimal ||
      isCompleted ||
      !isValidDeal({ animal: currentAnimal, deal })
    ) {
      return;
    }

    const hasUpcomingMutant = !!currentAnimal.reward?.items?.[0]?.name;

    if (currentAnimal.state === "sick" || hasUpcomingMutant) {
      setConfirmationSale({ deal, animalId });
      return;
    }

    gameService.send("animal.sold", {
      requestId: deal.id,
      animalId,
    });
    setExpandedRequestId(null);
  };

  const { deals, dealsByType } = useMemo(() => {
    let filtered = requests.filter((deal) =>
      type.includes(deal.name),
    ) as AnimalBounty[];

    if (reward === "tickets") {
      filtered = filtered.filter(
        (deal) => deal.items?.[chapterTicket] !== undefined,
      );
    }

    const grouped = filtered.reduce(
      (acc, deal) => {
        if (deal.coins !== undefined) {
          acc.coins = acc.coins ?? [];
          acc.coins.push(deal);
          return acc;
        }

        Object.keys(deal.items ?? {}).forEach((item) => {
          acc[item] = acc[item] ?? [];
          acc[item].push(deal);
        });

        return acc;
      },
      {} as Record<string, AnimalBounty[]>,
    );

    // Sort each array by level
    Object.values(grouped).forEach((arr) => {
      arr.sort((a, b) => a.level - b.level);
    });

    return { deals: filtered, dealsByType: grouped };
  }, [requests, type, reward, chapterTicket]);

  const expiresAt = useCountdown(weekResetsAt());
  const hasDeals = deals.length > 0;

  return (
    <InnerPanel
      className={classNames({
        "overflow-y-auto max-h-[500px] scrollable": !readonly,
      })}
    >
      <div className="p-1" onClick={() => setExpandedRequestId(null)}>
        <div className="flex justify-between items-center mb-2">
          <Label type="default">{t("bounties.board")}</Label>
          {hasDeals && (
            <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
              <TimerDisplay time={expiresAt} />
            </Label>
          )}
        </div>

        {hasDeals && <p className="text-xs mb-3">{t("bounties.board.info")}</p>}
        {deals.length === 0 && (
          <p className="text-xs mb-3">{t("bounties.board.empty")}</p>
        )}

        {Object.entries(dealsByType).map(([itemType, deals]) => {
          // Sort deals by animal type first, then by level
          const sortedDeals = [...deals].sort((a, b) => {
            if (a.name !== b.name) {
              return a.name.localeCompare(b.name);
            }
            return a.level - b.level;
          });
          const cardsPerRow = isMobile ? 3 : 4;
          const dealRows = Array.from(
            { length: Math.ceil(sortedDeals.length / cardsPerRow) },
            (_, index) =>
              sortedDeals.slice(index * cardsPerRow, (index + 1) * cardsPerRow),
          );

          return (
            <div key={itemType}>
              <Label
                type="default"
                icon={
                  itemType === "coins"
                    ? SUNNYSIDE.ui.coinsImg
                    : ITEM_DETAILS[itemType as InventoryItemName].image
                }
                className="mb-3 capitalize"
              >
                {t("bountyType.label", { type: itemType })}
              </Label>
              {!readonly ? (
                <div>
                  {dealRows.map((row, rowIndex) => {
                    const isExpandedDeal = (deal: AnimalBounty) =>
                      deal.id === expandedRequestId &&
                      !state.bounties.completed.some(
                        (completed) => completed.id === deal.id,
                      ) &&
                      (eligibleAnimalsByRequest[deal.id]?.length ?? 0) > 0;
                    const expandedDeal = row.find(isExpandedDeal);
                    const expandedColumn = row.findIndex(isExpandedDeal);

                    return (
                      <React.Fragment
                        key={`${itemType}-${rowIndex}-${row[0]?.id}`}
                      >
                        <div className="flex">
                          {row.map((deal) => (
                            <BulkBountyCard
                              key={deal.id}
                              deal={deal}
                              state={state}
                              now={now}
                              eligibleAnimals={
                                eligibleAnimalsByRequest[deal.id] ?? []
                              }
                              isSold={
                                !!state.bounties.completed.find(
                                  (completed) => completed.id === deal.id,
                                )
                              }
                              isExpanded={isExpandedDeal(deal)}
                              onExpandedChange={(isExpanded) =>
                                setExpandedRequestId(
                                  isExpanded ? deal.id : null,
                                )
                              }
                            />
                          ))}
                        </div>

                        {expandedDeal && (
                          <div ref={expandedPickerRef}>
                            <BulkBountyAnimalPicker
                              deal={expandedDeal}
                              anchorColumn={expandedColumn}
                              cardsPerRow={cardsPerRow}
                              eligibleAnimals={
                                eligibleAnimalsByRequest[expandedDeal.id] ?? []
                              }
                              onSell={(animal) =>
                                handleSellAnimal(expandedDeal, animal.id)
                              }
                            />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-wrap">
                  {sortedDeals.map((deal) => (
                    <BountyCard
                      key={deal.id}
                      deal={deal}
                      onExchanging={onExchanging}
                      state={state}
                      now={now}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {hasDeals && (
          <div className="flex items-center">
            <p className="text-xs">
              {t("bounties.board.ticketAmount", { chapterTicket })}
            </p>
          </div>
        )}
      </div>

      <Modal
        show={!!confirmationSale}
        onHide={() => setConfirmationSale(undefined)}
      >
        <AnimalDeal
          deal={confirmationSale?.deal}
          animalId={confirmationSale?.animalId}
          onClose={() => setConfirmationSale(undefined)}
          onSold={() => {
            setConfirmationSale(undefined);
            setExpandedRequestId(null);
          }}
        />
      </Modal>
    </InnerPanel>
  );
};

export const AnimalDeal: React.FC<{
  deal?: BountyRequest;
  animalId?: string;
  onClose: () => void;
  onSold: () => void;
}> = ({ deal, animalId, onClose, onSold }) => {
  const { gameService, gameState } = useGame();
  const state = gameState.context.state;
  const [animalOverride, setAnimalOverride] = useState<{
    animalId: string;
    animal: Animal;
    showStateChangeWarning: boolean;
  }>();
  const renderedAnimalState = useRef<Animal["state"] | undefined>(undefined);
  const now = useNow({ live: true, intervalMs: 60_000 });
  const { t } = useAppTranslation();
  const chapterTicket = getChapterTicket(now);

  const getAnimal = (state: GameState) => {
    if (!deal || !animalId) return undefined;

    return deal.name === "Chicken"
      ? state.henHouse.animals[animalId]
      : state.barn.animals[animalId];
  };

  const activeAnimalOverride =
    animalOverride?.animalId === animalId ? animalOverride : undefined;
  const animal = activeAnimalOverride?.animal ?? getAnimal(state);
  const showStateChangeWarning =
    activeAnimalOverride?.showStateChangeWarning ?? false;
  const hasUpcomingMutant = !!animal?.reward?.items?.[0]?.name;

  const confirmationKey = `${animalId ?? ""}-${animal?.state ?? ""}-${
    showStateChangeWarning ? "changed" : "current"
  }-${hasUpcomingMutant ? "mutant" : "regular"}`;

  useEffect(() => {
    if (animal) {
      renderedAnimalState.current = animal.state;
    }
  }, [animal, animal?.state]);

  // Guard against transient undefined props
  if (!deal || !animalId || !animal) {
    return null;
  }

  const sell = () => {
    const currentState = gameService.getSnapshot().context.state;
    const currentAnimal = getAnimal(currentState);
    const isCompleted = currentState.bounties.completed.some(
      (completed) => completed.id === deal.id,
    );

    if (
      !currentAnimal ||
      isCompleted ||
      !isValidDeal({ animal: currentAnimal, deal })
    ) {
      onClose();
      return;
    }

    if (renderedAnimalState.current !== currentAnimal.state) {
      setAnimalOverride({
        animalId,
        animal: currentAnimal,
        showStateChangeWarning: true,
      });
      return;
    }

    gameService.send("animal.sold", {
      requestId: deal.id,
      animalId,
    });

    onSold();
  };

  const { coins } = generateBountyCoins({
    game: state,
    bounty: deal,
  });

  const tickets = deal.items?.[chapterTicket] ?? 0;
  const chapter = getCurrentChapter(now);

  let pointsAwarded = 0;

  if (tickets > 0) {
    let points = 0;

    points = generateBountyTicket({
      game: state,
      bounty: deal,
      now,
    });

    if (animal.state === "sick") {
      points = getSickAnimalRewardAmount(points);
    }

    pointsAwarded = getChapterTaskPoints({ task: "bounty", points });
  }

  const mutantWarning = hasUpcomingMutant && (
    <div className="mb-2">
      <Label type="info" className="mb-1">
        {t("sleepingAnimal.mutantClue1", { type: animal.type })}
      </Label>
      <p>{t("sleepingAnimal.mutantClue2")}</p>
    </div>
  );

  return (
    <>
      {animal.state === "sick" ? (
        <Panel bumpkinParts={NPC_WEARABLES.grabnab}>
          <div className="p-2">
            {showStateChangeWarning && (
              <Label type="danger" className="mb-2">
                {t("bounties.sell.animal.stateChanged")}
              </Label>
            )}
            {mutantWarning}
            <p className="mb-1">{t("bounties.sell.animal.sick")}</p>
            <Label type="danger" className="my-2">
              {t("bounties.sell.animal.sickReducedBounty")}
            </Label>
            {!hasUpcomingMutant && (
              <div className="flex flex-col space-y-1 my-3">
                {deal.coins && (
                  <div className="flex items-center space-x-1">
                    {renderSickRewardLabel(
                      coins,
                      "coins",
                      SUNNYSIDE.ui.coinsImg,
                    )}
                  </div>
                )}
                {getKeys(deal.items ?? {}).map((name) => {
                  let amount = deal.items?.[name] ?? 0;

                  if (name === chapterTicket) {
                    amount = generateBountyTicket({
                      game: state,
                      bounty: deal,
                      now,
                    });
                  }

                  return (
                    <div className="flex items-center space-x-1" key={name}>
                      {renderSickRewardLabel(
                        amount,
                        name,
                        ITEM_DETAILS[name].image,
                      )}
                    </div>
                  );
                })}

                {!!deal.items?.[chapterTicket] && (
                  <Label type={"vibrant"} icon={chapterPoints} className="ml-2">
                    {`+${pointsAwarded} ${chapter} points.`}
                  </Label>
                )}
              </div>
            )}
          </div>
          <div className="flex space-x-1">
            <Button onClick={onClose}>{t("cancel")}</Button>
            <ConfirmButton key={confirmationKey} onClick={sell}>
              {t("confirm")}
            </ConfirmButton>
          </div>
        </Panel>
      ) : (
        <Panel
          bumpkinParts={hasUpcomingMutant ? NPC_WEARABLES.grabnab : undefined}
        >
          <div className="p-2">
            {showStateChangeWarning && (
              <Label type="danger" className="mb-2">
                {t("bounties.sell.animal.stateChanged")}
              </Label>
            )}
            {mutantWarning}
            {!hasUpcomingMutant && (
              <div className="mb-2 flex flex-wrap">
                <Label
                  type="default"
                  icon={ITEM_DETAILS[animal.type].image}
                  className="mr-2"
                >
                  {`Lvl ${getAnimalLevel(animal.experience, animal.type)} ${animal.type}`}
                </Label>
                {!!deal.coins && (
                  <Label type="warning" icon={SUNNYSIDE.ui.coinsImg}>
                    {coins}
                  </Label>
                )}

                {getKeys(deal.items ?? {}).map((name) => (
                  <Label
                    key={name}
                    type="warning"
                    icon={ITEM_DETAILS[name].image}
                  >
                    {name !== chapterTicket
                      ? deal.items?.[name]
                      : generateBountyTicket({
                          game: state,
                          bounty: deal,
                          now,
                        })}
                  </Label>
                ))}

                {!!deal.items?.[chapterTicket] && (
                  <Label type={"vibrant"} icon={chapterPoints} className="ml-2">
                    {`+${pointsAwarded} ${chapter} points.`}
                  </Label>
                )}
              </div>
            )}

            <p>
              {deal.coins
                ? t("bounties.sell.coins", { amount: coins })
                : t("bounties.sell.items", {
                    amount: getKeys(deal.items ?? {})
                      .map(
                        (name) =>
                          `${
                            name !== chapterTicket
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
        </Panel>
      )}
    </>
  );
};

export const ExchangeHud: React.FC<{
  deal: AnimalBounty;
  onClose: () => void;
  validAnimalsCount: number;
}> = ({ deal, onClose, validAnimalsCount }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = gameService.getSnapshot().context.state;
  const now = useNow({ live: true, intervalMs: 60_000 });
  const chapterTicket = getChapterTicket(now);

  const { coins } = generateBountyCoins({
    game: state,
    bounty: deal,
  });

  const width =
    deal.name === "Cow" ? "160px" : deal.name === "Sheep" ? "170px" : "180px";

  return (
    <HudContainer>
      <div className="absolute items-start flex top-3 px-2 cursor-pointer z-10 w-full justify-between">
        <InnerPanel>
          <div className="flex flex-wrap">
            <Label type="default" className="mr-2">
              {`Lvl ${deal.level}+`}
            </Label>

            {!!deal.coins && (
              <Label type="warning" icon={SUNNYSIDE.ui.coinsImg}>
                {coins}
              </Label>
            )}

            {getKeys(deal.items ?? {}).map((name) => (
              <Label key={name} type="warning" icon={ITEM_DETAILS[name].image}>
                {name !== chapterTicket
                  ? deal.items?.[name]
                  : generateBountyTicket({
                      game: state,
                      bounty: deal,
                      now,
                    })}
              </Label>
            ))}
          </div>

          <div className="text-xs mt-1">
            {validAnimalsCount > 0 ? (
              <p>{t("bounties.animal.select", { name: deal.name })} </p>
            ) : (
              <p style={{ width }}>
                {t("bounties.animal.noAnimalToSell", { name: deal.name })}
              </p>
            )}
          </div>
        </InnerPanel>

        <img
          src={SUNNYSIDE.ui.disc_cancel}
          alt="Cancel"
          className="cursor-pointer z-10"
          style={{
            width: `${PIXEL_SCALE * 18}px`,
          }}
          onClick={onClose}
        />
      </div>
    </HudContainer>
  );
};

interface BountyCardProps {
  deal: AnimalBounty;
  onExchanging: (deal: AnimalBounty) => void;
  state: MachineState["context"]["state"];
  now: number;
}

const BountyCard: React.FC<BountyCardProps> = ({
  deal,
  onExchanging,
  state,
  now,
}) => {
  const { t } = useAppTranslation();
  const chapterTicket = getChapterTicket(now);

  const isSold = !!state.bounties.completed.find(
    (request) => request.id === deal.id,
  );

  const { coins } = generateBountyCoins({
    game: state,
    bounty: deal,
  });

  return (
    <div
      className={classNames("w-1/3 sm:w-1/4 pr-1.5 pb-1.5", {
        "pointer-events-none": isSold,
      })}
    >
      <ButtonPanel
        variant={isSold ? "secondary" : "primary"}
        onClick={() => onExchanging(deal)}
      >
        <div className="flex justify-center items-center my-2 mb-6">
          <div className="relative">
            <img src={ITEM_DETAILS[deal.name].image} className="w-10 z-20" />
          </div>
        </div>

        <Label
          type="formula"
          className="absolute -top-3.5 -left-2"
        >{`Lvl ${deal.level}+`}</Label>

        {isSold && (
          <Label
            type="success"
            className="absolute -top-3.5 text-center p-1"
            style={{
              right: `${PIXEL_SCALE * -3}px`,
              height: "25px",
            }}
          >
            {t("bounties.sold")}
          </Label>
        )}

        {/* Show coins if it's a coin bounty */}
        {deal.coins && (
          <Label
            type="warning"
            icon={SUNNYSIDE.ui.coinsImg}
            className="absolute -bottom-2 text-center p-1"
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

        {/* Show items if it's an item bounty */}
        {getKeys(deal.items ?? {}).map((name) => (
          <Label
            key={name}
            type="warning"
            icon={ITEM_DETAILS[name].image}
            className="absolute -bottom-2 text-center p-1"
            style={{
              left: `${PIXEL_SCALE * -3}px`,
              right: `${PIXEL_SCALE * -3}px`,
              width: `calc(100% + ${PIXEL_SCALE * 6}px)`,
              height: "25px",
            }}
          >
            {name !== chapterTicket
              ? deal.items?.[name]
              : generateBountyTicket({
                  game: state,
                  bounty: deal,
                  now,
                })}
          </Label>
        ))}
      </ButtonPanel>
    </div>
  );
};
