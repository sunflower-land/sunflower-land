import React, { useContext, useRef } from "react";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import { InnerPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { GameState, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { ItemDetail } from "features/marketplace/components/rewards/ItemDetail";
import { getItemBuffLabel } from "features/world/ui/megastore/MegaStore";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { Label } from "./Label";
import useSWR from "swr";
import { loadTradeable } from "features/marketplace/actions/loadTradeable";
import { CollectionName } from "features/game/types/marketplace";
import { KNOWN_IDS } from "features/game/types";
import { useSelector } from "@xstate/react";
import * as AuthProvider from "features/auth/lib/Provider";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { Context } from "features/game/GameProvider";
import { MachineInterpreter } from "features/game/lib/gameMachine";

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

export const SFTDetailPopoverBuffs = ({
  name,
}: {
  name: InventoryItemName;
}) => {
  const { gameService } = useContext(Context);

  // Although this reference to state could be stale if the machine updates
  // while this component is mounted, most the time the component is not mounted.
  const buff = COLLECTIBLE_BUFF_LABELS(gameService.getSnapshot().context.state)[
    name
  ];

  return (
    <div className="space-y-1">
      {!!buff && (
        <div className="flex flex-col gap-1">
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
      )}
    </div>
  );
};

export const SFTDetailPopoverTradeDetails = ({
  name,
}: {
  name: InventoryItemName;
}) => {
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

  if (!tradeable || error) return null;

  return (
    <>
      {tradeable.supply !== 0 && (
        <div className="text-xs">Supply: {tradeable.supply}</div>
      )}
      {tradeable.floor !== 0 && (
        <div className="text-xs">Floor: {tradeable.floor}</div>
      )}
    </>
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
      <div className="flex flex-col space-y-1 p-1">{children}</div>
    </InnerPanel>
  );
};

const SFTDetailPopoverContent = ({ name }: { name: InventoryItemName }) => {
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
      <PopoverButton as="span" className="cursor-pointer">
        {children}
      </PopoverButton>
      <PopoverPanel
        anchor={{ to: "left" }}
        className="flex pointer-events-none"
      >
        <SFTDetailPopoverContent name={name} />
      </PopoverPanel>
    </Popover>
  );
};
