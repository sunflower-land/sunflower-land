import React, { useContext } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { CONFIG } from "lib/config";

import shadow from "assets/npcs/shadow.png";
import { TypeTrait } from "features/game/types/buds";
import classNames from "classnames";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { SFTDetailPopoverInnerPanel } from "components/ui/SFTDetailPopover";
import { Label } from "components/ui/Label";
import { getBudBuffs } from "features/game/types/budBuffs";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import * as AuthProvider from "features/auth/lib/Provider";
import { useSelector } from "@xstate/react";
import useSWR from "swr";
import { loadTradeable } from "features/marketplace/actions/loadTradeable";
import { formatNumber } from "lib/utils/formatNumber";
import { AuthMachineState } from "features/auth/lib/authMachine";

export const budImageDomain =
  CONFIG.NETWORK === "mainnet" ? "buds" : "testnet-buds";

type Props = {
  id: string;
  type?: TypeTrait;
};

const _rawToken = (state: AuthMachineState) => state.context.user.rawToken;

export const BudDetailPopoverTradeDetails = ({ id }: { id: number }) => {
  const { t } = useAppTranslation();

  const { authService } = useContext(AuthProvider.Context);
  const rawToken = useSelector(authService, _rawToken);

  const { data: tradeable, error } = useSWR(
    ["collectibles", id, rawToken],
    ([, id, token]) =>
      loadTradeable({
        type: "buds",
        id: Number(id),
        token: token as string,
      }),
    { dedupingInterval: 60_000 }, // only refresh every minute
  );

  if (!tradeable || error || !tradeable.isActive) return null;

  return (
    <div className="flex flex-col gap-1">
      {tradeable.floor !== 0 && (
        <Label type="transparent" className="text-xs -ml-1">
          <span>{`${t("marketplace.price", { price: formatNumber(tradeable.floor, { decimalPlaces: 2 }) })} FLOWER`}</span>
        </Label>
      )}
      {tradeable.supply !== undefined && tradeable.supply > 0 && (
        <Label type="transparent" className="text-xs">
          <span className="text-xs -ml-1">
            {t("marketplace.supply", {
              supply: formatNumber(tradeable.supply, { decimalPlaces: 0 }),
            })}
          </span>
        </Label>
      )}
    </div>
  );
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
    <Popover>
      <PopoverButton as="div">
        <div
          className="absolute cursor-pointer"
          style={{
            width: `${PIXEL_SCALE * 32}px`,
            height: `${PIXEL_SCALE * 32}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${-PIXEL_SCALE * 0}px`,
          }}
        >
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
        </div>
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
          <BudDetailPopoverTradeDetails id={Number(id)} />
        </SFTDetailPopoverInnerPanel>
      </PopoverPanel>
    </Popover>
  );
};
