import React, { useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import { Transition } from "@headlessui/react";
import oil from "assets/resources/oil.webp";
import emptyOilReserve from "assets/resources/oil/oil_reserve_empty.webp";
import classNames from "classnames";

interface Props {
  timeLeft: number;
  oilAmount?: number;
  drilling: boolean;
  onOilTransitionEnd?: () => void;
}

export const DepletedOilReserve: React.FC<Props> = ({
  timeLeft,
  oilAmount,
  drilling,
  onOilTransitionEnd,
}) => {
  const { t } = useAppTranslation();
  const [showTimeLeft, setShowTimeLeft] = useState(false);

  return (
    <div
      className={classNames(
        "absolute w-full h-full flex justify-center items-center",
        {
          "pointer-events-none": !!oilAmount,
        }
      )}
    >
      <div
        onMouseEnter={() => setShowTimeLeft(true)}
        onMouseLeave={() => setShowTimeLeft(false)}
      >
        <img
          src={emptyOilReserve}
          className="opacity-50"
          style={{
            width: `${PIXEL_SCALE * 30}px`,
          }}
          alt="Empty oil reserve"
        />
        <div
          className="flex justify-center absolute w-full"
          style={{
            top: `${PIXEL_SCALE * -16}px`,
          }}
        >
          <TimeLeftPanel
            text={t("resources.recoversIn")}
            timeLeft={timeLeft}
            showTimeLeft={showTimeLeft}
          />
        </div>
      </div>
      <Transition
        appear={true}
        id="oil-reserve-collected-amount"
        show={drilling}
        enter="transition-opacity transition-transform duration-200"
        enterFrom="opacity-0 translate-y-6"
        enterTo="opacity-100 -translate-y-2"
        leave="transition-opacity duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        afterLeave={onOilTransitionEnd}
        className="flex -top-2 left-[40%] absolute w-full z-40"
      >
        <img
          src={oil}
          className="mr-2 img-highlight-heavy"
          style={{
            width: `${PIXEL_SCALE * 7}px`,
          }}
        />
        <span className="yield-text text-white font-pixel">{`+${oilAmount}`}</span>
      </Transition>
    </div>
  );
};
