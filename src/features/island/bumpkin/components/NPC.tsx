import React, { useContext, useEffect, useState } from "react";
import Spritesheet from "components/animation/SpriteAnimator";
import classNames from "classnames";
import {
  BumpkinBody,
  BumpkinHair,
  BumpkinBackground,
  BumpkinShoe,
  BumpkinTool,
} from "features/game/types/bumpkin";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { buildNPCSheets } from "features/bumpkins/actions/buildNPCSheets";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";

import shadow from "assets/npcs/shadow.png";
import silhouette from "assets/npcs/silhouette.webp";
import { ZoomContext } from "components/ZoomProvider";
import { SpringValue } from "react-spring";

const FRAME_WIDTH = 180 / 9;
const FRAME_HEIGHT = 19;
const STEPS = 9;

export type NPCParts = Omit<
  BumpkinParts,
  "background" | "hair" | "body" | "shoes" | "tool"
> & {
  background: BumpkinBackground;
  hair: BumpkinHair;
  body: BumpkinBody;
  shoes: BumpkinShoe;
  tool: BumpkinTool;
};

export interface NPCProps {
  parts: Partial<NPCParts>;
  flip?: boolean;
  hideShadow?: boolean;
  preventZoom?: boolean;
}

export const NPC: React.FC<NPCProps & { onClick?: () => void }> = ({
  parts,
  flip,
  hideShadow,
  onClick,
  preventZoom,
}) => {
  const { scale } = useContext(ZoomContext);
  const [sheetSrc, setSheetSrc] = useState<string>();

  // make sure all body parts are synchronized
  useEffect(() => {
    const load = async () => {
      const { sheets } = await buildNPCSheets({
        parts,
      });

      setSheetSrc(sheets.idle);
    };

    load();
  }, []);

  return (
    <>
      <div
        className={classNames(`absolute `, {
          "cursor-pointer hover:img-highlight": !!onClick,
          "-scale-x-100": !!flip,
        })}
        onClick={() => !!onClick && onClick()}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          height: `${PIXEL_SCALE * 32}px`,
        }}
      >
        {!sheetSrc && (
          <img
            src={silhouette}
            style={{
              width: `${PIXEL_SCALE * 15}px`,
              top: `${PIXEL_SCALE * 8}px`,
              left: `${PIXEL_SCALE * 1}px`,
            }}
            className="absolute pointer-events-none npc-loading"
          />
        )}

        {sheetSrc && (
          <>
            {!hideShadow && (
              <img
                src={shadow}
                style={{
                  width: `${PIXEL_SCALE * 15}px`,
                  top: `${PIXEL_SCALE * 20}px`,
                  left: `${PIXEL_SCALE * 1}px`,
                }}
                className="absolute pointer-events-none"
              />
            )}

            <Spritesheet
              className="absolute w-full inset-0 pointer-events-none"
              style={{
                width: `${PIXEL_SCALE * 20}px`,
                top: `${PIXEL_SCALE * 5}px`,
                left: `${PIXEL_SCALE * -2}px`,
                imageRendering: "pixelated" as const,
              }}
              image={sheetSrc}
              widthFrame={FRAME_WIDTH}
              heightFrame={FRAME_HEIGHT}
              zoomScale={preventZoom ? new SpringValue(1) : scale}
              steps={STEPS}
              fps={14}
              autoplay={true}
              loop={true}
            />
          </>
        )}
      </div>
    </>
  );
};

export const NPCIcon: React.FC<NPCProps> = ({ parts, hideShadow }) => {
  const [sheetSrc, setSheetSrc] = useState<string>();

  // make sure all body parts are synchronized
  useEffect(() => {
    const load = async () => {
      const { sheets } = await buildNPCSheets({
        parts,
      });

      setSheetSrc(sheets.idle);
    };

    load();
  }, []);

  return (
    <>
      <div>
        {!sheetSrc && (
          <img
            src={silhouette}
            style={{
              width: `${PIXEL_SCALE * 12}px`,
              top: `${PIXEL_SCALE * 8}px`,
              left: `${PIXEL_SCALE * 1}px`,
            }}
            className="absolute pointer-events-none npc-loading"
          />
        )}

        {sheetSrc && (
          <>
            {!hideShadow && (
              <img
                src={shadow}
                style={{
                  width: `${PIXEL_SCALE * 9}px`,
                  top: `${PIXEL_SCALE * 11}px`,
                  left: `${PIXEL_SCALE * 2.3}px`,
                }}
                className="absolute pointer-events-none"
              />
            )}

            <Spritesheet
              className="w-full inset-0 pointer-events-none"
              style={{
                width: `${PIXEL_SCALE * 14}px`,
                imageRendering: "pixelated" as const,
              }}
              image={sheetSrc}
              widthFrame={FRAME_WIDTH}
              heightFrame={FRAME_HEIGHT}
              zoomScale={new SpringValue(1)}
              steps={STEPS}
              fps={14}
              autoplay={true}
              loop={true}
            />
          </>
        )}
      </div>
    </>
  );
};

export const NPCFixed: React.FC<NPCProps & { width: number }> = ({
  parts,
  width,
}) => {
  const [sheetSrc, setSheetSrc] = useState<string>();

  useEffect(() => {
    const load = async () => {
      const { sheets } = await buildNPCSheets({
        parts,
      });

      setSheetSrc(sheets.idle);
    };

    load();
  }, []);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        imageRendering: "pixelated" as const,
        width: `${width}px`,
        height: `${width}px`,
      }}
    >
      <img
        src={sheetSrc}
        className="block absolute"
        style={{
          transform: "scale(9)",
          top: `${PIXEL_SCALE * 6}px`,
          left: "400%",
        }}
      />
    </div>
  );
};
