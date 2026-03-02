import React, { useContext, useState } from "react";
import { Label } from "components/ui/Label";
import { SFL_TO_COIN_PACKAGES } from "features/game/events/landExpansion/exchangeSFLtoCoins";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ButtonPanel } from "components/ui/Panel";
import { isMobile } from "mobile-device-detect";

import sflIcon from "assets/icons/flower_token.webp";
import exchangeIcon from "assets/icons/exchange.png";
import coinsIcon from "assets/icons/coins.webp";
import coinsStack from "assets/icons/coins_stack.webp";
import coinsScattered from "assets/icons/coins_scattered.webp";
import { SquareIcon } from "components/ui/SquareIcon";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { Button } from "components/ui/Button";

const COIN_IMAGES = [coinsScattered, coinsIcon, coinsStack];

const _balance = (state: MachineState) => state.context.state.balance;

export const SwapSFLForCoins: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const balance = useSelector(gameService, _balance);

  const [exchangePackageId, setExchangePackageId] = useState<
    number | undefined
  >(undefined);

  const handleSFLtoCoinsExchange = (packageId: number) => {
    gameService.send({ type: "sfl.exchanged", packageId });
    setExchangePackageId(undefined);
    onClose();
  };

  const enoughSfl =
    !!exchangePackageId &&
    balance.greaterThanOrEqualTo(
      SFL_TO_COIN_PACKAGES[Number(exchangePackageId)].sfl,
    );

  return (
    <>
      <div className="flex flex-col space-y-2 py-2 px-1">
        <div className="flex items-center gap-2">
          <img
            src={SUNNYSIDE.icons.arrow_left}
            className="w-6 cursor-pointer"
            onClick={
              exchangePackageId
                ? () => setExchangePackageId(undefined)
                : onClose
            }
          />
          <Label icon={exchangeIcon} type="default" className="ml-1">
            {t("exchange.flower.coins")}
          </Label>
        </div>
        {/* Exchange packages */}
        {!exchangePackageId && (
          <div className="flex px-1 pb-1 justify-between gap-1  sm:text-sm sm:gap-2">
            {Object.keys(SFL_TO_COIN_PACKAGES).map((packageId, index) => {
              const option = SFL_TO_COIN_PACKAGES[Number(packageId)];

              return (
                <ButtonPanel
                  key={JSON.stringify(option)}
                  className="flex relative flex-col flex-1 items-center p-2 cursor-pointer hover:bg-brown-300"
                  onClick={() => setExchangePackageId(Number(packageId))}
                >
                  <span className="whitespace-nowrap mb-2">{`${option.coins} x`}</span>
                  <div className="flex flex-1 justify-center items-center mb-6 w-full relative">
                    <SquareIcon
                      width={isMobile ? 18 : 22}
                      icon={COIN_IMAGES[index]}
                    />
                  </div>
                  <Label
                    icon={sflIcon}
                    type="warning"
                    iconWidth={13}
                    className="absolute h-7  -bottom-2"
                    style={{
                      left: `${PIXEL_SCALE * -3}px`,
                      right: `${PIXEL_SCALE * -3}px`,
                      width: `calc(100% + ${PIXEL_SCALE * 6}px)`,
                    }}
                  >
                    <span className="pl-1 sm:pl-0">{`${option.sfl} FLOWER`}</span>
                  </Label>
                </ButtonPanel>
              );
            })}
          </div>
        )}
        {/* Exchange confirmation */}
        {!!exchangePackageId && (
          <div className="flex flex-col space-y-1">
            <div className="flex px-1 pb-1 w-full items-center text-sm justify-between my-1">
              <div className="flex items-center space-x-2">
                <span>
                  {t("item")}{" "}
                  {SFL_TO_COIN_PACKAGES[Number(exchangePackageId)].coins} {"x"}
                </span>
                <img src={coinsIcon} className="w-6" />
              </div>
              <span>{`${t("total")} ${
                SFL_TO_COIN_PACKAGES[Number(exchangePackageId)].sfl
              } FLOWER`}</span>
            </div>
            {!enoughSfl && (
              <Label type="danger" icon={sflIcon} className="mb-2 ml-1">
                {t("not.enough.sfl")}
              </Label>
            )}
          </div>
        )}
      </div>
      {!!exchangePackageId && (
        <Button
          disabled={!enoughSfl}
          onClick={() => handleSFLtoCoinsExchange(exchangePackageId)}
        >
          {t("confirm")}
        </Button>
      )}
    </>
  );
};
