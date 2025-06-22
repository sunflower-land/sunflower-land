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

const _rawToken = (state: AuthMachineState) => state.context.user.rawToken;

const SFTDetailPopoverContent = ({
  name,
  state,
}: {
  name: InventoryItemName;
  state: GameState;
}) => {
  const { authService } = useContext(AuthProvider.Context);
  const rawToken = useSelector(authService, _rawToken);

  const buff = COLLECTIBLE_BUFF_LABELS(state)[name];

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

  return (
    <InnerPanel
      className="drop-shadow-lg cursor-pointer"
      style={{ maxWidth: "16rem" }} // max-w-3xs in tailwind 4.1
    >
      <div className="flex flex-col mb-1">
        <div className="flex space-x-1">
          <Label
            type="transparent"
            className="ml-2"
            icon={ITEM_DETAILS[name].image}
          >
            <span className="text-xs whitespace-nowrap">{name}</span>
          </Label>
        </div>
        <div className="space-y-1">
          {!!buff && (
            <div className="flex flex-col gap-1">
              {buff.map(
                (
                  {
                    labelType,
                    boostTypeIcon,
                    boostedItemIcon,
                    shortDescription,
                  },
                  index,
                ) => (
                  <Label
                    key={index}
                    type={labelType}
                    icon={boostTypeIcon}
                    secondaryIcon={boostedItemIcon}
                  >
                    {shortDescription}
                  </Label>
                ),
              )}
            </div>
          )}
        </div>
        {tradeable && !error && (
          <>
            <div className="text-xs">Supply: {tradeable?.supply}</div>
            <div className="text-xs">Floor: {tradeable?.floor}</div>
          </>
        )}
      </div>
    </InnerPanel>
  );
};
export const SFTDetailPopover = ({
  name,
  state,
  children,
}: {
  name: InventoryItemName;
  state: GameState;
  children: React.ReactNode;
}) => {
  return (
    <Popover>
      <PopoverButton as="span">{children}</PopoverButton>
      <PopoverPanel anchor={{ to: "left" }} className="flex">
        <SFTDetailPopoverContent name={name} state={state} />
      </PopoverPanel>
    </Popover>
  );

  return (
    <Transition
      appear={true}
      id="ingredients-info-panel"
      show={true}
      enter="transition-opacity transition-transform duration-200"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      className={`flex absolute z-40`}
      onClick={(e) => {
        e.stopPropagation();
        // onClick();
      }}
    >
      <InnerPanel className="drop-shadow-lg cursor-pointer max-w-md">
        <div className="flex flex-col mb-1">
          <div className="flex space-x-1">
            <Label
              type="transparent"
              className="ml-2"
              icon={ITEM_DETAILS[name].image}
            >
              <span className="text-xs whitespace-nowrap">{name}</span>
            </Label>
          </div>
          <div className="space-y-1">
            {!!buff && (
              <div className="flex flex-col gap-1">
                {buff.map(
                  (
                    {
                      labelType,
                      boostTypeIcon,
                      boostedItemIcon,
                      shortDescription,
                    },
                    index,
                  ) => (
                    <Label
                      key={index}
                      type={labelType}
                      icon={boostTypeIcon}
                      secondaryIcon={boostedItemIcon}
                    >
                      {shortDescription}
                    </Label>
                  ),
                )}
              </div>
            )}
            {tradeable && (
              <>
                <div className="text-xs">Supply: {tradeable?.supply}</div>
                <div className="text-xs">Floor: {tradeable?.floor}</div>
              </>
            )}
            {/* {ingredients.map((ingredient) => (
              <div
                key={String(ingredient)}
                className="capitalize space-x-1 text-xs flex items-center"
              >
                <img
                  src={ITEM_DETAILS[ingredient].image}
                  alt={ingredient}
                  className="w-3"
                />
                <span className="text-xs">{ingredient}</span>
              </div>
            ))} */}
          </div>
        </div>
      </InnerPanel>
    </Transition>
  );
};
