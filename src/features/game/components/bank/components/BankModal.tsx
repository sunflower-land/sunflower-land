import React, { useContext, useState } from "react";

import wallet from "assets/icons/wallet.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";

import { Withdraw } from "./Withdraw";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";

interface Props {
  farmAddress: string;
  onClose: () => void;
}

export const BankModal: React.FC<Props> = ({ onClose, farmAddress }) => {
  const { gameService } = useContext(Context);
  const [tab, setTab] = useState<"deposit" | "withdraw">("deposit");
  const { t } = useAppTranslation();

  return (
    <Panel className="relative" hasTabs>
      <div
        className="absolute flex"
        style={{
          top: `${PIXEL_SCALE * 1}px`,
          left: `${PIXEL_SCALE * 1}px`,
          right: `${PIXEL_SCALE * 1}px`,
        }}
      >
        <Tab isActive={tab === "withdraw"} onClick={() => setTab("withdraw")}>
          <img src={wallet} className="h-5 mr-2" />
          <span className="text-sm">{t("withdraw")}</span>
        </Tab>
        <img
          src={SUNNYSIDE.icons.close}
          className="absolute cursor-pointer z-20"
          onClick={onClose}
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            right: `${PIXEL_SCALE * 1}px`,
            width: `${PIXEL_SCALE * 11}px`,
          }}
        />
      </div>
      <Withdraw onClose={onClose} />
    </Panel>
  );
};
