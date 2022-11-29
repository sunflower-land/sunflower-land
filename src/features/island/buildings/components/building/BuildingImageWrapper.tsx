import React from "react";
import classNames from "classnames";
import { PIXEL_SCALE } from "features/game/lib/constants";
import expressionAlerted from "assets/icons/expression_alerted.png";

/**
 * BuildingImageWrapper props
 * @param nonInteractible if the building is non interactable
 * @param ready if the building crafting process is ready
 * @param onClick on click event
 */
interface Props {
  nonInteractible?: boolean;
  ready?: boolean;
  onClick: () => void;
}

export const BuildingImageWrapper: React.FC<Props> = ({
  nonInteractible,
  ready,
  onClick,
  children,
}) => {
  return (
    <>
      {/* building */}
      <div
        className={classNames(
          "relative w-full h-full",
          nonInteractible ? "" : "cursor-pointer hover:img-highlight"
        )}
        onClick={onClick}
      >
        {children}
      </div>

      {/* Ready indicator */}
      {ready && (
        <div
          className="flex justify-center absolute w-full pointer-events-none z-30"
          style={{
            top: `${PIXEL_SCALE * -12}px`,
          }}
        >
          <img
            src={expressionAlerted}
            className="ready"
            style={{
              width: `${PIXEL_SCALE * 4}px`,
            }}
          />
        </div>
      )}
    </>
  );
};
