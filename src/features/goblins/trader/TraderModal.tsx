import React, { useContext } from "react";

import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GoblinProvider";
import { useActor } from "@xstate/react";
import { Draft, MachineInterpreter } from "./lib/tradingPostMachine";
import { FarmSlot } from "lib/blockchain/Trader";
import { Drafting } from "./components/Drafting";
import { Confirming } from "./components/Confirming";

export const TraderModal: React.FC<{ onClose: () => void }> = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  const child = goblinState.children.tradingPost as MachineInterpreter;

  const [machine, send] = useActor(child);

  const { farmSlots, draft } = machine.context;

  const list = (draft: Draft) => {
    child.send("LIST", { draft });
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

  return (
    <div className="p-2">
      <div className="flex justify-between mb-4">
        <p className="text-xs">Free Trades: {0}</p>
        <p className="text-xs">Remaining Trades: {0}</p>
      </div>

      {farmSlots?.map((farmSlot) => {
        // if empty return dashed
        return (
          <div className="border-4 border-dashed border-brown-600 mb-2 h-12 flex items-center justify-center">
            <span className="text-xs" onClick={() => send("DRAFT")}>
              + List Trade
            </span>
          </div>
        );

        // if listed, return a listing UI
      })}

      <Button className="mr-1" onClick={onClose}>
        Close
      </Button>
    </div>
  );
};
