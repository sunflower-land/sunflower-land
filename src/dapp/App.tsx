import React from "react";
import Modal from "react-bootstrap/Modal";
import { useService } from "@xstate/react";

import { Banner } from "./components/ui/HalveningBanner";
import { service, Context, BlockchainEvent, BlockchainState } from "./machine";

import { Donation } from "./types/contract";

import {
  Charity,
  Connecting,
  Welcome,
  Creating,
  Saving,
  Error,
  TimerComplete,
  Unsupported,
  SaveError,
  GasWarning,
} from "./components/modals";

import Farm from "./components/farm/Farm";

import "./App.css";
import { Crafting } from "./components/modals/Crafting";

export const App: React.FC = () => {
  const [machineState, send] = useService<
    Context,
    BlockchainEvent,
    BlockchainState
  >(service);

  React.useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("networkChanged", () => {
        console.log("Network changed");
        send("NETWORK_CHANGED");
      });

      window.ethereum.on("accountsChanged", function (accounts) {
        send("ACCOUNT_CHANGED");
      });
    }
  }, [send]);

  const getStarted = () => {
    send("GET_STARTED");
  };

  const createFarm = (donation: Donation) => {
    send("DONATE", {
      donation: { charity: donation.charity, value: donation.value },
    });
  };

  return (
    <>
      <div id="container">
        <Farm />

        <Modal centered show={machineState.matches("loading")}>
          <Connecting />
        </Modal>

        <Modal centered show={machineState.matches("unsupported")}>
          <Unsupported />
        </Modal>

        <Modal centered show={machineState.matches("initial")}>
          <Welcome onGetStarted={getStarted} />
        </Modal>

        <Modal centered show={machineState.matches("registering")}>
          <Charity onSelect={createFarm} />
        </Modal>

        <Modal centered show={machineState.matches("creating")}>
          <Creating />
        </Modal>

        <Modal
          centered
          show={
            machineState.matches("confirming") ||
            machineState.matches("upgrading") ||
            machineState.matches("rewarding") ||
            machineState.matches("collecting")
          }
        >
          <Saving />
        </Modal>

        <Modal centered show={machineState.matches("crafting")}>
          <Crafting />
        </Modal>

        <Modal centered show={machineState.matches("timerComplete")}>
          <TimerComplete />
        </Modal>

        <Modal centered show={machineState.matches("failure")}>
          <Error code={machineState.context.errorCode} />
        </Modal>

        <Modal centered show={machineState.matches("warning")}>
          <GasWarning gasPrice={machineState.context.gasPrice} />
        </Modal>

        <Modal centered show={machineState.matches("saveFailure")}>
          <SaveError code={machineState.context.errorCode} />
        </Modal>
      </div>
      <Banner />
    </>
  );
};

export default App;
