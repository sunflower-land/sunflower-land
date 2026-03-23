import React, { useState, useEffect } from "react";
import { EventBus } from "../../lib/EventBus";
import { Box } from "components/ui/Box";
import { Label } from "components/ui/Label";

import cabbage from "public/world/portal/images/cabbage.png";
import banana from "public/world/portal/images/banana.png";
import potato from "public/world/portal/images/potato.png";
import cannon from "public/world/portal/images/cannon_icon.png";

const FOOD_IMAGES = [cabbage, potato, banana];

export const Food: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<string>(cabbage);

  useEffect(() => {
    let isSpinning = false;
    const handleShoot = () => {
      if (isSpinning) return;
      isSpinning = true;

      let cycles = 0;
      const interval = setInterval(() => {
        setCurrentImage(FOOD_IMAGES[Math.floor(Math.random() * FOOD_IMAGES.length)]);
        cycles++;
        if (cycles >= 10) {
          clearInterval(interval);
          setCurrentImage(FOOD_IMAGES[Math.floor(Math.random() * FOOD_IMAGES.length)]);
          isSpinning = false;
        }
      }, 50);
    };

    EventBus.on("player-shoot", handleShoot);

    return () => {
      EventBus.off("player-shoot", handleShoot);
    };
  }, []);

  return (
    <div className="flex flex-col w-fit items-center">
      <Label type="default" icon={cannon}>Next</Label>
      <Box image={currentImage} />
    </div>
  );
};
