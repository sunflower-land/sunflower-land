import React from "react";
import type { GameState } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "lib/object";
import {
  EVENT_COLLECTIONS,
  getEventCollectionForDisplay,
} from "features/game/types/eventCollections";
import { CollectionPanel } from "../components/CollectionPanel";

type Props = {
  state: GameState;
  onClose: () => void;
};

export const EventCollections: React.FC<Props> = ({ state, onClose }) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto scrollable">
      <div className="space-y-2 mt-1 px-1">
        {getKeys(EVENT_COLLECTIONS).map((event) => {
          const { collectibles, wearables } =
            getEventCollectionForDisplay(event);

          return (
            <CollectionPanel
              key={event}
              title={event}
              icon={ITEM_DETAILS[EVENT_COLLECTIONS[event].token].image}
              collection={{ event }}
              collectibles={collectibles}
              wearables={wearables}
              state={state}
              onClose={onClose}
            />
          );
        })}
      </div>
    </div>
  );
};
