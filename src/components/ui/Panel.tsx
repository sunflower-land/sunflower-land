import React from "react";
import classNames from "classnames";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";

import {
  pixelDarkBorderStyle,
  pixelLightBorderStyle,
} from "features/game/lib/style";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Equipped } from "features/game/types/bumpkin";

interface Props {
  className?: string;
  hasTabs?: boolean;
  bumpkinParts?: Partial<Equipped>;
  style?: React.CSSProperties;
}

/**
 * Default panel has the double layered pixel effect
 */
export const Panel: React.FC<Props> = ({
  children,
  className,
  hasTabs,
  bumpkinParts,
  style,
}) => {
  return (
    <>
      {bumpkinParts && (
        <div
          className="absolute"
          style={{
            zIndex: -10,
            top: `${PIXEL_SCALE * -61}px`,
            left: `${PIXEL_SCALE * -8}px`,
            width: `${PIXEL_SCALE * 100}px`,
          }}
        >
          <DynamicNFT bumpkinParts={bumpkinParts} />
        </div>
      )}
      <OuterPanel className={className} style={style} hasTabs={hasTabs}>
        <InnerPanel hasTabs={hasTabs}>{children}</InnerPanel>
      </OuterPanel>
    </>
  );
};

/**
 * Light panel with border effect
 */
export const InnerPanel: React.FC<Props> = ({ children, className }) => {
  return (
    <div
      className={classNames("bg-brown-300", className)}
      style={{
        ...pixelLightBorderStyle,
        padding: `${PIXEL_SCALE * 1}px`,
      }}
    >
      {children}
    </div>
  );
};

/**
 * A panel with a single layered pixel effect
 */
export const OuterPanel: React.FC<Props> = ({
  children,
  className,
  hasTabs,
  style,
}) => {
  return (
    <div
      className={classNames("bg-brown-600 text-white", className)}
      style={{
        ...pixelDarkBorderStyle,
        padding: `${PIXEL_SCALE * 1}px`,
        ...(hasTabs ? { paddingTop: `${PIXEL_SCALE * 15}px` } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
};
