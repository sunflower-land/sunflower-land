import React, { useContext, useEffect } from "react";
import { useActor } from "@xstate/react";
import { useSearchParams } from "react-router-dom";

import { Button } from "components/ui/Button";
import { Context } from "features/game/GoblinProvider";

import { MachineInterpreter as TradingPostMachineInterpreter } from "../tradingPost/lib/tradingPostMachine";
import { MachineInterpreter as BuyingMachineInterpreter } from "./lib/buyingMachine";
import { Idle } from "./components/Idle";
import { Confirming } from "./components/Confirming";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Buying: React.FC = () => {
  const { t } = useAppTranslation();

  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  const tradingPostService = goblinState.children
    .tradingPost as TradingPostMachineInterpreter;
  const [tradingPostState] = useActor(tradingPostService);

  const buyingService = tradingPostState.children
    .buying as BuyingMachineInterpreter;
  const [machine, send] = useActor(buyingService);

  const [searchParams] = useSearchParams();

  // Support deep-link to auto-visit a farm's listings
  useEffect(() => {
    const farmId = searchParams.get("viewListingsForLand") ?? "";
    const isValidFarmId = /^\d+$/.test(farmId); // Ensure it's a valid farm ID before proceeding.
    if (!isValidFarmId) return;
    buyingService.send("LOAD_FARM", { farmId });
  }, [searchParams]);

  if (machine.matches("idle")) {
    return (
      <Idle
        visitingFarmId={machine.context.visitingFarmId}
        visitingFarmSlots={machine.context.visitingFarmSlots}
        balance={goblinState.context.state.balance}
        onVisit={(farmId) => buyingService.send("LOAD_FARM", { farmId })}
        onPurchase={(listing) => buyingService.send("PURCHASE", { listing })}
      />
    );
  }

  if (machine.matches("confirming")) {
    return (
      <Confirming
        balance={goblinState.context.state.balance}
        listing={machine.context.purchasingListing}
        onBack={() => send("BACK")}
        onConfirm={() => send("CONFIRM")}
      />
    );
  }

  if (machine.matches("loadingFarm")) {
    return <span className="loading m-2">Loading</span>;
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
        <span className="text-xs">{"Something went wrong!"}</span>
      </div>
      <Button onClick={() => tradingPostService.send("CLOSE")}>
        {t("close")}
      </Button>
    </>
  );
};
