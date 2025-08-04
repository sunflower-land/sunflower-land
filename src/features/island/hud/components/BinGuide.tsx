import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useGame } from "features/game/GameProvider";
import { getTrashBinItems } from "features/island/clutter/Clutter";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { secondsTillReset, secondsToString } from "lib/utils/time";
import React, { useState } from "react";

import binIcon from "assets/sfts/garbage_bin.webp";
import burnIcon from "assets/icons/flame.webp";
import {
  BIN_LIMIT_COST,
  getBinLimit,
} from "features/game/events/landExpansion/increaseBinLimit";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import Decimal from "decimal.js-light";
import broomIcon from "assets/icons/broom.webp";
import { hasFeatureAccess } from "lib/flags";

interface BinGuideProps {
  onClose: () => void;
}

export const BinGuide: React.FC<BinGuideProps> = ({ onClose }) => {
  const { t } = useAppTranslation();

  const [tab, setTab] = useState(0);

  const { gameState } = useGame();
  const trashBinItems = getTrashBinItems(gameState);

  return (
    <CloseButtonPanel
      setCurrentTab={setTab}
      currentTab={tab}
      tabs={[
        {
          name: "Bin",
          icon: binIcon,
        },
        {
          name: "Burn",
          icon: burnIcon,
        },
      ]}
      onClose={onClose}
    >
      {tab === 0 && <Bin onClose={onClose} />}
      {tab === 1 && <Burn />}
    </CloseButtonPanel>
  );
};

export const Bin: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useAppTranslation();

  const [showConfirmation, setShowConfirmation] = useState(false);

  const { gameState, gameService } = useGame();
  const trashBinItems = getTrashBinItems(gameState);

  const handleIncreaseLimit = () => {
    gameService.send("binLimit.increased");
    setShowConfirmation(false);
  };

  const hasResources = getObjectEntries(BIN_LIMIT_COST).every(
    ([item, amount]) =>
      gameState.context.visitorState?.inventory[item]?.gte(
        amount ?? new Decimal(0),
      ),
  );

  if (showConfirmation) {
    return (
      <>
        <div className="p-1">
          <Label type="danger" className="mb-2">
            {t("bin.increaseLimit")}
          </Label>
          <p className="text-sm mb-1">{t("bin.increaseLimit.description")}</p>
          {getObjectEntries(BIN_LIMIT_COST).map(([item, amount]) => (
            <span className="flex items-center" key={item}>
              {`${amount} x ${item}`}
            </span>
          ))}
        </div>
        <div className="flex">
          <Button className="mr-1" onClick={() => setShowConfirmation(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleIncreaseLimit}>{t("confirm")}</Button>
        </div>
      </>
    );
  }

  const binLimit = getBinLimit({
    game: gameState.context.visitorState!,
  });

  return (
    <>
      <div className="p-1">
        <div className="flex items-center justify-between">
          <Label type="default">{t("visitorGuide.binGuide")}</Label>
          <Label
            type={trashBinItems >= binLimit ? "danger" : "formula"}
          >{`${trashBinItems}/${binLimit}`}</Label>
        </div>
        <p className="text-sm my-1">{t("visitorGuide.binGuide.description")}</p>

        <div className="flex items-center">
          <img src={SUNNYSIDE.icons.stopwatch} className="h-6 mr-2" />
          <p className="text-xs my-2">
            {t("visitorGuide.binGuide.reset", {
              time: secondsToString(secondsTillReset(), { length: "short" }),
            })}
          </p>
        </div>

        {hasFeatureAccess(gameState.context.state, "BIN_LIMITS") && (
          <>
            <Label type="default" className="my-2" icon={broomIcon}>
              {t("bin.makeRoom")}
            </Label>
            <p className="text-sm mb-1">{t("bin.cantWait.description")}</p>
            <div className="flex flex-wrap space-x-2">
              {getObjectEntries(BIN_LIMIT_COST).map(([item, amount]) => (
                <RequirementLabel
                  key={item}
                  type="item"
                  item={item}
                  requirement={amount ?? new Decimal(0)}
                  balance={
                    gameState.context.visitorState?.inventory[item] ??
                    new Decimal(0)
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>

      <Button
        disabled={!hasResources}
        className="mr-1"
        onClick={() => setShowConfirmation(true)}
      >
        {t("bin.increaseLimit")}
      </Button>
    </>
  );
};

export const Burn: React.FC = () => {
  const { t } = useAppTranslation();

  return (
    <>
      <div className="p-1">
        <Label type="info" className="mb-2">
          {t("coming.soon")}
        </Label>
        <p className="text-sm">{t("visitorGuide.binGuide.burn.description")}</p>
      </div>
    </>
  );
};
