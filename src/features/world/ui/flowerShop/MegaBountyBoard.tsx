import React, { useContext, useLayoutEffect, useState } from "react";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { millisecondsToString } from "lib/utils/time";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getWeekKey, weekResetsAt } from "features/game/lib/factions";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import classNames from "classnames";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { BountyRequest, InventoryItemName } from "features/game/types/game";
import { ANIMALS, getKeys } from "features/game/types/craftables";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import { SquareIcon } from "components/ui/SquareIcon";
import {
  getSeasonalArtefact,
  getSeasonalTicket,
} from "features/game/types/seasons";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { Decimal } from "decimal.js-light";
import {
  BOUNTY_CATEGORIES,
  generateBountyTicket,
} from "features/game/events/landExpansion/sellBounty";
import { Button } from "components/ui/Button";
import confetti from "canvas-confetti";
import flowerIcon from "assets/icons/flower_token.webp";
import { NO_BONUS_BOUNTIES_WEEK } from "features/game/events/landExpansion/claimBountyBonus";

export const MegaBountyBoard: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => (
  <CloseButtonPanel
    bumpkinParts={NPC_WEARABLES.poppy}
    onClose={onClose}
    container={OuterPanel}
    tabs={[{ icon: SUNNYSIDE.icons.stopwatch, name: "Mega Bounty Board" }]}
  >
    <MegaBountyBoardContent />
  </CloseButtonPanel>
);

export const MegaBountyBoardContent: React.FC<{ readonly?: boolean }> = ({
  readonly,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [selectedBounty, setSelectedBounty] = useState<BountyRequest>();
  const state = useSelector(gameService, (state) => state.context.state);
  const exchange = useSelector(
    gameService,
    (state) => state.context.state.bounties,
  );
  const endTime = weekResetsAt();
  const timeRemaining = endTime - Date.now();
  const showDanger = timeRemaining < 1000 * 60 * 60 * 24;

  const getBountiesByCategory = () => {
    const result: Record<
      string,
      { categoryName: string; bounties: BountyRequest[] }
    > = {};

    Object.entries(BOUNTY_CATEGORIES).forEach(([category, checkFn]) => {
      result[category] = {
        categoryName: category,
        bounties: exchange.requests.filter(checkFn),
      };
    });

    return result;
  };
  const bountiesByCategory = getBountiesByCategory();
  const allBounties = exchange.requests.filter(
    (bounty) => !Object.keys(ANIMALS).includes(bounty.name),
  );

  const getCurrencyInfo = (bounty: BountyRequest) => {
    // First check if this is an Obsidian bounty that rewards FLOWER tokens
    if (
      BOUNTY_CATEGORIES["Obsidian Bounties"](bounty) &&
      bounty.sfl &&
      bounty.sfl > 0
    ) {
      return {
        amount: bounty.sfl,
        icon: flowerIcon,
      };
    }

    // Otherwise handle item rewards
    const items = bounty.items ?? {};
    const seasonalTicket = getSeasonalTicket();
    const seasonalArtefact = getSeasonalArtefact();

    // Calculate bounty tickets if needed
    const bountyTickets = generateBountyTicket({
      game: state,
      bounty,
    });

    // Determine which reward currency to show, prioritizing seasonal items
    // First check seasonal ticket, then seasonal artefact, then fallback to first item
    let currency: InventoryItemName;
    if ((items[seasonalTicket] ?? 0) > 0) {
      currency = seasonalTicket;
    } else if ((items[seasonalArtefact] ?? 0) > 0) {
      currency = seasonalArtefact;
    } else {
      currency = getKeys(items)[0];
    }

    // Return amount (using bountyTickets for seasonal tickets) and icon
    return {
      amount:
        currency === seasonalTicket ? bountyTickets : items[currency] ?? 0,
      icon: ITEM_DETAILS[currency]?.image ?? "",
    };
  };

  const isAllBountiesCompleted = allBounties.every((bounty) =>
    exchange.completed.find((completed) => completed.id === bounty.id),
  );

  const currentWeek = getWeekKey();
  const noBonusBountiesWeek = NO_BONUS_BOUNTIES_WEEK.includes(currentWeek);
  const seasonalTicket = getSeasonalTicket();

  const isBonusClaimed = () => {
    const now = Date.now();
    const weekStart = new Date(currentWeek).getTime();
    const weekEnd = weekResetsAt();
    const lastClaim = exchange.bonusClaimedAt ?? 0;
    return lastClaim > weekStart && lastClaim < now && now < weekEnd;
  };

  const bonusClaimed = isBonusClaimed();

  const handleBonusClaim = () => gameService.send("claim.bountyBoardBonus");

  return (
    <>
      {selectedBounty && (
        <ModalOverlay
          show={!!selectedBounty}
          onBackdropClick={() => setSelectedBounty(undefined)}
        >
          <Deal
            bounty={selectedBounty}
            onClose={() => setSelectedBounty(undefined)}
            onSold={() => setSelectedBounty(undefined)}
            isSold={
              !!exchange.completed.find(
                (request) => request.id === selectedBounty.id,
              )
            }
            readonly={readonly}
          />
        </ModalOverlay>
      )}
      <InnerPanel className="flex flex-col gap-2 mb-1">
        <div className="flex justify-between px-2 flex-wrap pb-1">
          <Label type="default" className="mb-1">
            {"Poppy"}
          </Label>
          <Label
            icon={SUNNYSIDE.icons.stopwatch}
            type={showDanger ? "danger" : "info"}
            className="mb-1"
          >
            {t("megaStore.timeRemaining", {
              timeRemaining: millisecondsToString(timeRemaining, {
                length: "medium",
                removeTrailingZeros: true,
              }),
            })}
          </Label>
        </div>

        <div
          className={classNames("flex flex-col p-2 pt-1", {
            ["max-h-[450px] overflow-y-auto scrollable"]: !readonly,
          })}
        >
          <span className="text-xs pb-1">
            {readonly
              ? t("megaBountyBoard.message")
              : t("megaBountyBoard.msg1")}
          </span>

          <div className="flex flex-col gap-4">
            {Object.values(bountiesByCategory).every(
              ({ bounties }) => bounties.length === 0,
            ) ? (
              <p className="text-sm">{t("bounties.board.empty")}</p>
            ) : (
              getObjectEntries(bountiesByCategory).map(
                ([category, { categoryName, bounties }]) => {
                  if (bounties.length === 0) return null;
                  return (
                    <div key={category}>
                      <Label type="default" className="mb-2">
                        {categoryName}
                      </Label>
                      <div className="flex gap-2 flex-wrap">
                        {bounties.map((bounty) => {
                          const { amount, icon } = getCurrencyInfo(bounty);
                          const isSold = !!exchange.completed.find(
                            (request) => request.id === bounty.id,
                          );
                          return (
                            <div
                              key={bounty.name}
                              className="flex flex-col space-y-1"
                            >
                              <div
                                className="bg-brown-600 cursor-pointer relative"
                                style={pixelDarkBorderStyle}
                                onClick={() => setSelectedBounty(bounty)}
                              >
                                <div className="flex justify-center items-center w-full h-full z-20">
                                  <SquareIcon
                                    icon={
                                      ITEM_DETAILS[bounty.name]?.image ?? ""
                                    }
                                    width={20}
                                  />
                                  {isSold && (
                                    <img
                                      src={SUNNYSIDE.icons.confirm}
                                      className="absolute -right-2 -top-3"
                                      style={{
                                        width: `${PIXEL_SCALE * 9}px`,
                                      }}
                                      alt="Completed"
                                    />
                                  )}
                                  <div className="absolute px-4 bottom-3 -left-4 object-contain">
                                    <Label
                                      icon={icon}
                                      type="warning"
                                      className="text-xxs absolute center text-center p-1"
                                      style={{
                                        width: `calc(100% + ${PIXEL_SCALE * 10}px)`,
                                        height: "24px",
                                      }}
                                    >
                                      {amount}
                                    </Label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                },
              )
            )}
          </div>
        </div>
      </InnerPanel>
      {!noBonusBountiesWeek && !readonly && (
        <InnerPanel className="flex flex-col justify-center gap-2">
          <div className="flex items-center gap-2 justify-between">
            <Label
              type="default"
              className="ml-1"
              icon={ITEM_DETAILS[seasonalTicket].image}
            >
              {`Bounty Bonus`}
            </Label>
            {isAllBountiesCompleted && (
              <Label
                type="success"
                className="ml-1"
                secondaryIcon={
                  bonusClaimed ? SUNNYSIDE.icons.confirm : undefined
                }
              >
                {t("bounties.bonus.allCompleted")}
              </Label>
            )}
          </div>
          <p className="text-xs ml-1">
            {t("bounties.bonus.getBonus", { seasonalTicket })}
          </p>
          {!readonly && (
            <Button
              onClick={handleBonusClaim}
              disabled={bonusClaimed || !isAllBountiesCompleted || readonly}
            >
              {t("bounties.bonus.clickToClaim", { seasonalTicket })}
            </Button>
          )}
        </InnerPanel>
      )}
    </>
  );
};

const Deal: React.FC<{
  bounty: BountyRequest;
  onClose: () => void;
  onSold: () => void;
  isSold: boolean;
  readonly?: boolean;
}> = ({ bounty, onClose, onSold, isSold, readonly }) => {
  const [imageWidth, setImageWidth] = useState(0);
  const [confirmExchange, setConfirmExchange] = useState(false);
  const { t } = useAppTranslation();
  const { gameService, showAnimations } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);
  const inventory = state.inventory;
  const buttonHandler = () => {
    if (!confirmExchange) {
      setConfirmExchange(true);
      return;
    }

    sell();
  };

  const canSell = () => {
    if (BOUNTY_CATEGORIES["Mark Bounties"](bounty)) {
      return inventory[bounty.name]?.gte(bounty.quantity);
    }

    if (isSold) {
      return false;
    }

    return inventory[bounty.name]?.gte(1);
  };

  const sell = () => {
    gameService.send("bounty.sold", {
      requestId: bounty.id,
    });
    if (showAnimations) confetti();
    setConfirmExchange(false);

    onSold();
  };

  useLayoutEffect(() => {
    const imgElement = new Image();

    imgElement.onload = function () {
      const trueWidth = imgElement.width;
      const scaledWidth = trueWidth * PIXEL_SCALE;

      setImageWidth(scaledWidth);
    };

    imgElement.src = ITEM_DETAILS[bounty.name].image;
  }, []);

  return (
    <InnerPanel className="shadow">
      <>
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center w-full">
            <div style={{ width: `${PIXEL_SCALE * 9}px` }} />
            <span className="flex-1 text-center">{bounty.name}</span>
            <img
              src={SUNNYSIDE.icons.close}
              className="cursor-pointer"
              onClick={onClose}
              style={{
                width: `${PIXEL_SCALE * 9}px`,
              }}
            />
          </div>

          <div className="w-full p-2 px-1">
            <div className="flex">
              <div
                className="w-[40%] relative min-w-[40%] rounded-md overflow-hidden shadow-md mr-2 flex justify-center items-center h-32"
                style={{
                  backgroundImage: `url(${SUNNYSIDE.ui.grey_background})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <img
                  src={ITEM_DETAILS[bounty.name].image}
                  alt={bounty.name}
                  className={"w-full"}
                  style={{
                    width: `${imageWidth}px`,
                  }}
                />
              </div>
              <div className="flex flex-col space-y-2 justify-around">
                <span className="text-xs leading-none">
                  {ITEM_DETAILS[bounty.name].description}
                </span>
                <div className="flex flex-1 content-start flex-col flex-wrap">
                  <RequirementLabel
                    type="item"
                    item={bounty.name}
                    balance={inventory[bounty.name] ?? new Decimal(0)}
                    requirement={
                      BOUNTY_CATEGORIES["Mark Bounties"](bounty)
                        ? new Decimal(bounty.quantity)
                        : new Decimal(1)
                    }
                  />
                </div>
                {getKeys(bounty.items ?? {}).map((name) => {
                  return (
                    <Label
                      key={name}
                      type={isSold ? "success" : "warning"}
                      icon={ITEM_DETAILS[name].image}
                      secondaryIcon={
                        isSold ? SUNNYSIDE.icons.confirm : undefined
                      }
                    >
                      {`Reward: ${
                        name !== getSeasonalTicket()
                          ? bounty.items?.[name]
                          : generateBountyTicket({
                              game: state,
                              bounty,
                            })
                      } ${name}s`}
                    </Label>
                  );
                })}
                {BOUNTY_CATEGORIES["Obsidian Bounties"](bounty) &&
                  bounty.sfl && (
                    <Label
                      type={isSold ? "success" : "warning"}
                      icon={flowerIcon}
                      secondaryIcon={
                        isSold ? SUNNYSIDE.icons.confirm : undefined
                      }
                    >
                      {`Reward: ${bounty.sfl ?? 0} FLOWER`}
                    </Label>
                  )}
              </div>
            </div>
          </div>
        </div>
        {!readonly && (
          <div
            className={classNames("flex w-full", {
              "space-x-1": confirmExchange,
            })}
          >
            {confirmExchange && (
              <Button onClick={() => setConfirmExchange(false)}>
                {t("cancel")}
              </Button>
            )}

            <Button disabled={!canSell()} onClick={buttonHandler}>
              {confirmExchange ? t("confirm") : t("sell")}
            </Button>
          </div>
        )}
      </>
    </InnerPanel>
  );
};
