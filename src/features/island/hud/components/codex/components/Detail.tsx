import React, { useLayoutEffect } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { InventoryItemName } from "features/game/types/game";
import bg from "assets/ui/brown_background.png";

import { getOpenSeaLink } from "../lib/utils";
import { KNOWN_IDS } from "features/game/types";
import { ITEM_DETAILS } from "features/game/types/images";
import { Label } from "components/ui/Label";
import classNames from "classnames";

/**
 * Base Layout for Collectible Item Details Page in Codex
 * It can be extended by passing in addition children components
 */
type Props = {
  name: InventoryItemName;
  caught: boolean;
  /**
   * These labels will be rendered on the right side of the page along with any associated boost labels
   */
  additionalLabels?: React.ReactNode;
  children?: React.ReactNode;
  onBack: () => void;
};

export const Detail: React.FC<Props> = ({
  name,
  caught,
  onBack,
  additionalLabels,
  children,
}) => {
  const {
    image,
    description,
    howToGetItem = [],
    buff,
    itemType,
  } = ITEM_DETAILS[name];
  const [imageWidth, setImageWidth] = React.useState<number>(0);

  useLayoutEffect(() => {
    const image = new Image();

    image.onload = function () {
      const trueWidth = image.width;
      const scaledWidth = trueWidth * PIXEL_SCALE;

      setImageWidth(scaledWidth);
    };

    image.src = ITEM_DETAILS[name].image;
  }, []);

  return (
    <div className="p-2 relative">
      <div className="flex mb-2">
        <div
          className="flex items-start"
          style={{
            width: `${PIXEL_SCALE * 11}px`,
            height: `${PIXEL_SCALE * 11}px`,
          }}
        >
          <img
            src={SUNNYSIDE.icons.arrow_left}
            className="cursor-pointer flex-none"
            onClick={onBack}
            style={{
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
        </div>
        <div className="flex-1 flex justify-center">
          <h2 className="text-center">{name}</h2>
        </div>
        <div
          className="flex-none"
          style={{
            width: `${PIXEL_SCALE * 11}px`,
          }}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex gap-1">
          <div
            className="w-3/5 sm:w-1/2 sm:min-w-[50%] rounded-md overflow-hidden shadow-md mr-2 flex justify-center items-center h-40"
            style={{
              backgroundImage: `url(${bg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <img
              src={image}
              alt={name}
              className={classNames({ "brightness-0": !caught })}
              style={{
                width: `${imageWidth}px`,
              }}
            />
          </div>
          <div className="flex content-start flex-col sm:flex-row sm:flex-wrap gap-2">
            {additionalLabels}
            {/* Boost labels to go below */}
            {!!buff && (
              <Label
                type={buff.labelType}
                icon={buff.boostTypeIcon}
                secondaryIcon={buff.boostedItemIcon}
              >
                {buff.shortDescription}
              </Label>
            )}
            {!!itemType && (
              <Label type="default" className="capitalize">
                {itemType}
              </Label>
            )}
          </div>
        </div>
        <p className="text-xs">{description}</p>
        <div className="border-b-[1px] border-brown-600 mt-3" />
        {howToGetItem.length > 0 && (
          <div className="flex flex-col">
            <h3 className="text-sm mb-2">How to get this item?</h3>
            <ul className="text-xxs space-y-1">
              {howToGetItem.map((text, index) => (
                <li className="flex" key={`how-to-obtain-${index}`}>
                  <div className="mr-1">-</div>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Additional Information */}
        {children}
        <div className="flex items-center text-xxs">
          <span>
            View item on{" "}
            <a
              href={getOpenSeaLink(KNOWN_IDS[name], "collectible")}
              className="underline text-xxs pb-1 pt-0.5 hover:text-blue-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenSea
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};
