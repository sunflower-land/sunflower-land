import Big from "big.js";
import React from "react";

import sunflower from "../../images/sunflower/fruit.png";
import questionMark from "../../images/ui/expression_confused.png";
import logo from "../../images/ui/logo.png";
import { service } from "../../machine";
import { getMarketRate } from "../../utils/supply";
import { Button } from "../ui/Button";
import { Panel } from "../ui/Panel";

interface Props {
  onGetStarted: () => void;
}

export const Welcome: React.FC<Props> = ({ onGetStarted }) => {
  const [totalSupply, setTotalSupply] = React.useState<number>(1);

  React.useEffect(() => {
    const load = async () => {
      const supply =
        await service.machine.context.blockChain.totalSupply();
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
          onClick={() =>
            window.open("https://docs.sunflower-farmers.com/")
          }
        >
          About
          <img src={questionMark} id="question" />
        </Button>

        <div>
          <br />
          <div className="current-price-container">
            <img className="sunflower-price" src={sunflower} />
            <span className="current-price">
              = {`${sunflowerPrice} $SFF`}
            </span>
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
