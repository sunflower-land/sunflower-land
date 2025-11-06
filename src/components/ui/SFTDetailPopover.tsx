import React, { useContext } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { InnerPanel } from "components/ui/Panel";
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { Label } from "./Label";
import useSWR from "swr";
import { loadTradeable } from "features/marketplace/actions/loadTradeable";
import { KNOWN_IDS } from "features/game/types";
import { useSelector } from "@xstate/react";
import * as AuthProvider from "features/auth/lib/Provider";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { Context } from "features/game/GameProvider";
import { formatNumber } from "lib/utils/formatNumber";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CONFIG } from "lib/config";

const _rawToken = (state: AuthMachineState) => state.context.user.rawToken;

export const SFTDetailPopoverLabel = ({
  name,
}: {
  name: InventoryItemName;
}) => {
  return (
    <div className="flex space-x-1">
      <Label
        type="transparent"
        className="ml-2 underline"
        icon={ITEM_DETAILS[name].image}
      >
        <span className="text-xs whitespace-nowrap">{name}</span>
      </Label>
    </div>
  );
};

const SFTDetailPopoverBuffsImplementation = ({
  name,
}: {
  name: InventoryItemName;
}) => {
  const { gameService } = useContext(Context);

  const state = gameService.getSnapshot().context.state;
  const buff = COLLECTIBLE_BUFF_LABELS[name]?.({
    skills: state.bumpkin.skills,
    collectibles: state.collectibles,
  });

  if (!buff) return null;

  return (
    <div className="flex flex-col gap-3">
      {buff.map(
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

export const SFTDetailPopoverBuffs = ({
  name,
}: {
  name: InventoryItemName;
}) => {
  // annoying bug on hot reloads - seems to crash the app
  if (CONFIG.NETWORK !== "mainnet") return null;

  return <SFTDetailPopoverBuffsImplementation name={name} />;
};

export const SFTDetailPopoverTradeDetails = ({
  name,
}: {
  name: InventoryItemName;
}) => {
  const { t } = useAppTranslation();

  const { authService } = useContext(AuthProvider.Context);
  const rawToken = useSelector(authService, _rawToken);

  const { data: tradeable, error } = useSWR(
    ["collectibles", KNOWN_IDS[name], rawToken],
    ([, id, token]) =>
      loadTradeable({
        type: "collectibles",
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

export const SFTDetailPopoverInnerPanel = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <InnerPanel
      className="drop-shadow-lg cursor-pointer"
      style={{ maxWidth: "16rem" }} // max-w-3xs in tailwind 4.1
    >
      <div className="flex flex-col space-y-2 p-1">{children}</div>
    </InnerPanel>
  );
};

export const SFTDetailPopoverContent = ({
  name,
}: {
  name: InventoryItemName;
}) => {
  return (
    <SFTDetailPopoverInnerPanel>
      <SFTDetailPopoverLabel name={name} />
      <SFTDetailPopoverBuffs name={name} />
      <SFTDetailPopoverTradeDetails name={name} />
    </SFTDetailPopoverInnerPanel>
  );
};

export const SFTDetailPopover = ({
  name,
  children,
}: {
  name: InventoryItemName;
  children: React.ReactNode;
}) => {
  return (
    <Popover>
      <PopoverButton as="div" className="cursor-pointer">
        {children}
      </PopoverButton>
      <PopoverPanel
        anchor={{ to: "left start" }}
        className="flex pointer-events-none"
      >
        <SFTDetailPopoverContent name={name} />
      </PopoverPanel>
    </Popover>
  );
};
