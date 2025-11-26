import { useAuth } from "features/auth/lib/Provider";
import { useGame } from "features/game/GameProvider";
import React, { useState } from "react";
import { ClaimBlessingReward } from "./ClaimBlessing";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { Label } from "components/ui/Label";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import Decimal from "decimal.js-light";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import useSWR from "swr";
import { getBlessingResults } from "../actions/getBlessingResults";
import { Loading } from "features/auth/components";
import { SomethingWentWrong } from "features/auth/components/SomethingWentWrong";
import classNames from "classnames";
import flowerIcon from "assets/icons/flower_token.webp";
import coinIcon from "assets/icons/coins.webp";

import autumnGuardian from "assets/sfts/autumn_guardian.webp";
import springGuardian from "assets/sfts/spring_guardian.webp";
import summerGuardian from "assets/sfts/summer_guardian.webp";
import winterGuardian from "assets/sfts/winter_guardian.webp";
import {
  InventoryItemName,
  TemperateSeasonName,
} from "features/game/types/game";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { interpretTokenUri } from "lib/utils/tokenUriBuilder";
import { NumberInput } from "components/ui/NumberInput";
import { MAX_INVENTORY_ITEMS } from "features/game/lib/processEvent";
import giftIcon from "assets/icons/gift.png";
import { Maintenance } from "features/auth/components/Maintenance";
import { useNow } from "lib/utils/hooks/useNow";

const SEASON_GUARDIANS: Record<TemperateSeasonName, string> = {
  autumn: autumnGuardian,
  spring: springGuardian,
  summer: summerGuardian,
  winter: winterGuardian,
};

export type BlessingInput = Extract<
  InventoryItemName,
  // Legacy beta testing
  | "Kale"
  // Real
  | "Basic Bear"
  | "Doll"
  | "Sand"
  | "Crab"
  | "Tuna"
  | "Red Snapper"
>;

const BLESSING_AMOUNTS: Record<BlessingInput, number> = {
  Kale: 100,
  "Basic Bear": 10,
  Doll: 5,
  Sand: 50,
  Crab: 50,
  Tuna: 10,
  "Red Snapper": 10,
};

interface Props {
  onClose: () => void;
}
export const Blessings: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState(0);
  const { gameState } = useGame();
  const { t } = useAppTranslation();

  const season = gameState.context.state.season.season;

  const guardian = SEASON_GUARDIANS[season as TemperateSeasonName];

  return (
    <>
      <img src={guardian} className="absolute -top-24 w-48 " />

      <CloseButtonPanel
        tabs={[
          {
            name: t("blessing.tribute"),
            icon: SUNNYSIDE.icons.heart,
          },
          {
            name: "Results",
            icon: SUNNYSIDE.icons.search,
          },
        ]}
        currentTab={tab}
        setCurrentTab={setTab}
        onClose={onClose}
      >
        {tab === 0 && <BlessingOffer onClose={onClose} />}
        {tab === 1 && <BlessingResults onClose={onClose} />}
        <Label type="info" className="absolute top-1 right-10">
          {t("beta")}
        </Label>
      </CloseButtonPanel>
    </>
  );
};

export const BlessingOffer: React.FC<Props> = ({ onClose }) => {
  const { gameState, gameService } = useGame();
  const { authState } = useAuth();
  const { t } = useAppTranslation();

  const [page, setPage] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [amount, setAmount] = useState(1);

  const now = useNow();

  const { offering, offered } = gameState.context.state.blessing;

  const offer = () => {
    gameService.send("blessing.offered", {
      effect: {
        type: "blessing.offered",
        amount,
        item: offering.item,
      },
      authToken: authState.context.user.rawToken as string,
    });
  };

  if (offered) {
    return <ClaimBlessingReward onClose={onClose} />;
  }

  if (showConfirmation) {
    return (
      <>
        <Label type="danger">{t("blessing.areYouSure")}</Label>
        <div className="p-1">
          <div className="text-sm">{t("blessing.confirmOffering")}</div>
          <div className="text-sm my-2">{`${amount} x ${offering.item}`}</div>
          <div className="text-xs italic">{t("blessing.offeringWarning")}</div>
        </div>
        <Button onClick={offer}>{t("blessing.confirm")}</Button>
      </>
    );
  }

  if (now >= new Date("2025-10-07T00:00:00Z").getTime()) {
    return <Maintenance />;
  }

  if (page === 0) {
    return (
      <SpeakingText
        message={[
          {
            text: t("blessing.greetings"),
          },
          {
            text: t("blessing.beta"),
          },
        ]}
        onClose={() => setPage(1)}
      />
    );
  }

  const inventory =
    gameState.context.state.inventory[offering.item] ?? new Decimal(0);

  const max = MAX_INVENTORY_ITEMS[offering.item as InventoryItemName] ?? 10000;
  return (
    <div>
      <div className="flex justify-between mb-1">
        <Label type="default">{t("blessing.offerTitle")}</Label>
        <Label type="formula">{`${new Date().toISOString().slice(0, 10)}`}</Label>
      </div>
      <p className="text-xs m-1">{t("blessing.guardiansSeek")}</p>
      <p className="text-xs m-1">{t("blessing.random")}</p>

      <div className="flex items-center">
        <Box image={ITEM_DETAILS[offering.item].image} count={inventory} />
        <div>
          <p className="text-xs ml-1">{`${amount} x ${offering.item}`}</p>

          <NumberInput
            value={amount}
            onValueChange={(value) => setAmount(value.toNumber())}
            maxDecimalPlaces={0}
            isOutOfRange={
              new Decimal(amount).gt(inventory) || new Decimal(amount).gt(max)
            }
          />
        </div>
      </div>
      {new Decimal(amount).gt(inventory) && (
        <Label type="danger" className="my-2">
          {t("blessing.maxAmount", {
            name: offering.item,
            amount: inventory.toNumber(),
          })}
        </Label>
      )}
      {new Decimal(amount).gt(max) && (
        <Label type="danger" className="my-2">
          {t("blessing.maxAmountHoarding", {
            name: offering.item,
            amount: max,
          })}
        </Label>
      )}
      <Button
        disabled={
          new Decimal(amount).gt(inventory) ||
          new Decimal(amount).gt(max) ||
          new Decimal(amount).lt(1)
        }
        onClick={() => setShowConfirmation(true)}
      >
        {t("blessing.offer")}
      </Button>
    </div>
  );
};

const fetcher = async ([token, date]: [string, string]) => {
  return getBlessingResults({ token, date });
};

export const BlessingResults: React.FC<Props> = ({ onClose }) => {
  const { authState } = useAuth();

  const now = useNow();

  const previousDayKey = new Date(now - 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const {
    data: response,
    isLoading,
    error,
  } = useSWR([authState.context.user.rawToken!, previousDayKey], fetcher);

  const { t } = useAppTranslation();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <SomethingWentWrong />;
  }

  if (!response?.data) {
    return (
      <div>
        <div className="flex justify-between">
          <Label type="default">{t("blessings.results")}</Label>
          <Label type="formula">{previousDayKey}</Label>
        </div>
        <p className="p-2 text-sm">{t("blessing.noResults")}</p>
        <Button onClick={onClose}>{t("close")}</Button>
      </div>
    );
  }

  const icon =
    response.data.prize === "Flower"
      ? flowerIcon
      : response.data.prize === "Coin"
        ? coinIcon
        : ITEM_DETAILS[response.data.prize].image;

  // Sort winners
  const leaderboard = response.data.leaderboard ?? [];

  const prizeAmount = response.data.prizeAmount;

  return (
    <div className="max-h-[500px] overflow-y-auto scrollable">
      <Label type="formula">{`Yesterday - ${previousDayKey}`}</Label>
      <div className="flex m-1 items-center">
        <img
          src={ITEM_DETAILS[response.data.item].image}
          className="w-6 mr-2"
        />
        <div>
          <p className="text-sm">{`${Number(response.data.total).toLocaleString()} x ${response.data.item} Donated`}</p>
          <p className="text-xs">{`${response.data.participantCount} players`}</p>
        </div>
        {/* <span>
          {t("blessing.donated", {
            amount: Number(response.data.total).toLocaleString(),
            item: response.data.item,
          })}
        </span> */}
      </div>
      <div className="flex m-1 items-center">
        <img src={giftIcon} className="w-6 mr-2" />
        <div>
          <p className="text-sm">{`${Number(prizeAmount).toLocaleString()} x ${response.data.item} Rewarded`}</p>
          <p className="text-xs">{`${response.data.winnerCount ?? 0} winners`}</p>
        </div>
        {/* <span>
          {t("blessing.prize", {
            players: response.data.winnerCount ?? 0,
            amount: Number(prizeAmount).toLocaleString(),
            item: response.data.item,
          })}
        </span> */}
      </div>

      <table className="w-full text-xs table-auto border-collapse mt-4">
        <tbody>
          {leaderboard.map(
            ({ username, uri, amount, rank, isWinner }, index) => {
              return (
                <tr
                  key={index}
                  className={classNames({
                    "bg-[#ead4aa]": index % 2 === 0,
                    "bg-red-400": isWinner === false,
                  })}
                >
                  <td className="p-1.5 text-left pl-8 relative truncate">
                    {!!rank && `${rank}. `}
                    {uri && (
                      <div
                        className="absolute"
                        style={{ left: "4px", top: "1px" }}
                      >
                        <NPCIcon
                          width={24}
                          parts={interpretTokenUri(uri).equipped}
                        />
                      </div>
                    )}
                    {username}
                  </td>
                  <td className="p-1.5 text-left pl-8 relative truncate flex">
                    <span className="text-xs">{amount}</span>
                    <img src={icon} className="h-4 ml-1" />
                  </td>
                </tr>
              );
            },
          )}
        </tbody>
      </table>

      <p className="text-xs m-2 italic">{t("blessing.random")}</p>

      <Button className="mt-2" onClick={onClose}>
        {t("close")}
      </Button>
    </div>
  );
};
