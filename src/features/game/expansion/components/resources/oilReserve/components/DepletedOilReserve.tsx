import React, { useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import { Transition } from "@headlessui/react";
import oil from "assets/resources/oil.webp";
import emptyOilReserve from "assets/resources/oil/oil_reserve_empty.webp";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  timeLeft: number;
  oilAmount?: number;
  drilling: boolean;
  /**
   * Current effective recovery speed from the windowed Stag Shrine boost.
   * > 1 shows a lightning marker + the multiplier in the popover.
   */
  speed?: number;
  onOilTransitionEnd?: () => void;
}

export const DepletedOilReserve: React.FC<Props> = ({
  timeLeft,
  oilAmount,
  drilling,
  speed,
  onOilTransitionEnd,
}) => {
  const { t } = useAppTranslation();
  const [showTimeLeft, setShowTimeLeft] = useState(false);
  const boosted = speed !== undefined && speed > 1;

  return (
    <div
      className={classNames(
        "absolute w-full h-full flex justify-center items-center",
        {
          "pointer-events-none": !!oilAmount,
        },
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
        {boosted && (
          <img
            src={SUNNYSIDE.icons.lightning}
            alt=""
            aria-hidden
            className="absolute animate-pulse"
            style={{
              width: `${PIXEL_SCALE * 7}px`,
              top: `${PIXEL_SCALE * 2}px`,
              right: `${PIXEL_SCALE * 2}px`,
            }}
          />
        )}
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
            speed={speed}
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
        as="div"
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
