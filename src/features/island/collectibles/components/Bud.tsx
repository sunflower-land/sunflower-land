import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { CONFIG } from "lib/config";

import shadow from "assets/npcs/shadow.png";
import { TypeTrait } from "features/game/types/buds";
import classNames from "classnames";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { SFTDetailPopoverInnerPanel } from "components/ui/SFTDetailPopover";
import { Label } from "components/ui/Label";
import { getBudBuffs } from "features/game/types/budBuffs";

export const budImageDomain =
  CONFIG.NETWORK === "mainnet" ? "buds" : "testnet-buds";

type Props = {
  id: string;
  type?: TypeTrait;
};

const BudDetailPopoverBuffs = ({ id }: { id: number }) => {
  const buffs = getBudBuffs(id);

  if (!buffs) return null;

  return (
    <div className="flex flex-col gap-3">
      {buffs.map(
        (
          { labelType, boostTypeIcon, boostedItemIcon, shortDescription },
          index,
        ) => (
          <Label
            key={index}
            type="transparent"
            icon={boostTypeIcon}
            secondaryIcon={boostedItemIcon}
            className="mx-2"
          >
            <span>{shortDescription}</span>
          </Label>
        ),
      )}
    </div>
  );
};

export const Bud: React.FC<Props> = ({ id, type }) => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 32}px`,
        height: `${PIXEL_SCALE * 32}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${-PIXEL_SCALE * 0}px`,
      }}
    >
      <Popover>
        <PopoverButton>
          <img
            src={shadow}
            style={{
              width: `${16 * PIXEL_SCALE}px`,
              bottom: 0,
            }}
            className="absolute"
          />
          <img
            src={`https://${budImageDomain}.sunflower-land.com/images/${id}.webp`}
            className={classNames("absolute w-full -translate-x-1/4", {
              "top-1": type === "Retreat",
            })}
            alt={`Bud ${id}`}
          />
        </PopoverButton>
        <PopoverPanel anchor={{ to: "left start" }}>
          <SFTDetailPopoverInnerPanel>
            <div className="flex space-x-1 relative">
              <img
                src={`https://${budImageDomain}.sunflower-land.com/images/${id}.webp`}
                className="absolute"
                style={{
                  width: `48px`,
                  bottom: "-4px",
                  left: "-15px",
                }}
              />

              <span
                className="text-xs whitespace-nowrap underline"
                style={{ paddingLeft: "20px" }}
              >{`Bud ${id}`}</span>
            </div>
            <BudDetailPopoverBuffs id={Number(id)} />
          </SFTDetailPopoverInnerPanel>
        </PopoverPanel>
      </Popover>
    </div>
  );
};
