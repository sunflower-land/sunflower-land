import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { MachineState } from "features/game/lib/gameMachine";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NPCName } from "lib/npcs";
import { OuterPanel } from "components/ui/Panel";
import { SquareIcon } from "components/ui/SquareIcon";
import { InlineDialogue } from "../TypingMessage";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { setPrecision } from "lib/utils/formatNumber";

import sflIcon from "assets/icons/sfl.webp";
import chest from "assets/icons/chest.png";
import sunflorianPointIcon from "assets/icons/sunflorians_point.webp";
import goblinsPointIcon from "assets/icons/goblins_point.webp";
import nightshadesPointIcon from "assets/icons/nightshades_point.webp";
import bumpkinsPointIcon from "assets/icons/bumpkins_point.webp";
import { FactionName } from "features/game/types/game";
import { Button } from "components/ui/Button";

interface Props {
  npc: NPCName;
  onClose: () => void;
}

const POINT_ICONS: Record<FactionName, string> = {
  sunflorians: sunflorianPointIcon,
  goblins: goblinsPointIcon,
  nightshades: nightshadesPointIcon,
  bumpkins: bumpkinsPointIcon,
};

const MAX_SFL = 500;
const MIN_SFL = 10;

const _donationRequest = (state: MachineState) =>
  state.context.state.dailyFactionDonationRequest;
const _factionName = (state: MachineState) =>
  state.context.state.faction?.name as FactionName;
const _balance = (state: MachineState) => state.context.state.balance;
const _inventory = (state: MachineState) => state.context.state.inventory;

export const FactionDonationPanel: React.FC<Props> = ({ npc, onClose }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const donationRequest = useSelector(gameService, _donationRequest);
  const factionName = useSelector(gameService, _factionName);
  const balance = useSelector(gameService, _balance);
  const inventory = useSelector(gameService, _inventory);

  const [sflTotal, setSflToday] = useState<number>(0);
  const [resourceTotal, setResourceTotal] = useState<number>(0);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const onDonate = () => {
    gameService.send("faction.donated", {
      faction: factionName,
      donation: {
        sfl: sflTotal,
        resources: resourceTotal,
      },
    });

    onClose();
  };

  const incrementSFL = () => {
    setSflToday((prev) => {
      const newTotal = prev + 10;

      if (newTotal > MAX_SFL) {
        return MAX_SFL;
      }

      return newTotal;
    });
  };

  const decrementSFL = () => {
    setSflToday((prev) => {
      const newTotal = prev - 10;

      if (newTotal < 0) {
        return 0;
      }

      return newTotal;
    });
  };

  const hasEnoughSFL = balance.gte(sflTotal);

  return (
    <CloseButtonPanel onClose={onClose}>
      <>
        <div className="p-2 space-y-2">
          <Label
            type="default"
            icon={SUNNYSIDE.icons.player}
            className="capitalize"
          >
            {`${factionName} Faction`}
          </Label>
          <div
            style={{
              minHeight: "65px",
            }}
            className="mb-3"
          >
            <InlineDialogue
              trail={25}
              message={t("faction.donation.request.message", {
                faction: factionName,
              })}
            />
          </div>
          {/* SFL DONATIONS */}
        </div>
        <Label
          icon={sflIcon}
          type="default"
          className="ml-2 mt-3 mb-2"
        >{`SFL donations (min 10)`}</Label>
        <OuterPanel className="flex flex-col space-y-1">
          <div className="flex justify-between">
            <div className="flex items-center">
              <SquareIcon icon={sflIcon} width={7} />
              <span className="text-xs ml-1">{"SFL"}</span>
            </div>
            <Label
              className={classNames("whitespace-nowrap", {
                "ml-1": !hasEnoughSFL,
              })}
              type="transparent"
            >
              {`${10}/${setPrecision(balance, 1)}`}
            </Label>
          </div>
          <div className="flex justify-between">
            <Label icon={chest} type="warning" className="ml-1.5">
              {t("reward")}
            </Label>
            <div className="flex items-center">
              <img src={POINT_ICONS[factionName]} className="w-4 h-auto mr-1" />
              <span className="text-xxs">{`${20}`}</span>
            </div>
          </div>
        </OuterPanel>
        <div className="flex my-1">
          <div className="flex flex-1 justify-end mr-2 space-x-1">
            <Button className="h-8 w-12" onClick={incrementSFL}>{`+10`}</Button>
            <Button className="h-8 w-12" onClick={decrementSFL}>{`-10`}</Button>
          </div>
          <div className="flex items-center">
            <span
              className={classNames("min-w-[80px] flex justify-end", {
                "text-red-500": !hasEnoughSFL,
                "text-white": hasEnoughSFL,
              })}
            >{`${sflTotal}`}</span>
            <SquareIcon icon={sflIcon} width={7} className="ml-1 mt-1" />
          </div>
        </div>
      </>
    </CloseButtonPanel>
  );
};
