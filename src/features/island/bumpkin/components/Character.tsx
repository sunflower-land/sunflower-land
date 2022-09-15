import {
  BumpkinBody,
  BumpkinItems,
  BumpkinPants,
  BumpkinShirt,
  BumpkinHair,
} from "features/game/types/bumpkin";
import React, { useEffect, useRef, useState } from "react";

// Bodies
import lightFarmer from "assets/bumpkins/small/body/beige_farmer.gif";
import lightBrownFarmer from "assets/bumpkins/small/body/light_brown_farmer.gif";
import darkBrownFarmer from "assets/bumpkins/small/body/dark_brown_farmer.gif";
import goblin from "assets/bumpkins/small/body/goblin.gif";

// Hair
import basic from "assets/bumpkins/small/hair/basic.gif";
import explorer from "assets/bumpkins/small/hair/explorer.gif";

// Shirts
import redFarmerShirt from "assets/bumpkins/small/shirts/red_farmer_shirt.gif";
import yellowFarmerShirt from "assets/bumpkins/small/shirts/yellow_farmer_shirt.gif";
import blueFarmerShirt from "assets/bumpkins/small/shirts/blue_farmer_shirt.gif";

// Miscellaneous
import shadow from "assets/npcs/shadow.png";
import cancel from "assets/icons/cancel.png";

// Pants
import farmerOveralls from "assets/bumpkins/small/pants/farmer_overalls.gif";
import lumberjackOveralls from "assets/bumpkins/small/pants/lumberjack_overalls.gif";
import farmerPants from "assets/bumpkins/small/pants/lumberjack_overalls.gif"; // TODO
import { PIXEL_SCALE, POPOVER_TIME_MS } from "features/game/lib/constants";
import classNames from "classnames";
import { HealthBar } from "components/ui/HealthBar";

const HITS = 2;

const PARTS: Partial<Record<BumpkinItems, string>> = {
  // Bodies
  "Beige Farmer Potion": lightFarmer,
  "Dark Brown Farmer Potion": darkBrownFarmer,
  "Light Brown Farmer Potion": lightBrownFarmer,
  "Goblin Potion": goblin,

  // Hair
  "Basic Hair": basic,
  "Explorer Hair": explorer,

  // Shirts
  "Red Farmer Shirt": redFarmerShirt,
  "Yellow Farmer Shirt": yellowFarmerShirt,
  "Blue Farmer Shirt": blueFarmerShirt,

  // Pants
  "Farmer Overalls": farmerOveralls,
  "Lumberjack Overalls": lumberjackOveralls,
  "Farmer Pants": farmerPants,
};

interface Props {
  body: BumpkinBody;
  hair?: BumpkinHair;
  shirt?: BumpkinShirt;
  pants?: BumpkinPants;
}

export const Character: React.FC<Props> = ({ body, hair, shirt, pants }) => {
  const [showPopover, setShowPopover] = useState(false);
  const [touchCount, setTouchCount] = useState(0);

  const characterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        characterRef.current &&
        !characterRef.current.contains(event.target)
      ) {
        setTouchCount(0);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const displayPopover = async () => {
    setShowPopover(true);
    await new Promise((resolve) => setTimeout(resolve, POPOVER_TIME_MS));
    setShowPopover(false);
  };

  const eat = () => console.log("Yummy");

  const shake = () => {
    const foodSelected = true;

    if (!foodSelected) {
      displayPopover();
      return;
    }

    // Play audio

    // Shake bumpkin
    setTouchCount((count) => count + 1);

    if (touchCount > 0 && touchCount === HITS - 1) {
      eat();
      setTouchCount(0);
    }
  };

  return (
    <div
      className="w-full cursor-pointer hover:img-highlight"
      onClick={() => shake()}
      ref={characterRef}
    >
      <img
        src={PARTS[body]}
        className="z-0"
        style={{ width: `${20 * PIXEL_SCALE}px` }}
      />
      {hair && (
        <img src={PARTS[hair]} className="absolute w-full inset-0 z-10" />
      )}
      {shirt && (
        <img src={PARTS[shirt]} className="absolute w-full inset-0 z-20" />
      )}
      {pants && (
        <img src={PARTS[pants]} className="absolute w-full inset-0 z-30" />
      )}
      <img
        src={shadow}
        style={{
          width: `${PIXEL_SCALE * 15}px`,
        }}
        className="absolute w-full -bottom-1.5 -z-10 left-1.5"
      />
      <div
        className={classNames(
          "transition-opacity absolute -bottom-4 w-full z-40 pointer-events-none flex justify-center",
          {
            "opacity-100": showPopover,
            "opacity-0": !showPopover,
          }
        )}
      >
        <img className="w-5" src={cancel} />
      </div>
      <div
        className={classNames(
          "transition-opacity pointer-events-none absolute -bottom-5 left-2",
          {
            "opacity-100": touchCount > 0,
            "opacity-0": touchCount === 0,
          }
        )}
      >
        <HealthBar percentage={(touchCount / 2) * 100} />
      </div>
    </div>
  );
};
