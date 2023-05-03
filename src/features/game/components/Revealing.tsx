import React from "react";

import { setImageWidth } from "lib/images";

interface Props {
  text?: string;
  icon: string;
}

export const Revealing: React.FC<Props> = ({ text, icon }) => {
  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-center mb-2">{text || "What could it be?"}</span>
      <img
        src={icon}
        alt="digging"
        className="my-2"
        onLoad={(e) => setImageWidth(e.currentTarget)}
      />
      <span
        className="text-center text-xs loading mb-1"
        style={{
          height: "24px",
        }}
      >
        Loading
      </span>
    </div>
  );
};
