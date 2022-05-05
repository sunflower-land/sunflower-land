import React, { useEffect, useState } from "react";

import { InnerPanel, OuterPanel } from "components/ui/Panel";
import {
  Button,
  CLASSNAMES_DEFAULT as buttonClasses,
  STYLES_DEFAULT as buttonStyles,
} from "components/ui/Button";

import classNames from "classnames";

import idle from "assets/npcs/idle.gif";
import arrowLeft from "assets/icons/arrow_left.png";
import arrowRight from "assets/icons/arrow_right.png";

// TODO - get tips from a better datasource
import tips from "public/tips.json";

const MAX_FAQ_HEIGHT = 90;
const FAQ_SLIDESHOW_INTERVAL = 5000; // 5 seconds

export const Tips: React.FC = () => {
  const [currentTipIndex, setCurrentTipIndex] = useState<number>(0);
  const [doSlideshow, setDoSlideshow] = useState<boolean>(true);

  // Allow the player to manually click through tips
  const handleArrowButtonClick = (direction: "left" | "right") => {
    setDoSlideshow(false);
    let newIndex =
      direction === "right" ? currentTipIndex + 1 : currentTipIndex - 1;
    if (newIndex < 0) {
      newIndex = tips.length - 1;
    }
    setCurrentTipIndex(newIndex % tips.length);
  };

  const handleSlideshowStopEvent = () => setDoSlideshow(false);

  // Auto slideshow FAQs
  useEffect(() => {
    if (!doSlideshow) {
      // Stop the slideshow whenever player clicks one of the arrows
      return;
    }
    const timer = setInterval(() => {
      setCurrentTipIndex((currentTipIndex + 1) % tips.length);
    }, FAQ_SLIDESHOW_INTERVAL);
    return () => {
      clearInterval(timer);
    };
  }, [currentTipIndex, doSlideshow]);

  const { tip, link } = tips[currentTipIndex];

  if (!tips || !tips.length) {
    return null;
  }

  return (
    <div className="relative">
      <OuterPanel className="ml-2">
        <h2 className="text-white p-1.5">Did you know?</h2>
        <InnerPanel>
          <div
            style={{ maxHeight: MAX_FAQ_HEIGHT }}
            className="overflow-y-auto scrollable"
            onClick={handleSlideshowStopEvent}
          >
            {/* Good for mobile to stop slideshow if tip text is pressed */}
            <p className="text-white text-shadow text-xs sm:text-sm px-1">
              {tip}
            </p>
          </div>
        </InnerPanel>
        <div className="flex justify-end py-1">
          <a
            onMouseEnter={handleSlideshowStopEvent}
            className={classNames(
              buttonClasses,
              "flex-1 w-auto h-10 px-4 mr-0.5"
            )}
            style={buttonStyles}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn More
          </a>
          <Button
            className="w-auto h-10 px-4 mr-0.5"
            onClick={() => handleArrowButtonClick("left")}
          >
            <img src={arrowLeft} />
          </Button>
          <Button
            className="w-auto h-10 px-4 mr-0.5"
            onClick={() => handleArrowButtonClick("right")}
          >
            <img src={arrowRight} />
          </Button>
        </div>
      </OuterPanel>
      <img
        src={idle}
        className="absolute -left-3 -bottom-3 w-54 scale-[4] mt-4"
      />
    </div>
  );
};
