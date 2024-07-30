import React from "react";
import classNames from "classnames";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";

import {
  pixelDarkBorderStyle,
  pixelLightBorderStyle,
} from "features/game/lib/style";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Equipped } from "features/game/types/bumpkin";

import { SUNNYSIDE } from "assets/sunnyside";
import { useIsDarkMode } from "lib/utils/hooks/useIsDarkMode";

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  hasTabs?: boolean;
  tabAlignment?: "top" | "left";
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
export const InnerPanel: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    divRef?: React.RefObject<HTMLDivElement>;
  }
> = ({ children, ...divProps }) => {
  const { className, style, divRef, ...otherDivProps } = divProps;

  const { isDarkMode } = useIsDarkMode();

  return (
    <div
      className={classNames(className)}
      style={{
        ...pixelLightBorderStyle,
        padding: `${PIXEL_SCALE * 1}px`,
        background: isDarkMode ? "#c28669" : "#e4a672",
        ...style,
      }}
      ref={divRef}
      {...otherDivProps}
    >
      {children}
    </div>
  );
};

/**
 * A panel with a single layered pixel effect
 */
export const OuterPanel: React.FC<PanelProps> = ({
  children,
  hasTabs,
  tabAlignment = "top",
  ...divProps
}) => {
  const { className, style, bumpkinParts, ...otherDivProps } = divProps;
  const { isDarkMode } = useIsDarkMode();
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
      <div
        className={classNames(className, "bg-[#c28569]")}
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
    </>
  );
};

type ButtonPanelProps = React.HTMLAttributes<HTMLDivElement>;
/**
 * A panel with a single layered pixel effect
 */
export const ButtonPanel: React.FC<
  ButtonPanelProps & { disabled?: boolean }
> = ({ children, disabled, ...divProps }) => {
  const { className, style, ...otherDivProps } = divProps;

  return (
    <div
      className={classNames(className, "hover:brightness-90 cursor-pointer", {
        "opacity-50": !!disabled,
      })}
      style={{
        ...pixelDarkBorderStyle,
        padding: `${PIXEL_SCALE * 1}px`,
        borderImage: `url(${SUNNYSIDE.ui.primaryButton})`,
        borderStyle: "solid",
        borderWidth: `8px 8px 10px 8px`,
        borderImageSlice: "3 3 4 3 fill",
        imageRendering: "pixelated",
        borderImageRepeat: "stretch",
        color: "#674544",
        ...style,
      }}
      {...otherDivProps}
    >
      {children}
    </div>
  );
};
