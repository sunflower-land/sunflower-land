import React from "react";
import { Transition } from "@headlessui/react";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ITEM_DETAILS } from "features/game/types/images";
import coinsIcon from "assets/icons/coins.webp";
import { getEntries } from "features/game/types/craftables";
import { SUNNYSIDE } from "assets/sunnyside";
import { BumpkinGift } from "features/game/types/gifts";
import { ITEM_IDS } from "features/game/types/bumpkin";

interface Props {
  show: boolean;
  className?: string;
  nextGift: BumpkinGift;
  giftProgress?: string;
  giftTitle?: string;
  onClick: () => void;
}

export const FriendshipInfoPanel: React.FC<Props> = ({
  show,
  className,
  nextGift,
  giftProgress,
  giftTitle,
  onClick,
}) => {
  const { t } = useAppTranslation();

  return (
    <Transition
      appear={true}
      id="friendship-gifts-info-panel"
      show={show}
      enter="transition-opacity transition-transform duration-200"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      className={`flex absolute z-40 ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <OuterPanel className="drop-shadow-lg cursor-pointer max-w-md">
        <InnerPanel className="flex flex-col -m-0.5">
          <div className="flex space-x-1 mb-1.5">
            <span className="text-xs whitespace-nowrap">{giftTitle}</span>
          </div>
          <div className="space-y-1">
            {!!nextGift.wearables &&
              getEntries(nextGift.wearables).map((wearable) => (
                <div
                  key={String(wearable)}
                  className="capitalize space-x-1 flex items-center"
                >
                  {!!wearable && (
                    <>
                      <img
                        src={`/src/assets/wearables/${ITEM_IDS[wearable[0]]}.webp`}
                        alt={wearable[0]}
                        className="w-4 mr-0.5"
                      />
                      <span className="text-xs">{`${wearable[1]} ${wearable[0]}`}</span>
                    </>
                  )}
                </div>
              ))}

            {!!nextGift.items &&
              getEntries(nextGift.items).map((item) => (
                <div
                  key={String(item)}
                  className="capitalize space-x-1 flex items-center"
                >
                  {item && (
                    <>
                      <img
                        src={
                          ITEM_DETAILS[item[0]]?.image ??
                          SUNNYSIDE.icons.expression_confused
                        }
                        alt={item[0]}
                        className="w-4 mr-0.5"
                      />
                      <span className="text-xs">{`${item[1]} ${item[0]}`}</span>
                    </>
                  )}
                </div>
              ))}

            {!!nextGift.coins && (
              <div className="capitalize space-x-1 flex items-center">
                <img src={coinsIcon} alt="Coins" className="w-4 mr-0.5" />
                <span className="text-xs">{`${nextGift.coins} ${t("coins")}`}</span>
              </div>
            )}
          </div>
        </InnerPanel>
        {!!giftProgress && (
          <InnerPanel className="flex flex-col -m-0.5 mt-1">
            <div className="flex mb-1.5">
              <span className="text-xs whitespace-nowrap">
                {t("friendship.gift.progress")}
              </span>
            </div>
            <div className="capitalize space-x-1 flex items-center">
              <img
                src={SUNNYSIDE.icons.heart}
                alt="Heart"
                className="w-4 mr-0.5"
              />
              <span className="text-xs">{giftProgress}</span>
            </div>
          </InnerPanel>
        )}
      </OuterPanel>
    </Transition>
  );
};
