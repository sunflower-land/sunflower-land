import React, { useMemo, CSSProperties } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import classNames from "classnames";
import tier1Book from "src/assets/icons/tier1_book.webp";
import tier2Book from "src/assets/icons/tier2_book.webp";
import tier3Book from "src/assets/icons/tier3_book.webp";
import { NPC_WEARABLES, NPCName } from "lib/npcs";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { BumpkinSkillTier } from "features/game/types/bumpkinSkills";

interface Props {
  icon?: string;
  width?: number;
  className?: string;
  style?: CSSProperties;
  tier: BumpkinSkillTier;
  npc?: NPCName;
}

const TIER_BOOKS: Record<number, string> = {
  1: tier1Book,
  2: tier2Book,
  3: tier3Book,
};

const getImage = (iconWidth: number, icon?: string) => {
  if (!icon) {
    return;
  }
  const scaledWidth = iconWidth * 0.5;
  return (
    <img
      src={icon}
      alt="item"
      style={{
        opacity: "0",
        position: "relative",
        top: "-7px",
        left: "7px",
        maxWidth: `40px`,
        maxHeight: `40px`,
        transformOrigin: "center",
      }}
      onLoad={(e) => {
        // get max dimension
        const width = e.currentTarget?.naturalWidth;
        const height = e.currentTarget?.naturalHeight;
        if (!width || !height) {
          return;
        }
        const maxDimension = Math.max(width, height);

        // image scale to match pixel size or fit inner box
        let scale = 1;

        // scale image to match pixel scale if image is small enough
        if (maxDimension <= scaledWidth) {
          scale = PIXEL_SCALE;
        }

        // scale image to fit inner frame if image is scaling image to pixel scale will overflow the inner frame
        else if (width < scaledWidth * PIXEL_SCALE) {
          scale = (scaledWidth * PIXEL_SCALE) / width;
        }

        // shrink image to fit inner frame if image is large and height is greater than width
        if (maxDimension > scaledWidth && height > width) {
          scale *= width / height;
        }

        // scale and show image
        e.currentTarget.style.transform = `scale(${scale})`;
        e.currentTarget.style.opacity = "1";
      }}
    />
  );
};

export const SkillSquareIcon: React.FC<Props> = ({
  icon,
  width = 14,
  className,
  style,
  tier,
  npc,
}) => {
  const item = useMemo(() => getImage(width, icon), [width, icon]);

  return (
    <div
      className={classNames("flex justify-center items-center", className)}
      style={{
        width: `${PIXEL_SCALE * width}px`,
        height: `${PIXEL_SCALE * width}px`,
        backgroundImage: tier ? `url(${TIER_BOOKS[tier]})` : undefined,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        ...style,
      }}
    >
      {npc ? (
        <div
          style={{
            position: "relative",
            top: "-5px",
            left: "4px",
          }}
        >
          <NPCIcon parts={NPC_WEARABLES[npc]} />
        </div>
      ) : (
        item
      )}
    </div>
  );
};
