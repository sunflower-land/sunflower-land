import React from "react";
import { ImageStyle } from "./template/ImageStyle";
import { useVisiting } from "lib/utils/visitUtils";

<img className="w-full" src={SUNNYSIDE.icons.disc} />
{isDragging ? (
  <img
    className="absolute"
    src={SUNNYSIDE.icons.dragging}
    style={{
      width: `${PIXEL_SCALE * 12}px`,
      right: `${PIXEL_SCALE * 4}px`,
      top: `${PIXEL_SCALE * 4}px`,
    }}
  />
) 

export const Monument: React.FC<React.ComponentProps<typeof ImageStyle>> = (
  input,
) => {
  const { isVisiting } = useVisiting();

  return (
    <>
      <ImageStyle {...input} />
      {isVisiting && <div className="absolute top-0 right-0">HAAAY</div>}
    </>
  );
};
