import React, { useContext } from "react";
import Decimal from "decimal.js-light";

import { InnerPanel } from "components/ui/Panel";

import ticket from "assets/icons/block_buck.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import classNames from "classnames";

interface Props {
  isVisiting?: boolean;
  blockBucks: Decimal;
}

export const BlockBucks: React.FC<Props> = ({
  isVisiting = false,
  blockBucks = new Decimal(0),
}) => {
  const { openModal } = useContext(ModalContext);

  return (
    <>
      <InnerPanel
        className={classNames("flex items-center absolute z-50", {
          "cursor-pointer": !isVisiting,
        })}
        style={{
          top: `${PIXEL_SCALE * 21}px`,
          right: `${PIXEL_SCALE * 3}px`,
        }}
        onClick={
          !isVisiting
            ? () => {
                openModal("BUY_BLOCK_BUCKS");
              }
            : undefined
        }
      >
        <img
          src={ticket}
          style={{
            width: `${PIXEL_SCALE * 10}px`,
          }}
        />
        <span className="text-xs ml-1.5 mb-0.5">{blockBucks.toNumber()}</span>
      </InnerPanel>
    </>
  );
};
