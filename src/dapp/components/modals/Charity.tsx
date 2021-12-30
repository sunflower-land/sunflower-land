import React from "react";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import { useService } from "@xstate/react";
import {
  service,
  Context,
  BlockchainEvent,
  BlockchainState,
} from "../../machine";

import { Charity as Charities, Donation } from "../../types/contract";

import questionMark from "../../images/ui/expression_confused.png";

import { Button } from "../ui/Button";
import { Panel } from "../ui/Panel";

import arrowUp from "../../images/ui/arrow_up.png";
import arrowDown from "../../images/ui/arrow_down.png";
import "./Charity.css";

interface Props {
  onSelect: (donation: Donation) => void;
}

export const Charity: React.FC<Props> = ({ onSelect }) => {
  const [machineState] = useService<Context, BlockchainEvent, BlockchainState>(
    service
  );

  const [balances, setBalances] = React.useState({
    coolEarthBalance: "",
    waterBalance: "",
    heiferBalance: "",
  });

  const [donation, setDonation] = React.useState<number>(0.3);

  React.useEffect(() => {
    if (machineState.context.blockChain.isConnected) {
      const load = async () => {
        const balances =
          await machineState.context.blockChain.getCharityBalances();
        setBalances(balances);
      };
      load();
    }
  }, [
    machineState.context.blockChain,
    machineState.context.blockChain.isConnected,
  ]);

  const roundToOneDecimal = (number) => Math.round(number * 10) / 10;

  const handleDonationChange = (event) => {
    setDonation(roundToOneDecimal(event.currentTarget.value));
  };

  const incrementDonation = () => {
    setDonation((prevState) => roundToOneDecimal(prevState + 0.1));
  };

  const decrementDonation = () => {
    if (donation === 0.1) {
      setDonation(0.1);
    } else setDonation((prevState) => roundToOneDecimal(prevState - 0.1));
  };

  return (
    <Panel>
      <div id="charity-container">
        <span>Donate to play.</span>
        <span id="donate-description">
          To start a farm, please donate to a charity of your choice. Ensure you
          are connected to the Polygon network.
        </span>
        <div id="donation-input-container">
          <input
            type="number"
            step="0.1"
            id="donation-input"
            min={0.1}
            value={donation}
            onChange={handleDonationChange}
          />
          <div id="arrow-container">
            <img
              className="arrow"
              alt="Step up donation value"
              src={arrowUp}
              onClick={incrementDonation}
            />
            <img
              className="arrow"
              alt="Step down donation value"
              src={arrowDown}
              onClick={decrementDonation}
            />
          </div>
        </div>

        <span id="donate-minimum-description">Minimum of $0.1 MATIC </span>
        <div id="charities">
          <div>
            <div className="charity">The Water project</div>
            <span className="charity-description">
              You can provide clean, safe and reliable water today.
            </span>
            <OverlayTrigger
              key="water"
              overlay={(props) => (
                <Tooltip id="tooltip-water" {...props}>
                  {Charities.TheWaterProject}
                </Tooltip>
              )}
            >
              <span className="total-donated">
                {balances.waterBalance && `$${balances.waterBalance} donated`}
              </span>
            </OverlayTrigger>

            <div className="charity-buttons">
              <Button
                onClick={() =>
                  window.open("https://thewaterproject.org/donate-ethereum")
                }
              >
                About
                <img src={questionMark} id="question" />
              </Button>
              <Button
                onClick={() =>
                  onSelect({
                    charity: Charities.TheWaterProject,
                    value: donation.toString(),
                  })
                }
              >
                Donate & Play
              </Button>
            </div>
          </div>
          <div>
            <div className="charity">Heifer</div>
            <span className="charity-description">
              We do more than train farmers. We grow incomes.
            </span>
            <OverlayTrigger
              key="water"
              overlay={(props) => (
                <Tooltip id="tooltip-water" {...props}>
                  {Charities.Heifer}
                </Tooltip>
              )}
            >
              <span className="total-donated">
                {balances.heiferBalance && `$${balances.heiferBalance} donated`}
              </span>
            </OverlayTrigger>
            <div className="charity-buttons">
              <Button
                onClick={() =>
                  window.open(
                    "https://www.heifer.org/give/other/digital-currency.html"
                  )
                }
              >
                About
                <img src={questionMark} id="question" />
              </Button>
              <Button
                onClick={() =>
                  onSelect({
                    charity: Charities.Heifer,
                    value: donation.toString(),
                  })
                }
              >
                Donate & Play
              </Button>
            </div>
          </div>
          <div>
            <div className="charity">Cool Earth</div>
            <span className="charity-description">
              Aim to halt deforestation and its impact on climate change.
            </span>
            <OverlayTrigger
              key="water"
              overlay={(props) => (
                <Tooltip id="tooltip-water" {...props}>
                  {Charities.CoolEarth}
                </Tooltip>
              )}
            >
              <span className="total-donated">
                {balances.coolEarthBalance &&
                  `$${balances.coolEarthBalance} donated`}
              </span>
            </OverlayTrigger>
            <div className="charity-buttons">
              <Button
                onClick={() =>
                  window.open(
                    "https://www.coolearth.org/cryptocurrency-donations/"
                  )
                }
              >
                About
                <img src={questionMark} id="question" />
              </Button>
              <Button
                onClick={() =>
                  onSelect({
                    charity: Charities.CoolEarth,
                    value: donation.toString(),
                  })
                }
              >
                Donate & Play
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
};
