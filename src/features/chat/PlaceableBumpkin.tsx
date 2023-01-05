import React, { useContext, useEffect, useRef, useState } from "react";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import confirm from "assets/icons/confirm.png";
import cancel from "assets/icons/cancel.png";

import Draggable from "react-draggable";
import classNames from "classnames";

import dragIcon from "assets/icons/drag.png";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { DynamicMiniNFT } from "features/island/bumpkin/components/DynamicMiniNFT";

// Map is not aligned to center 0,0
const MAP_OFFSET = [-10, -10];

const getInitialCorodinates = () => {
  // This container helps us to calculate the scroll pixels as in our application
  // window do not scroll but this container dose
  const pageScrollContainer = document.getElementsByClassName(
    "page-scroll-container"
  )[0];

  const viewportMidPointX =
    window.innerWidth / 2 + pageScrollContainer.scrollLeft;
  const viewportMidPointY =
    window.innerHeight / 2 + pageScrollContainer.scrollTop;

  const land = document
    .getElementById(Section.GenesisBlock)
    ?.getBoundingClientRect();
  const landMidX =
    pageScrollContainer.scrollLeft +
    (land?.left ?? 0) +
    ((land?.width ?? 0) / 2 ?? 0);
  const landMidY =
    pageScrollContainer.scrollTop +
    (land?.top ?? 0) +
    ((land?.height ?? 0) / 2 ?? 0);

  // This division and then multiplication with GRID_WIDTH_PX has been done as
  // due to a small pixel difference in rounding, the actual placeable square was
  // a bit off from the land square.
  const INITIAL_POSITION_X =
    Math.round((viewportMidPointX - landMidX) / GRID_WIDTH_PX) * GRID_WIDTH_PX;
  const INITIAL_POSITION_Y =
    Math.round((viewportMidPointY - landMidY) / GRID_WIDTH_PX) * GRID_WIDTH_PX;
  return [
    INITIAL_POSITION_X + MAP_OFFSET[0] * GRID_WIDTH_PX,
    INITIAL_POSITION_Y + MAP_OFFSET[1] * GRID_WIDTH_PX,
  ];
};

interface Props {
  onPlace: (coords: Coordinates) => void;
}
export const PlaceableBumpkin: React.FC<Props> = ({ onPlace }) => {
  const nodeRef = useRef(null);

  const [DEFAULT_POSITION_X, DEFAULT_POSITION_Y] = getInitialCorodinates();

  const [position, setPosition] = useState<Coordinates>({
    x: DEFAULT_POSITION_X,
    y: DEFAULT_POSITION_Y,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const collideRef = useRef(false);

  const width = 1;
  const height = 1;

  const update = ({ x, y }: Coordinates) => {
    const collisionDetected = false;
    // const collisionDetected = detectCollision(gameService.state.context.state, {
    //   x,
    //   y,
    //   width,
    //   height,
    // });

    collideRef.current = collisionDetected;

    setPosition({ x, y });
    // send({ type: "UPDATE", coordinates: { x, y }, collisionDetected });
  };

  useEffect(() => {
    update({
      x: Math.round(DEFAULT_POSITION_X / GRID_WIDTH_PX),
      y: Math.round(-DEFAULT_POSITION_Y / GRID_WIDTH_PX),
    });
  }, []);

  const collisionDetected = false;
  const handleConfirmPlacement = () => {
    // // prevents multiple toasts while spam clicking place button
    // if (!child.state.matches("idle")) {
    //   return;
    // }
    // send("PLACE");
    const correctPosition = { x: position.x, y: position.y + 1 };
    onPlace(correctPosition as Coordinates);
  };

  const handleCancelPlacement = () => {
    // send("CANCEL");
  };

  return (
    <>
      <div
        id="bg-overlay "
        className=" bg-black opacity-40 fixed inset-0"
        style={{
          zIndex: 99,
          height: "300%",
          right: "-1000px",
          left: "-1000px",
          top: "-1000px",
          overflow: "hidden",
          bottom: "1000px",
        }}
      />
      <div className="fixed left-1/2 top-1/2" style={{ zIndex: 100 }}>
        <Draggable
          defaultPosition={{
            x: DEFAULT_POSITION_X,
            y: DEFAULT_POSITION_Y,
          }}
          nodeRef={nodeRef}
          grid={[GRID_WIDTH_PX, GRID_WIDTH_PX]}
          onStart={() => {
            setIsDragging(true);
            // send("DRAG");
            console.log("Start");
          }}
          onDrag={(_, data) => {
            const x = Math.round(data.x / GRID_WIDTH_PX);
            const y = Math.round(-data.y / GRID_WIDTH_PX);

            update({ x, y });
            setShowHint(false);
          }}
          onStop={(_, data) => {
            const x = Math.round(data.x / GRID_WIDTH_PX);
            const y = Math.round(-data.y / GRID_WIDTH_PX);

            update({ x, y });

            // send("DROP");
            setIsDragging(false);
            console.log("End");
          }}
        >
          <div
            ref={nodeRef}
            data-prevent-drag-scroll
            className={classNames("flex flex-col items-center", {
              "cursor-grab": !isDragging,
              "cursor-grabbing": isDragging,
            })}
            style={{ pointerEvents: "auto" }}
          >
            {showHint && (
              <div
                className="flex absolute pointer-events-none"
                style={{
                  top: "-35px",
                  width: "135px",
                }}
              >
                <img src={dragIcon} className="h-6 mr-2" />
                <span className="text-white text-sm">Drag me</span>
              </div>
            )}
            <div
              draggable={false}
              className={classNames(
                " w-full h-full relative img-highlight pointer-events-none",
                {
                  "bg-green-background/80": !collideRef.current,
                  "bg-red-background/80": collideRef.current,
                }
              )}
              style={{
                width: `${width * GRID_WIDTH_PX}px`,
                height: `${height * GRID_WIDTH_PX}px`,
              }}
            >
              <div style={{ position: "relative", bottom: "42px" }}>
                <DynamicMiniNFT
                  body="Beige Farmer Potion"
                  hair="Basic Hair"
                  pants="Blue Suspenders"
                  shirt="Project Dignity Hoodie"
                />
              </div>
            </div>
          </div>
        </Draggable>
      </div>

      <div
        className="fixed bottom-2 left-1/2 -translate-x-1/2"
        style={{
          zIndex: 99999,
        }}
      >
        <OuterPanel>
          <div
            className="flex items-stretch space-x-2 sm:h-12 w-80 sm:w-[400px]"
            style={{
              height: `${PIXEL_SCALE * 17}px`,
            }}
          >
            <Button onClick={handleCancelPlacement}>
              <img
                src={cancel}
                alt="cancel"
                style={{
                  width: `${PIXEL_SCALE * 11}px`,
                }}
              />
            </Button>
            <Button
              disabled={collisionDetected}
              onClick={handleConfirmPlacement}
            >
              <img
                src={confirm}
                alt="confirm"
                style={{
                  width: `${PIXEL_SCALE * 12}px`,
                }}
              />
            </Button>
          </div>
        </OuterPanel>
      </div>
    </>
  );
};
