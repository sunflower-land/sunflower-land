import React, { useContext } from "react";
import Decimal from "decimal.js-light";

import { InnerPanel } from "components/ui/Panel";

import ticket from "assets/icons/block_buck.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import classNames from "classnames";

interface Props {
  isFullUser: boolean;
  blockBucks: Decimal;
}

export const BlockBucks: React.FC<Props> = ({
  isFullUser,
  blockBucks = new Decimal(0),
}) => {
  const { openModal } = useContext(ModalContext);

  return (
    <>
      <InnerPanel
        className={classNames("flex items-center fixed z-50", {
          "cursor-pointer": isFullUser,
        })}
        style={{
          top: `${PIXEL_SCALE * 21}px`,
          right: `${PIXEL_SCALE * 3}px`,
        }}
        onClick={
          isFullUser
            ? () => {
                console.log("OPEN");
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
