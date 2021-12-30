import React from "react";
import Modal from "react-bootstrap/Modal";
import Big from "big.js";

import { service } from "../../machine";

import alert from "../../images/ui/expression_alerted.png";
import sunflower from "../../images/sunflower/fruit.png";

import { Panel } from "./Panel";
import {
  getMarketRate,
  getNextHalvingThreshold,
  getNextMarketRate,
} from "../../utils/supply";

import "./MarketModal.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ORIGINAL_SUNFLOWER_BUY_PRICE = Big(0.01);

export const MarketModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [totalSupply, setTotalSupply] = React.useState<number>(1);

  React.useEffect(() => {
    const load = async () => {
      if (isOpen) await service.machine.context.blockChain.cacheTotalSupply();

      const supply = await service.machine.context.blockChain.totalSupply();
      setTotalSupply(supply);
    };

    load();
  }, [isOpen]);

  const currentPrice =
    ORIGINAL_SUNFLOWER_BUY_PRICE / getMarketRate(totalSupply);
  const nextPrice =
    ORIGINAL_SUNFLOWER_BUY_PRICE / getNextMarketRate(totalSupply);
  const nextHalvingThreshold = getNextHalvingThreshold(totalSupply);

  return (
    <Modal centered show={isOpen} onHide={onClose}>
      <Panel>
        <div id="welcome">
          <h1 className="price-header">
            Supply is growing!
            <img src={alert} className="price-alert" />
          </h1>

          <div className="current-price-info-container">
            <p className="current-price-info">
              As all dedicated farmers know, supply and demand can be a
              dangerous thing. When prices are high, fortunes can be made. But
              when prices are low, a lifetime of potato hustling can be lost.
            </p>
            <p className="current-price-info">
              When the supply is getting nearer to a halvening event you will
              want to ensure you are ready!
            </p>
          </div>

          <div className="current-price-info-container">
            {nextHalvingThreshold ? (
              <p className="current-price-info">
                The next halvening event will occur when total supply reaches{" "}
                {nextHalvingThreshold.toLocaleString()} tokens
              </p>
            ) : (
              <p className="current-price-info">No more halvening events!</p>
            )}
          </div>

          <a href="https://docs.sunflower-farmers.com/tokenomics">
            <h3 className="current-price-supply-demand">
              Read more about our tokenomics here
            </h3>
          </a>

          {totalSupply > 0 ? (
            <>
              <div>
                <h3 className="current-price-header">Current Price</h3>
                <div className="current-price-container ">
                  <img className="sunflower-price" src={sunflower} />
                  <span className="current-price">= {currentPrice} $SFF</span>
                </div>
              </div>

              {nextHalvingThreshold && (
                <div>
                  <h3 className="current-price-header">Upcoming Price</h3>
                  <div className="current-price-container ">
                    <img className="sunflower-price" src={sunflower} />
                    <span className="current-price">= {nextPrice} $SFF</span>
                  </div>
                </div>
              )}

              <div>
                <h3 className="current-price-header">Total Supply</h3>
                <div className="current-price-container ">
                  <span className="current-price">{totalSupply}</span>
                </div>
              </div>
            </>
          ) : (
            <div>Loading...</div>
          )}

          <div></div>
        </div>
      </Panel>
    </Modal>
  );
};
