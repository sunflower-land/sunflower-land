import { useAuth } from "features/auth/lib/Provider";
import { useGame } from "features/game/GameProvider";
import React, { useState } from "react";
import { ClaimBlessingReward } from "./ClaimBlessing";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { Label } from "components/ui/Label";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import Decimal from "decimal.js-light";
import { NumberInput } from "components/ui/NumberInput";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import useSWR from "swr";
import { getBlessingResults } from "../actions/getBlessingResults";
import { Loading } from "features/auth/components";
import { SomethingWentWrong } from "features/auth/components/SomethingWentWrong";
import classNames from "classnames";
import { getKeys } from "features/game/types/decorations";

interface Props {
  onClose: () => void;
}
export const Blessings: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState(0);

  return (
    <CloseButtonPanel
      tabs={[
        {
          name: "Offering",
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
    </CloseButtonPanel>
  );
};

export const BlessingOffer: React.FC<Props> = ({ onClose }) => {
  const { gameState, gameService } = useGame();
  const { authState } = useAuth();
  const { t } = useAppTranslation();

  const [page, setPage] = useState(10);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [amount, setAmount] = useState<Decimal>(new Decimal(0));

  const { offering, offered } = gameState.context.state.blessing;

  const offer = () => {
    gameService.send("blessing.offered", {
      effect: {
        type: "blessing.offered",
        amount: amount.toNumber(),
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
          <div className="text-sm my-2">{`${amount.toNumber()} x ${offering.item}`}</div>
          <div className="text-xs italic">{t("blessing.offeringWarning")}</div>
        </div>
        <Button onClick={offer}>{t("blessing.confirm")}</Button>
      </>
    );
  }

  if (page === 0) {
    return (
      <SpeakingText
        message={[
          {
            text: t("blessing.greetings"),
          },
          {
            text: t("blessing.seasonBlooming", {
              season: gameState.context.state.season.season,
            }),
          },
        ]}
        onClose={() => setPage(1)}
      />
    );
  }

  const inventory =
    gameState.context.state.inventory[offering.item] ?? new Decimal(0);

  return (
    <div>
      <div className="flex justify-between mb-1">
        <Label type="default">{t("blessing.offerTitle")}</Label>
        <Label type="formula">{new Date().toISOString().slice(0, 10)}</Label>
      </div>
      <p className="text-xs m-1">{t("blessing.guardiansSeek")}</p>
      <div className="flex items-center">
        <Box image={ITEM_DETAILS[offering.item].image} count={inventory} />
        <div className="ml-2">
          <p className="text-sm">{offering.item}</p>
          <p className="text-xs">
            {t("blessing.chooseAmount", { name: offering.item })}
          </p>
        </div>
      </div>
      <NumberInput
        value={amount}
        maxDecimalPlaces={0}
        onValueChange={setAmount}
        className="mb-1"
      />
      {amount.lt(10) && (
        <Label type="danger" className="my-2">
          {t("blessing.minimumRequired", { amount: 10 })}
        </Label>
      )}
      {amount.gt(inventory) && (
        <Label type="danger" className="my-2">
          {t("blessing.maxAmount", {
            name: offering.item,
            amount: inventory.toNumber(),
          })}
        </Label>
      )}
      <Button
        disabled={amount.lt(10) || amount.gt(inventory)}
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
  const { gameState, gameService } = useGame();
  const { authState } = useAuth();

  const previousDayKey = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const {
    data: response,
    isLoading,
    error,
    mutate,
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
        <Label type="formula">{previousDayKey}</Label>
        <p className="py-2 text-sm">{t("blessing.noResults")}</p>
      </div>
    );
  }

  return (
    <div className="max-h-[500px] overflow-y-auto scrollable">
      <Label type="formula">{previousDayKey}</Label>
      <div className="flex m-1 items-center">
        <img
          src={ITEM_DETAILS[response.data.item].image}
          className="w-6 mr-1"
        />
        <span>
          {t("blessing.donated", {
            amount: Number(response.data.total).toLocaleString(),
            item: response.data.item,
          })}
        </span>
      </div>
      <div className="flex m-1 items-center">
        <img src={SUNNYSIDE.icons.player} className="w-6 mr-1" />
        <span>
          {t("blessing.winners", {
            count: response.data.winners.length,
          })}
        </span>
      </div>

      <table className="w-full text-xs table-auto border-collapse">
        <tbody>
          {response.data.winners.map(({ farmId, reward }, index) => (
            <tr
              key={index}
              className={classNames({
                "bg-[#ead4aa]": index % 2 === 0,
              })}
            >
              <td className="p-1.5">{`#${farmId}`}</td>
              <td className="p-1.5 text-left pl-8 relative truncate flex">
                {getKeys(reward?.items ?? {}).map((key) => (
                  <img
                    key={key}
                    src={ITEM_DETAILS[key].image}
                    className="w-4 mr-1"
                  />
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
