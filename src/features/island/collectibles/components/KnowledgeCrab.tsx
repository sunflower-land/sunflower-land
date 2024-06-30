import React from "react";

import knowledgeCrab from "assets/sfts/knowledge_crab.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const KnowledgeCrab: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 19}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -2}px`,
      }}
    >
      <img
        src={knowledgeCrab}
        style={{
          width: `${PIXEL_SCALE * 19}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute left-1/2 -translate-x-1/2"
        alt="Knowledge Crab"
      />
    </div>
  );
};
