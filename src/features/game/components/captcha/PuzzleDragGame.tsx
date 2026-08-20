import React, { useEffect, useRef, useState } from "react";

import { ITEM_DETAILS } from "features/game/types/images";
import { CROPS, type CropName } from "features/game/types/crops";
import { getKeys } from "lib/object";
import { randomInt } from "lib/utils/random";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type { CaptchaGameProps } from "./types";

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 150;
const PIECE_SIZE = 36;
// How close (centre to centre, canvas px) the drop must be to count as correct
const TOLERANCE = 12;

type Position = { x: number; y: number };

export const PuzzleDragGame: React.FC<CaptchaGameProps> = ({
  onSuccess,
  onFailure,
}) => {
  const { t } = useAppTranslation();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | undefined>(undefined);
  const silhouetteRef = useRef<HTMLCanvasElement | undefined>(undefined);
  const piecePosRef = useRef<Position>({
    x: 15,
    y: randomInt(10, CANVAS_HEIGHT - PIECE_SIZE - 10),
  });
  const dragOffsetRef = useRef<Position | undefined>(undefined);
  const doneRef = useRef(false);

  const [crop] = useState<CropName>(() => {
    const crops = getKeys(CROPS);
    return crops[randomInt(0, crops.length)];
  });
  const [target] = useState<Position>(() => ({
    x: randomInt(CANVAS_WIDTH / 2 + 20, CANVAS_WIDTH - PIECE_SIZE - 10),
    y: randomInt(10, CANVAS_HEIGHT - PIECE_SIZE - 10),
  }));

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const image = imageRef.current;

    if (!canvas || !ctx || !image) return;

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Backdrop
    ctx.fillStyle = "#ead4aa";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // The empty puzzle slot (silhouette of the crop)
    if (silhouetteRef.current) {
      ctx.drawImage(silhouetteRef.current, target.x, target.y);
    }

    // The draggable piece
    drawContained(ctx, image, piecePosRef.current.x, piecePosRef.current.y);
  };

  // Draws the image aspect-fitted inside a PIECE_SIZE box at (x, y)
  const drawContained = (
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    x: number,
    y: number,
  ) => {
    const scale = PIECE_SIZE / Math.max(image.width, image.height);
    const width = image.width * scale;
    const height = image.height * scale;

    ctx.drawImage(
      image,
      x + (PIECE_SIZE - width) / 2,
      y + (PIECE_SIZE - height) / 2,
      width,
      height,
    );
  };

  useEffect(() => {
    const image = new Image();

    image.onload = () => {
      imageRef.current = image;

      // Pre-render the silhouette for the empty slot
      const silhouette = document.createElement("canvas");
      silhouette.width = PIECE_SIZE;
      silhouette.height = PIECE_SIZE;

      const ctx = silhouette.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = false;
        drawContained(ctx, image, 0, 0);
        ctx.globalCompositeOperation = "source-in";
        ctx.fillStyle = "#3e2731";
        ctx.fillRect(0, 0, PIECE_SIZE, PIECE_SIZE);
      }

      silhouetteRef.current = silhouette;
      draw();
    };

    image.src = ITEM_DETAILS[crop].image;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crop]);

  const toCanvasPosition = (event: React.PointerEvent): Position => {
    const rect = canvasRef.current!.getBoundingClientRect();

    return {
      x: (event.clientX - rect.left) * (CANVAS_WIDTH / rect.width),
      y: (event.clientY - rect.top) * (CANVAS_HEIGHT / rect.height),
    };
  };

  const onPointerDown = (event: React.PointerEvent) => {
    if (doneRef.current) return;

    const position = toCanvasPosition(event);
    const piece = piecePosRef.current;

    const isOnPiece =
      position.x >= piece.x &&
      position.x <= piece.x + PIECE_SIZE &&
      position.y >= piece.y &&
      position.y <= piece.y + PIECE_SIZE;

    if (!isOnPiece) return;

    dragOffsetRef.current = {
      x: position.x - piece.x,
      y: position.y - piece.y,
    };
    canvasRef.current?.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (doneRef.current || !dragOffsetRef.current) return;

    const position = toCanvasPosition(event);

    piecePosRef.current = {
      x: position.x - dragOffsetRef.current.x,
      y: position.y - dragOffsetRef.current.y,
    };
    draw();
  };

  const onPointerUp = () => {
    if (doneRef.current || !dragOffsetRef.current) return;

    dragOffsetRef.current = undefined;

    const piece = piecePosRef.current;
    const distance = Math.hypot(piece.x - target.x, piece.y - target.y);

    doneRef.current = true;

    if (distance <= TOLERANCE) {
      // Snap into the slot so the player sees it fit before we continue
      piecePosRef.current = { ...target };
      draw();
      setTimeout(onSuccess, 400);
    } else {
      onFailure();
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <p className="text-xs text-center mb-2">
        {t("captcha.puzzle.instructions")}
      </p>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="w-full rounded-md touch-none cursor-pointer"
        style={{ imageRendering: "pixelated" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      />
    </div>
  );
};
