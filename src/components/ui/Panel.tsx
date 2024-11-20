import React from "react";
import classNames from "classnames";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";

import {
  pixelDarkBorderStyle,
  pixelLightBorderStyle,
} from "features/game/lib/style";

import usedButton from "assets/ui/used_button.png";
import cardButton from "assets/ui/card_button.png";

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
        // Fix for dark mode

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
  ButtonPanelProps & {
    disabled?: boolean;
    selected?: boolean;
    variant?: "primary" | "secondary" | "card";
  }
> = ({ children, disabled, variant, ...divProps }) => {
  const { className, style, selected, ...otherDivProps } = divProps;

  let borderImage = SUNNYSIDE.ui.primaryButton;
  if (variant === "secondary") {
    borderImage = usedButton;
  } else if (variant === "card") {
    borderImage = cardButton;
  }

  return (
    <div
      className={classNames(className, "relative", {
        "opacity-50": !!disabled,
        "cursor-pointer": !disabled,
        "hover:brightness-90": !disabled,
      })}
      style={{
        ...pixelDarkBorderStyle,
        padding: `${PIXEL_SCALE * 1}px`,
        borderImage: `url(${borderImage}) 3 3 4 3 fill`,
        borderStyle: "solid",
        borderWidth: `8px 8px 10px 8px`,
        imageRendering: "pixelated",
        borderImageRepeat: "stretch",
        color: "#674544",
        ...style,
      }}
      {...otherDivProps}
    >
      {children}

      {selected && (
        <div
          className="absolute"
          style={{
            borderImage: `url(${SUNNYSIDE.ui.select_box})`,
            borderStyle: "solid",
            borderWidth: `18px 16px 18px`,
            borderImageSlice: "9 8 9 8 fill",
            imageRendering: "pixelated",
            borderImageRepeat: "stretch",
            top: `${PIXEL_SCALE * -4}px`,
            right: `${PIXEL_SCALE * -4}px`,
            left: `${PIXEL_SCALE * -4}px`,
            bottom: `${PIXEL_SCALE * -4}px`,
          }}
        />
      )}
    </div>
  );
};
