import "./Banner.css";

import { useService } from "@xstate/react";
import React, { useState } from "react";

import closeIcon from "../../images/ui/close.png";
import alert from "../../images/ui/expression_alerted.png";
import {
  BlockchainEvent,
  Context,
  BlockchainState,
  service,
} from "../../machine";
import { numberWithBreaks } from "../../utils/number";
import { getNextHalvingThreshold } from "../../utils/supply";

export const Banner: React.FC = () => {
  const [show, setShow] = useState(true);
  const [totalSupply, setTotalSupply] = React.useState<number>(0);

  const [machineState, send] = useService<
    Context,
    BlockchainEvent,
    BlockchainState
  >(service);

  React.useEffect(() => {
    const load = async () => {
      const notReady =
        machineState.matches("loading") ||
        machineState.matches("initial") ||
        machineState.matches("registering") ||
        machineState.matches("creating") ||
        machineState.matches("onboarding");

      if (notReady && totalSupply < 1) setTimeout(() => load(), 100);

      const supply =
        await service.machine.context.blockChain.totalSupply();

      setTotalSupply(supply);
    };

    load();
  }, [machineState]);

  if (!show || !totalSupply) return null;

  const nextHalvingThreshold = getNextHalvingThreshold(totalSupply);

  return (
    <div id="halvening-banner">
      <img src={alert} />
      <div>
        <span>
          When total supply reaches{" "}
          {numberWithBreaks(nextHalvingThreshold.amount)} crop and upgrade
          prices will be divided by {nextHalvingThreshold.halveningRate}.
          Be prepared!
        </span>
        <a
          href="https://docs.sunflower-farmers.com/tokenomics#the-halvening"
          target="_blank"
        >
          Read more
        </a>
      </div>
      <img
        src={closeIcon}
        id="banner-close"
        onClick={() => setShow(false)}
      />
    </div>
  );
};
