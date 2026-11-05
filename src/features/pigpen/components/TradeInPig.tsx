import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { HudContainer } from "components/ui/HudContainer";
import { Label } from "components/ui/Label";
import { InnerPanel, Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { getBountyLevel, getPigBristles } from "features/game/lib/animals";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type { MachineState } from "features/game/lib/gameMachine";
import type { Animal } from "features/game/types/game";
import {
  getTranslatedItemName,
  ITEM_DETAILS,
} from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const _game = (state: MachineState) => state.context.state;

/**
 * Shown while the player picks a Pig to trade in - the trade-in twin of the
 * bounty `ExchangeHud`.
 */
export const TradeInHud: React.FC<{
  eligibleCount: number;
  onClose: () => void;
}> = ({ eligibleCount, onClose }) => {
  const { t } = useAppTranslation();

  return (
    <HudContainer>
      <div className="absolute items-start flex top-3 px-2 cursor-pointer z-10 w-full justify-between">
        <InnerPanel>
          <Label type="warning" icon={ITEM_DETAILS["Pig Bristles"].image}>
            {t("pigs.tradeIn")}
          </Label>
          <div className="text-xs mt-1">
            <p>
              {eligibleCount > 0
                ? t("pigs.tradeIn.select")
                : t("pigs.tradeIn.noPig")}
            </p>
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

/**
 * Confirms a Pig trade-in: the level it is paid for, the Bristles it pays
 * (boosts included), the 25% cut when it is sick and a warning when its
 * level-up is still unclaimed. The Pig is re-read on confirm so a state change
 * underneath the modal asks for a second look instead of selling blind, as the
 * bounty confirmation does.
 */
export const TradeInPigModal: React.FC<{
  pigId?: string;
  onClose: () => void;
  onTradedIn: () => void;
}> = ({ pigId, onClose, onTradedIn }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const game = useSelector(gameService, _game);
  const [stateChanged, setStateChanged] = useState(false);
  const renderedState = useRef<Animal["state"] | undefined>(undefined);

  const pig = pigId ? game.pigpen.animals[pigId] : undefined;

  useEffect(() => {
    if (pig) {
      renderedState.current = pig.state;
    }
  }, [pig, pig?.state]);

  if (!pig) return null;

  const { amount, beforeSickness } = getPigBristles({ game, pig });
  const sick = pig.state === "sick";
  const bristlesName = getTranslatedItemName("Pig Bristles");

  const confirm = () => {
    const current =
      gameService.getSnapshot().context.state.pigpen.animals[pig.id];

    if (!current) return;

    if (renderedState.current !== current.state) {
      setStateChanged(true);
      return;
    }

    const nextState = gameService.send({ type: "pig.tradedIn", id: pig.id });

    // Only leave the flow once the Pig is really gone: a rejected event leaves
    // it in place, so keep the modal open for a second look instead.
    if (nextState.context.state.pigpen.animals[pig.id]) {
      setStateChanged(true);
      return;
    }

    onTradedIn();
  };

  return (
    <Panel>
      <div className="p-2">
        {stateChanged && (
          <Label type="danger" className="mb-2">
            {t("bounties.sell.animal.stateChanged")}
          </Label>
        )}
        <div className="mb-2 flex flex-wrap items-center gap-1">
          <Label type="default" icon={ITEM_DETAILS.Pig.image}>
            {t("bounties.animal.levelLabel", {
              level: getBountyLevel(pig),
              animal: getTranslatedItemName("Pig"),
            })}
          </Label>
          {sick && beforeSickness !== amount && (
            <Label type="warning" icon={ITEM_DETAILS["Pig Bristles"].image}>
              <span className="line-through">{`x ${beforeSickness} ${bristlesName}`}</span>
            </Label>
          )}
          <Label type="warning" icon={ITEM_DETAILS["Pig Bristles"].image}>
            {`x ${amount} ${bristlesName}`}
          </Label>
        </div>
        {sick && (
          <Label type="danger" className="mb-2">
            {t("pigs.tradeIn.sick")}
          </Label>
        )}
        {pig.state === "ready" && (
          <Label type="danger" className="mb-2">
            {t("pigs.tradeIn.readyWarning")}
          </Label>
        )}
        <p className="text-sm">{t("pigs.tradeIn.confirm", { amount })}</p>
      </div>
      <div className="flex space-x-1">
        <Button onClick={onClose}>{t("cancel")}</Button>
        <Button onClick={confirm}>{t("confirm")}</Button>
      </div>
    </Panel>
  );
};
