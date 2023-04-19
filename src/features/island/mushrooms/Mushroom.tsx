import React, { useContext, useEffect, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";

interface Props {
  id: string;
  isFirstRender: boolean;
}

export const Mushroom: React.FC<Props> = ({ id, isFirstRender }) => {
  const { gameService } = useContext(Context);

  const pickMushroom = (id: string) => {
    gameService.send("mushroom.picked", { id });
  };

  const [grow, setGrow] = useState(false);

  useEffect(() => {
    setGrow(!isFirstRender);
  }, []);

  return (
    <>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight flex items-center justify-center"
        onClick={() => pickMushroom(id)}
      >
        <div className={grow ? "treasure-reward" : ""}>
          <img
            src={SUNNYSIDE.resource.wild_mushroom}
            className="mushroom-bulge-repeat"
            style={{
              animationDelay: `${Math.random() * 15000}ms`,
              width: `${PIXEL_SCALE * 10}px`,
            }}
          />
        </div>
      </div>
    </>
  );
};
