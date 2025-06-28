import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { Button } from "components/ui/Button";
import { HudContainer } from "components/ui/HudContainer";
import { Label } from "components/ui/Label";
import { ButtonPanel, InnerPanel, Panel } from "components/ui/Panel";
import { getSickAnimalRewardAmount } from "features/game/events/landExpansion/sellAnimal";
import {
  generateBountyCoins,
  generateBountyTicket,
} from "features/game/events/landExpansion/sellBounty";
import { Context } from "features/game/GameProvider";
import { getAnimalLevel } from "features/game/lib/animals";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { weekResetsAt } from "features/game/lib/factions";
import { MachineState } from "features/game/lib/gameMachine";
import { getKeys } from "features/game/types/decorations";
import {
  Animal,
  AnimalBounty,
  BountyRequest,
  InventoryItemName,
} from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { getSeasonalTicket } from "features/game/types/seasons";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NPC_WEARABLES } from "lib/npcs";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import React, { useContext, useMemo } from "react";

const _exchange = (state: MachineState) => state.context.state.bounties;

interface Props {
  type: InventoryItemName[];
  onExchanging: (deal: AnimalBounty) => void;
}

export const AnimalBounties: React.FC<Props> = ({ type, onExchanging }) => {
  const { gameService } = useContext(Context);
  const exchange = useSelector(gameService, _exchange);

  const { t } = useAppTranslation();

  const state = gameService.getSnapshot().context.state;
  const { requests = [] } = exchange;

  const deals = requests.filter((deal) =>
    type.includes(deal.name),
  ) as AnimalBounty[];

  const expiresAt = useCountdown(weekResetsAt());
  const hasDeals = deals.length > 0;

  const dealsByType = useMemo(() => {
    const grouped = deals.reduce(
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
    Object.values(grouped).forEach((deals) => {
      deals.sort((a, b) => a.level - b.level);
    });

    return grouped;
  }, [deals]);

  return (
    <InnerPanel className="overflow-y-auto max-h-[500px] scrollable">
      <div className="p-1">
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
              <div className="flex flex-wrap">
                {sortedDeals.map((deal) => (
                  <BountyCard
                    key={deal.id}
                    deal={deal}
                    onExchanging={onExchanging}
                    state={state}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {hasDeals && (
          <div className="flex items-center">
            <p className="text-xs">
              {t("bounties.board.ticketAmount", {
                seasonalTicket: getSeasonalTicket(),
              })}
            </p>
          </div>
        )}
      </div>
    </InnerPanel>
  );
};

export const AnimalDeal: React.FC<{
  deal: BountyRequest;
  animal: Animal;
  onClose: () => void;
  onSold: () => void;
}> = ({ deal, animal, onClose, onSold }) => {
  const { gameService } = useContext(Context);
  const state = gameService.getSnapshot().context.state;

  const { t } = useAppTranslation();
  const sell = () => {
    gameService.send("animal.sold", {
      requestId: deal.id,
      animalId: animal.id.toString(),
    });

    onSold();
  };

  if (!deal || !animal) {
    return null;
  }

  const { coins } = generateBountyCoins({
    game: state,
    bounty: deal,
  });

  return (
    <>
      {animal.state === "sick" ? (
        <Panel bumpkinParts={NPC_WEARABLES.grabnab}>
          <div className="p-2">
            <p className="mb-1">{t("bounties.sell.animal.sick")}</p>
            <div className="flex flex-col space-y-1 my-3">
              {deal.coins && (
                <div className="flex items-center space-x-1">
                  <Label
                    type="warning"
                    icon={SUNNYSIDE.ui.coinsImg}
                    className="text-sm"
                  >
                    {`x ${getSickAnimalRewardAmount(coins)} coins`}
                  </Label>
                </div>
              )}
              {getKeys(deal.items ?? {}).map((name) => {
                let amount = deal.items?.[name] ?? 0;
                const now = Date.now();

                if (name === getSeasonalTicket(new Date(now))) {
                  amount = generateBountyTicket({
                    game: state,
                    bounty: deal,
                    now,
                  });
                }

                return (
                  <div className="flex items-center space-x-1" key={name}>
                    <Label
                      type="warning"
                      icon={ITEM_DETAILS[name].image}
                      className="text-sm"
                    >
                      {`x ${getSickAnimalRewardAmount(amount)} ${name}`}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex space-x-1">
            <Button onClick={onClose}>{t("cancel")}</Button>
            <Button onClick={sell}>{t("confirm")}</Button>
          </div>
        </Panel>
      ) : (
        <Panel>
          <div className="p-2">
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

              {getKeys(deal.items ?? {}).map((name) => {
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
                </Label>;
              })}
            </div>

            <p>
              {deal.coins
                ? t("bounties.sell.coins", { amount: coins })
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
        </Panel>
      )}
    </>
  );
};

export const ExchangeHud: React.FC<{
  deal: AnimalBounty;
  onClose: () => void;
}> = ({ deal, onClose }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = gameService.getSnapshot().context.state;

  const { coins } = generateBountyCoins({
    game: state,
    bounty: deal,
  });

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

            {getKeys(deal.items ?? {}).map((name) => {
              <Label key={name} type="warning" icon={ITEM_DETAILS[name].image}>
                {deal.items?.[name]}
              </Label>;
            })}
          </div>
          <p className="text-xs">
            {t("bounties.animal.select", { name: deal.name })}
          </p>
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
}

const BountyCard: React.FC<BountyCardProps> = ({
  deal,
  onExchanging,
  state,
}) => {
  const { t } = useAppTranslation();

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
            {name !== getSeasonalTicket()
              ? deal.items?.[name]
              : generateBountyTicket({
                  game: state,
                  bounty: deal,
                })}
          </Label>
        ))}
      </ButtonPanel>
    </div>
  );
};
