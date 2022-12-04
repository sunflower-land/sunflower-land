import React from "react";

import close from "assets/icons/close.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Panel } from "../../../components/ui/Panel";
import { Equipped } from "features/game/types/bumpkin";

interface Props {
  title?: string;
  onClose: () => void;
  bumpkinParts?: Partial<Equipped>;
}

export const CloseButtonPanel: React.FC<Props> = ({
  title,
  onClose,
  bumpkinParts,
  children,
}) => {
  return (
    <Panel bumpkinParts={bumpkinParts}>
      <div>
        {title && (
          <div className="flex text-center">
            <div
              className="flex-none"
              style={{
                width: `${PIXEL_SCALE * 11}px`,
              }}
            />
            <div className="grow mb-3 text-lg">{title}</div>
            <div className="flex-none">
              <img
                src={close}
                className="cursor-pointer"
                onClick={onClose}
                style={{
                  width: `${PIXEL_SCALE * 11}px`,
                }}
              />
            </div>
          </div>
        )}
        {children}
      </div>
    </Panel>
  );
};
