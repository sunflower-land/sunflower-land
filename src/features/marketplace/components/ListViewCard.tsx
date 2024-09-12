import React, { useEffect, useState } from "react";
import { Label } from "components/ui/Label";
import Decimal from "decimal.js-light";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ButtonPanel } from "components/ui/Panel";
import classNames from "classnames";
import { CollectionName } from "features/game/types/marketplace";
import { CONFIG } from "lib/config";

import buds from "lib/buds/buds";
import testnetBuds from "lib/buds/testnet-buds";

import grass from "assets/brand/grass_background_2.png";
import smallBoost from "assets/icons/small_boost.png";
import brownBackground from "assets/brand/brown_background.png";

// bud backgrounds
import beachBackground from "assets/buds-backgrounds/beach_shadow.png";
import castleBackground from "assets/buds-backgrounds/castle_shadow.png";
import plazaBackground from "assets/buds-backgrounds/plaza_shadow.png";
import portBackground from "assets/buds-backgrounds/port_shadow.png";
import retreatBackground from "assets/buds-backgrounds/retreat_shadow.png";
import saphiroBackground from "assets/buds-backgrounds/saphiro_shadow.png";
import snowBackground from "assets/buds-backgrounds/snow_shadow.png";
import woodlandsBackground from "assets/buds-backgrounds/woodlands_shadow.png";
import caveBackground from "assets/buds-backgrounds/cave_shadow.png";
import seaBackground from "assets/buds-backgrounds/sea_shadow.png";
import { Bud, TypeTrait } from "lib/buds/types";
import { SUNNYSIDE } from "assets/sunnyside";

type Props = {
  name: string;
  image: string;
  type: CollectionName;
  id: number;
  hasBoost: boolean;
  supply: number;
  price?: Decimal;
  onClick?: () => void;
  onRemove?: () => void;
  isSold?: boolean;
};

const data = CONFIG.NETWORK === "mainnet" ? buds : testnetBuds;

export const ListViewCard: React.FC<Props> = ({
  name,
  id,
  image,
  supply,
  type,
  hasBoost,
  price,
  onClick,
  onRemove,
  isSold,
}) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      setSize({ width: img.width, height: img.height });
    };
  }, []);

  const getBackground = () => {
    if (type === "wearables" || type === "resources") {
      return `url(${brownBackground})`;
    }

    return `url(${grass})`;
  };

  return (
    <div className="relative cursor-pointer">
      {onRemove && (
        <img
          src={SUNNYSIDE.ui.disc_cancel}
          className="w-12 absolute -top-2 -right-2 cursor-pointer z-10 hover:scale-110"
          onClick={(e) => {
            e.preventDefault();

            onRemove();
          }}
        />
      )}
      <ButtonPanel onClick={onClick}>
        <div className="w-32 sm:w-40 flex flex-col">
          <div className="relative">
            <p className="text-white absolute top-1 left-1 text-xs">{`x${supply}`}</p>
            {type === "buds" ? (
              <BudImage image={image} id={id} />
            ) : (
              <div
                style={{
                  backgroundImage: getBackground(),
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
                className="w-full h-40 rounded-md flex justify-center items-center"
              >
                <img
                  src={image}
                  className={classNames("object-contain", {
                    "max-h-[80%]": size.height > size.width,
                    "max-w-[80%]": size.width > size.height,
                  })}
                  style={{
                    height: `${size.height * PIXEL_SCALE}px`,
                    width: `${size.width * PIXEL_SCALE}px`,
                  }}
                />
                {hasBoost && (
                  <img src={smallBoost} className="absolute top-1 right-1" />
                )}
              </div>
            )}
          </div>

          <div className="my-1 pb-5 min-h-[60px]">
            <p>{name}</p>
          </div>
        </div>
      </ButtonPanel>

      {price && (
        <Label
          className="absolute bottom-0 left-0 !w-full"
          type="warning"
        >{`${price} SFL`}</Label>
      )}

      {isSold && (
        <Label
          className="absolute left-0 !w-full mt-20"
          type="danger"
          style={{
            bottom: "50%",
            transform: "translateY(calc(-50% + 10px))",
          }}
        >{`Sold`}</Label>
      )}
    </div>
  );
};

const BUD_BACKGROUNDS: Record<TypeTrait, string> = {
  Plaza: plazaBackground,
  Woodlands: woodlandsBackground,
  Cave: caveBackground,
  Sea: seaBackground,
  Castle: castleBackground,
  Port: portBackground,
  Retreat: retreatBackground,
  Saphiro: saphiroBackground,
  Snow: snowBackground,
  Beach: beachBackground,
};

const BudImage = ({ id, image }: { id: number; image: string }) => {
  const [bud] = useState<Bud>(data[id]);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      setSize({ width: img.width, height: img.height });
    };
  }, []);

  const background = `url(${BUD_BACKGROUNDS[bud.type]})`;
  const offsets: Record<TypeTrait, { left: number; top: number }> = {
    Beach: { left: 40, top: 30 },
    Castle: { left: 37, top: 24 },
    Plaza: { left: 39, top: 20 },
    Woodlands: { left: 36, top: 33 },
    Cave: { left: 36, top: 28 },
    Sea: { left: 41, top: 30 },
    Port: { left: 39, top: 22 },
    Retreat: { left: 37, top: 28 },
    Saphiro: { left: 36, top: 32 },
    Snow: { left: 38, top: 25 },
  };

  return (
    <div className="relative">
      <p
        className={classNames("text-white absolute top-1 left-1 text-xs", {
          "text-black": bud.type === "Snow",
        })}
      >{`x1`}</p>
      <div
        style={{
          backgroundImage: background,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
        className="w-full h-40 rounded-md flex justify-center items-center"
      >
        <img
          src={image}
          className={classNames("object-contain absolute", {
            "max-h-[80%]": size.height > size.width,
            "max-w-[80%]": size.width > size.height,
          })}
          style={{
            height: `${size.height * PIXEL_SCALE}px`,
            width: `${size.width * PIXEL_SCALE}px`,
            ...(offsets[bud?.type as TypeTrait] && {
              left: `${offsets[bud?.type as TypeTrait].left}px`,
              top: `${offsets[bud?.type as TypeTrait].top}px`,
            }),
          }}
        />
      </div>
    </div>
  );
};
