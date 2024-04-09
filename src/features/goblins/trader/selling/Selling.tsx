import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import { Context } from "features/game/GoblinProvider";
import { KNOWN_ITEMS } from "features/game/types";
import { Button } from "components/ui/Button";

import { MachineInterpreter as TradingPostMachineInterpreter } from "../tradingPost/lib/tradingPostMachine";
import { MachineInterpreter as SellingMachineInterpreter } from "./lib/sellingMachine";
import { Idle } from "./components/Idle";
import { Cancelling } from "./components/Cancelling";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const TAX = 0.1;

export const Selling: React.FC = () => {
  const { t } = useAppTranslation();
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  const tradingPostService = goblinState.children
    .tradingPost as TradingPostMachineInterpreter;
  const [tradingPostState] = useActor(tradingPostService);

  const sellingService = tradingPostState.children
    .selling as SellingMachineInterpreter;
  const [machine, send] = useActor(sellingService);

  if (machine.matches("idle")) {
    return (
      <Idle
        farmId={tradingPostState.context.farmId}
        freeListings={tradingPostState.context.freeListings}
        remainingListings={tradingPostState.context.remainingListings}
        farmSlots={tradingPostState.context.farmSlots}
        onCancel={(listing) =>
          sellingService.send("CANCEL_LISTING", { listing })
        }
      />
    );
  }

  if (machine.matches("cancelling")) {
    return (
      <Cancelling
        listingId={machine.context.cancellingListing.id}
        resourceName={KNOWN_ITEMS[machine.context.cancellingListing.resourceId]}
        resourceAmount={machine.context.cancellingListing.resourceAmount}
        onBack={() => send("BACK")}
        onConfirm={() => send("CONFIRM")}
      />
    );
  }

  // This should never show, call the parent machine to exit.
  return (
    <>
      <div className="flex items-center border-2 rounded-md border-black p-2 mb-2 bg-[#f77621]">
        <img
          src={SUNNYSIDE.icons.expression_alerted}
          alt="alert"
          className="mr-2 w-6"
        />
        <span className="text-xs">{t("error.wentWrong")}</span>
      </div>
      <Button onClick={() => tradingPostService.send("CLOSE")}>
        {t("close")}
      </Button>
    </>
  );
};
