import React from "react";
import Big from "big.js";

import questionMark from "../../images/ui/expression_confused.png";
import alert from "../../images/ui/expression_alerted.png";
import logo from "../../images/ui/logo.png";
import sunflower from "../../images/sunflower/fruit.png";

import { secondsToLongString } from "../../utils/time";

import { Panel } from "../ui/Panel";
import { Button } from "../ui/Button";
import { service } from "../../machine";
import { getMarketRate } from "../../utils/supply";

interface Props {
  onGetStarted: () => void;
}

// TODO: Hardcoded from reports, read from live API
const predictedDate = new Date(2021, 9, 19, 8, 44, 55);

const makeTimeLeft = () => {
  const difference = predictedDate.getTime() - Date.now();

  const display = secondsToLongString(difference / 1000);
  return display;
};

export const Welcome: React.FC<Props> = ({ onGetStarted }) => {
  const [timeLeft, setTimeLeft] = React.useState(makeTimeLeft());
  const [totalSupply, setTotalSupply] = React.useState<number>(1);

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeLeft(makeTimeLeft());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const load = async () => {
      const supply = await service.machine.context.blockChain.totalSupply();
      setTotalSupply(supply);
    };

    load();
  }, []);

  const marketRate = getMarketRate(totalSupply);

  const sunflowerPrice = Big(0.001).div(marketRate);

  return (
    <Panel>
      <div id="welcome">
        <img id="logo" src={logo} />
        <Button onClick={onGetStarted}>
          <span>Get Started</span>
        </Button>
        <Button
          onClick={() => window.open("https://docs.sunflower-farmers.com/")}
        >
          About
          <img src={questionMark} id="question" />
        </Button>

        <div>
          <br />
          <div className="current-price-container">
            <img className="sunflower-price" src={sunflower} />
            <span className="current-price">= {`${sunflowerPrice} $SFF`}</span>
          </div>
          <br />
          <a href="https://docs.sunflower-farmers.com/tokenomics">
            <h3 className="current-price-supply-demand">
              Read more about the supply & demand
            </h3>
          </a>
        </div>
      </div>
    </Panel>
  );
};
