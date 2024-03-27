import React, { useState } from "react";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

import blockBucksIcon from "assets/icons/block_buck.png";
import exchangeIcon from "assets/icons/exchange.png";
import coinsIcon from "assets/icons/coins.webp";
import coinsStack from "assets/icons/coins_stack.webp";
import coinsScattered from "assets/icons/coins_scattered.webp";
import sflIcon from "assets/icons/sfl.webp";
import { SFL_TO_COIN_PACKAGES } from "features/game/events/landExpansion/exchangeSFLtoCoins";
import { OuterPanel } from "components/ui/Panel";
import { useTranslation } from "react-i18next";

const COIN_IMAGES = [coinsIcon, coinsScattered, coinsStack];

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const BuyCurrenciesModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);

  return (
    <Modal show={isOpen}>
      <CloseButtonPanel
        currentTab={tab}
        setCurrentTab={(tab) => {
          setTab(tab);
        }}
        onClose={onClose}
        tabs={[
          { icon: blockBucksIcon, name: `Buy` },
          { icon: exchangeIcon, name: `$SFL/Coins` },
        ]}
      >
        {tab === 0 && <div>{t("Buy")}</div>}
        {tab === 1 && (
          <div className="flex flex-col p-1 py-2 space-y-2">
            <Label icon={exchangeIcon} type="default">
              {`${t("exchange")} $SFL ${t("for")} Coins`}
            </Label>
            <div className="flex justify-between gap-1 text-[14px] sm:text-sm sm:gap-2">
              {Object.values(SFL_TO_COIN_PACKAGES).map((option, index) => (
                <OuterPanel
                  key={JSON.stringify(option)}
                  className="flex relative flex-col flex-1 items-center p-2"
                >
                  <span className="whitespace-nowrap mb-2">{`${option.coins} coins`}</span>
                  <div className="flex flex-1 justify-center items-center mb-6 w-full">
                    <img
                      src={COIN_IMAGES[index]}
                      alt="Coins"
                      className="w-2/5 sm:w-1/4"
                    />
                  </div>
                  <Label
                    icon={sflIcon}
                    type="warning"
                    iconWidth={11}
                    className="absolute h-7"
                    style={{
                      width: "106%",
                      bottom: "-8px",
                      left: "-2px",
                    }}
                  >
                    {`${option.sfl} $SFL`}
                  </Label>
                </OuterPanel>
              ))}
            </div>
          </div>
        )}
      </CloseButtonPanel>
    </Modal>
  );
};
