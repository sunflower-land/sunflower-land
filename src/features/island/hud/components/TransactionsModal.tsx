import React, { useContext, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";

import flowerIcon from "assets/icons/flower_token.webp";
import vipIcon from "assets/icons/vip.webp";
import coinsIcon from "assets/icons/coins.webp";
import gemIcon from "assets/icons/gem.webp";
import walletIcon from "assets/icons/wallet.png";

type TransactionPage = "menu" | "deposit" | "vip" | "gems" | "swap";

type PageButtonOptions = {
  page: TransactionPage;
  icon: string | { primary: string; secondary?: string };
  label: string;
};

const PageButton: React.FC<{
  option: PageButtonOptions;
  onClick: () => void;
}> = ({ option, onClick }) => (
  <Button onClick={onClick} className="relative">
    <div className="w-full flex justify-center items-center">
      {typeof option.icon === "string" ? (
        <img
          src={option.icon}
          className="w-6 absolute left-0 top-1/2 -translate-y-1/2"
        />
      ) : (
        <div>
          <img
            src={option.icon.primary}
            className="w-6 absolute left-0 top-1/2 -translate-y-1/2"
          />
          {option.icon.secondary && (
            <img
              src={option.icon.secondary}
              className="w-6 absolute left-2.5 top-1/2 -translate-y-1/2 z-10"
            />
          )}
        </div>
      )}
      {option.label}
    </div>
  </Button>
);

type Props = {
  show: boolean;
  initialPage?: TransactionPage;
  onClose: () => void;
};

export const TransactionsModal: React.FC<Props> = ({ show, onClose }) => {
  const { gameService } = useContext(Context);
  const [page, setPage] = useState<TransactionPage>("menu");
  const { t } = useAppTranslation();

  const transactionOptions: PageButtonOptions[] = [
    {
      page: "vip",
      icon: vipIcon,
      label: t("season.vip.purchase"),
    },
    {
      page: "gems",
      icon: gemIcon,
      label: t("transaction.buy.gems"),
    },
    {
      page: "deposit",
      icon: flowerIcon,
      label: t("transaction.deposit.flower"),
    },
    {
      page: "swap",
      icon: { primary: flowerIcon, secondary: coinsIcon },
      label: t("transaction.swap.flowerForCoins"),
    },
  ];

  return (
    <Modal show={show} onHide={onClose}>
      <Panel className="w-full h-full p-2">
        <div className="flex justify-between mb-1">
          <div className="flex space-x-1">
            {page !== "menu" && (
              <img
                src={SUNNYSIDE.icons.arrow_left}
                className="w-6"
                onClick={() => setPage("menu")}
              />
            )}
            <Label type="default" className="flex items-center gap-2">
              <img src={walletIcon} className="w-4" />
              {t("transaction.menu.title")}
            </Label>
          </div>
          <img src={SUNNYSIDE.icons.close} className="w-6 h-6" />
        </div>
        <div className="flex flex-col gap-1">
          {transactionOptions.map((option) => (
            <PageButton
              key={option.page}
              option={option}
              onClick={() => setPage(option.page)}
            />
          ))}
        </div>
      </Panel>
    </Modal>
  );
};
