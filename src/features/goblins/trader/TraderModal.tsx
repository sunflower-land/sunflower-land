import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import { Button } from "components/ui/Button";
import { Context } from "features/game/GoblinProvider";
import { Cancel, Draft, MachineInterpreter } from "./lib/tradingPostMachine";
import { Drafting } from "./components/Drafting";
import { Confirming } from "./components/Confirming";
import { KNOWN_ITEMS } from "features/game/types";
import { Listing } from "./components/Listing";
import { ConfirmingCancel } from "./components/ConfirmingCancel";
import { ListingStatus } from "lib/blockchain/Trader";

export const TraderModal: React.FC<{ onClose: () => void }> = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  const child = goblinState.children.tradingPost as MachineInterpreter;

  const [machine, send] = useActor(child);

  const {
    farmSlots,
    draft,
    cancel: cancelledListing,
    slotId,
  } = machine.context;

  const list = (draft: Draft) => {
    child.send("LIST", { draft });
  };

  const cancel = (cancel: Cancel) => {
    child.send("CANCEL_LISTING", { cancel });
  };

  const post = () => {
    child.send("POST");
  };

  // const farmSlots: FarmSlot[] = [
  //   {
  //     slotId: 0,
  //     listing: { id: 500 },
  //   },
  //   {
  //     slotId: 1,
  //     listing: undefined,
  //   },
  //   {
  //     slotId: 2,
  //     listing: undefined,
  //   },
  // ];
  if (machine.matches("loading")) {
    return <span className="loading">Loading</span>;
  }

  if (machine.matches("drafting")) {
    return (
      <Drafting
        slotId={slotId}
        inventory={goblinState.context.state.inventory}
        onCancel={() => send("CANCEL")}
        onList={list}
      />
    );
  }

  if (machine.matches("confirming")) {
    return (
      <Confirming
        draft={draft}
        onCancel={() => send("CANCEL")}
        onConfirm={post}
      />
    );
  }

  if (machine.matches("posting")) {
    return <span className="loading">Posting</span>;
  }

  if (machine.matches("error")) {
    return <div>Error</div>;
  }

  if (machine.matches("confirmingCancel")) {
    return (
      <ConfirmingCancel
        onBack={() => send("BACK")}
        onConfirm={() => send("CONFIRM")}
        listingId={cancelledListing.listingId}
        resourceName={cancelledListing.resourceName}
        resourceAmount={cancelledListing.resourceAmount}
      />
    );
  }

  if (machine.matches("cancelling")) {
    return <span className="loading">Cancelling</span>;
  }

  return (
    <div className="p-2">
      <div className="flex justify-between mb-4">
        <p className="text-xxs sm:text-xs whitespace-nowrap">
          Free Trades: {0}
        </p>
        <p className="text-xxs sm:text-xs whitespace-nowrap">
          Remaining Trades: {0}
        </p>
      </div>

      {farmSlots?.map((farmSlot) => {
        // if empty return dashed
        if (
          !farmSlot.listing ||
          farmSlot.listing.status != ListingStatus.LISTED
        ) {
          return (
            <div
              key={farmSlot.slotId}
              className="border-4 border-dashed border-brown-600 mb-2 h-12 flex items-center justify-center"
            >
              <span
                className="text-xs"
                onClick={() => child.send("DRAFT", { slotId: farmSlot.slotId })}
              >
                + List Trade
              </span>
            </div>
          );
        }

        // if listed, return a listing UI
        return (
          <Listing
            onCancel={cancel}
            key={farmSlot.slotId}
            listingId={farmSlot.listing.id}
            resourceName={KNOWN_ITEMS[farmSlot.listing.resourceId]}
            resourceAmount={farmSlot.listing.resourceAmount}
            sfl={farmSlot.listing.sfl}
            fee={5}
          />
          // <div

          //   className="border-4 border-dashed border-brown-600  flex items-center justify-center"
          // >
          //   <span className="text-xs" onClick={() => send("DRAFT")}>
          //     {JSON.stringify(farmSlot.listing)}
          //     Listed
          //   </span>
          // </div>
        );
      })}

      <Button className="mr-1" onClick={onClose}>
        Close
      </Button>
    </div>
  );
};
