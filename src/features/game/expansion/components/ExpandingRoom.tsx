import React, { ReactElement, cloneElement, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelRoomBorderStyle } from "features/game/lib/style";
import orangeBottle from "assets/decorations/orange_bottle.webp";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  roomName: string;
}

export const ExpandingRoom: React.FC<Props> = ({ roomName, children }) => {
  const expandButtonRef = useRef<HTMLDivElement>(null);
  const expandedDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Have the bottle image spin once on load and then call handleExpand
    setTimeout(() => {
      handleExpand();
    }, 1000);
  }, []);

  const handleExpand = () => {
    if (!expandButtonRef.current || !expandedDivRef.current) return;

    const expandButton = expandButtonRef.current;
    const expandedDiv = expandedDivRef.current;
    expandedDiv.style.display = "block";

    const { top, left, width, height } = expandButton.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    expandedDiv.style.transformOrigin = `${x}px ${y}px`;
    expandedDiv.style.transform = "translate(-50%, -50%) scale(1)";
  };

  const handleCollapse = () => {
    if (!expandedDivRef.current) return;

    const expandedDiv = expandedDivRef.current;
    expandedDiv.style.transform = "translate(-50%, -50%) scale(0)";
    setTimeout(() => {
      expandedDiv.style.display = "none";
    }, 500);
  };

  // Pass handleCollapse to children components
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return cloneElement(
        child as ReactElement<{ handleCollapse: () => void }>,
        { handleCollapse }
      );
    }
    return child;
  });

  return (
    <>
      {createPortal(
        <>
          <div id="expand">
            <div
              id="expanding-base"
              ref={expandButtonRef}
              onClick={handleExpand}
            >
              <img
                src={orangeBottle}
                alt="bottle"
                style={{ width: `${PIXEL_SCALE * 10}px` }}
              />
            </div>
            <div
              id="expanding-container"
              className="bg-brown-600 text-white relative"
              ref={expandedDivRef}
              style={{
                ...pixelRoomBorderStyle,
                padding: `${PIXEL_SCALE * 1}px`,
              }}
            >
              <div id="cover" />
              <div className="p-1 flex flex-col absolute h-full overflow-auto scrollable">
                {/* Header */}
                <div className="flex mb-3 w-full justify-center">
                  <div
                    style={{
                      width: `${PIXEL_SCALE * 11}px`,
                      height: `${PIXEL_SCALE * 11}px`,
                    }}
                  />
                  <h1 className="grow text-center text-lg">{roomName}</h1>
                  <img
                    src={SUNNYSIDE.icons.close}
                    className="cursor-pointer"
                    onClick={handleCollapse}
                    style={{
                      width: `${PIXEL_SCALE * 11}px`,
                    }}
                  />
                </div>
                {childrenWithProps}
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
};
