import React from "react";
import classNames from "classnames";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";

import {
  pixelDarkBorderStyle,
  pixelLightBorderStyle,
} from "features/game/lib/style";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Equipped } from "features/game/types/bumpkin";

interface OuterPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  hasTabs?: boolean;
  tabAlignment?: "top" | "left";
}

interface PanelProps extends OuterPanelProps {
  bumpkinParts?: Partial<Equipped>;
}

/**
 * Default panel has the double layered pixel effect
 */
export const Panel: React.FC<PanelProps> = ({
  children,
  hasTabs,
  bumpkinParts,
  ...divProps
}) => {
  return (
    <>
      {bumpkinParts && (
        <div
          className="absolute pointer-events-none"
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
      <OuterPanel hasTabs={hasTabs} {...divProps}>
        <InnerPanel>{children}</InnerPanel>
      </OuterPanel>
    </>
  );
};

/**
 * Light panel with border effect
 */
export const InnerPanel: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...divProps
}) => {
  const { className, style, ...otherDivProps } = divProps;
  return (
    <div
      className={classNames("bg-brown-300", className)}
      style={{
        ...pixelLightBorderStyle,
        padding: `${PIXEL_SCALE * 1}px`,
        ...style,
      }}
      {...otherDivProps}
    >
      {children}
    </div>
  );
};

/**
 * A panel with a single layered pixel effect
 */
export const OuterPanel: React.FC<OuterPanelProps> = ({
  children,
  hasTabs,
  tabAlignment = "top",
  ...divProps
}) => {
  const { className, style, ...otherDivProps } = divProps;
  return (
    <div
      className={classNames("bg-brown-600 text-white", className)}
      style={{
        ...pixelDarkBorderStyle,
        padding: `${PIXEL_SCALE * 1}px`,
        ...(hasTabs
          ? {
              paddingTop:
                tabAlignment === "top" ? `${PIXEL_SCALE * 15}px` : undefined,
              paddingLeft:
                tabAlignment === "left" ? `${PIXEL_SCALE * 15}px` : undefined,
            }
          : {}),
        ...style,
      }}
      {...otherDivProps}
    >
      {children}
    </div>
  );
};
