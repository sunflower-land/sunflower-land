import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import React, { useEffect, useState } from "react";
import minting from "assets/npcs/minting.gif";
import { secondsToString } from "lib/utils/time";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Loading } from "features/auth/components";

interface Props {
  readyAt: number;
  onComplete: () => void;
}

export const NFTWaiting: React.FC<Props> = ({ readyAt, onComplete }) => {
  const [secondsLeft, setSecondsLeft] = useState((readyAt - Date.now()) / 1000);
  const { t } = useAppTranslation();
  const active = readyAt >= Date.now();

  useEffect(() => {
    if (active) {
      const interval = setInterval(() => {
        setSecondsLeft((readyAt - Date.now()) / 1000);

        if (Date.now() > readyAt) {
          onComplete();
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [active]);

  return (
    <>
      <div className="p-2">
        <div className="flex justify-between items-center mb-3">
          <Label icon={SUNNYSIDE.resource.pirate_bounty} type="default">
            {t("nftminting.mintAccountNFT")}
          </Label>
          <p className="text-sm">
            {secondsToString(secondsLeft, { length: "medium" })}
          </p>
        </div>

        <p className="text-sm">{t("nftminting.mintingYourNFT")}</p>

        <img src={minting} className="w-40 mt-2" />
      </div>
    </>
  );
};

export const NFTMinting: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <>
      <div className="p-2">
        <div className="flex justify-between items-center mb-3">
          <Label icon={SUNNYSIDE.resource.pirate_bounty} type="default">
            {t("nftminting.mintAccountNFT")}
          </Label>
        </div>

        <Loading text={t("minting")} />

        <img src={minting} className="w-40 mt-2" />
      </div>
    </>
  );
};

export const NFTMigrating: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <>
      <div className="p-2">
        <div className="flex justify-between items-center mb-3">
          <Label icon={SUNNYSIDE.resource.pirate_bounty} type="default">
            {t("nftminting.mintAccountNFT")}
          </Label>
        </div>

        <Loading text={t("nftminting.almostThere")} />

        <img src={minting} className="w-40 mt-2" />
      </div>
    </>
  );
};
