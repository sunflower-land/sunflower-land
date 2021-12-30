import React from "react";

import sunflower from "../../images/sunflower/plant.png";
import sunflowerSeedling from "../../images/sunflower/seedling.png";
import pumpkin from "../../images/pumpkin/plant.png";
import pumpkinSeedling from "../../images/pumpkin/seedling.png";
import beetroot from "../../images/beetroot/plant.png";
import beetrootSeedling from "../../images/beetroot/seedling.png";
import cauliflower from "../../images/cauliflower/plant.png";
import cauliflowerSeedling from "../../images/cauliflower/seedling.png";
import potato from "../../images/potato/plant.png";
import potatoSeedling from "../../images/potato/seedling.png";
import radish from "../../images/radish/plant.png";
import radishSeedling from "../../images/radish/seedling.png";
import parsnip from "../../images/parsnip/plant.png";
import parsnipSeedling from "../../images/parsnip/seedling.png";
import coin from "../../images/ui/icon.png";
import cancel from "../../images/ui/cancel.png";

import planted from "../../images/land/soil/planted.png";
import terrain from "../../images/land/soil/soil.png";

import progressStart from "../../images/ui/progress/start.png";
import progressQuarter from "../../images/ui/progress/quarter.png";
import progressHalf from "../../images/ui/progress/half.png";
import progressAlmost from "../../images/ui/progress/almost.png";

import selectBoxTL from "../../images/ui/select-box/selectbox_tl.png";
import selectBoxTR from "../../images/ui/select-box/selectbox_tr.png";
import selectBoxBR from "../../images/ui/select-box/selectbox_br.png";
import selectBoxBL from "../../images/ui/select-box/selectbox_bl.png";

import { FruitItem } from "../../types/fruits";
import { ActionableItem, Fruit, isFruit, Square } from "../../types/contract";
import { secondsToString } from "../../utils/time";

import "./Field.css";

interface Props {
  square: Square;
  selectedItem: ActionableItem;
  fruits: FruitItem[];
  balance: number;
  onClick: () => void;
}

function getTimeLeft(createdAt: number, totalTime: number) {
  const secondsElapsed = Date.now() / 1000 - createdAt;
  if (secondsElapsed > totalTime) {
    return 0;
  }

  return totalTime - secondsElapsed;
}

export const Field: React.FC<Props> = ({
  square,
  onClick,
  selectedItem,
  balance,
  fruits,
}) => {
  const [_, setTimer] = React.useState<number>(0);
  const [harvestPrice, setHarvestPrice] = React.useState<string>(null);
  const [showPrice, setShowPrice] = React.useState(false);
  const [showInsufficientFunds, setShowInsufficientFunds] =
    React.useState(false);

  const fruit = fruits.find((item) => item.fruit === square.fruit);
  const totalTime = fruit?.harvestMinutes * 60;

  const click = React.useCallback(() => {
    if (!isFruit(selectedItem)) {
      return;
    }
    // Show harvest price

    const fruit = fruits.find((item) => item.fruit === square.fruit);
    // Harvest
    if (fruit) {
      setHarvestPrice(`+${fruit.sellPrice}`);
    } else {
      // Plant
      const buyFruit = fruits.find((item) => item.fruit === selectedItem.fruit);

      if (buyFruit.buyPrice > balance) {
        setShowInsufficientFunds(true);
        window.setTimeout(() => {
          setShowInsufficientFunds(false);
        }, 500);

        return;
      }

      setHarvestPrice(`-${buyFruit.buyPrice}`);
    }

    setShowPrice(true);

    // Remove harvest price after X seconds
    window.setTimeout(() => {
      setShowPrice(false);
    }, 700);

    onClick();
  }, [balance, onClick, selectedItem, square.fruit]);

  const setHarvestTime = React.useCallback(() => {
    setTimer((count) => count + 1);
  }, []);

  React.useEffect(() => {
    if (square.fruit && square.fruit !== Fruit.None) {
      setHarvestTime();
      const interval = window.setInterval(setHarvestTime, 1000);
      return () => window.clearInterval(interval);
    }
    /* eslint-disable */
  }, [square]);
  /* eslint-enable */

  const Seedling = () => {
    // TODO different plant seedlings
    if (square.fruit === Fruit.Sunflower) {
      return <img src={sunflowerSeedling} className="seedling" />;
    }

    if (square.fruit === Fruit.Potato) {
      return <img src={potatoSeedling} className="seedling potato-seedling" />;
    }

    if (square.fruit === Fruit.Pumpkin) {
      return <img src={pumpkinSeedling} className="seedling" />;
    }

    if (square.fruit === Fruit.Beetroot) {
      return <img src={beetrootSeedling} className="seedling" />;
    }

    if (square.fruit === Fruit.Cauliflower) {
      return (
        <img
          src={cauliflowerSeedling}
          className="seedling cauliflower-seedling"
        />
      );
    }

    if (square.fruit === Fruit.Parsnip) {
      return (
        <img src={parsnipSeedling} className="seedling parnsip-seedling" />
      );
    }

    if (square.fruit === Fruit.Radish) {
      return <img src={radishSeedling} className="seedling radish-seedling" />;
    }

    return null;
  };

  const Plant = () => {
    // TODO different plant seedlings
    if (square.fruit === Fruit.Sunflower) {
      return <img src={sunflower} className="sunflower" />;
    }

    if (square.fruit === Fruit.Potato) {
      return <img src={potato} className="potato" />;
    }

    if (square.fruit === Fruit.Pumpkin) {
      return <img src={pumpkin} className="pumpkin" />;
    }

    if (square.fruit === Fruit.Beetroot) {
      return <img src={beetroot} className="beetroot" />;
    }

    if (square.fruit === Fruit.Cauliflower) {
      return <img src={cauliflower} className="cauliflower" />;
    }

    if (square.fruit === Fruit.Parsnip) {
      return <img src={parsnip} className="parsnip" />;
    }

    if (square.fruit === Fruit.Radish) {
      return <img src={radish} className="radish" />;
    }

    return null;
  };

  const Progress = () => {
    if (timeLeft > totalTime * (3 / 4)) {
      return <img src={progressStart} className="progress" />;
    }

    if (timeLeft > totalTime * (1 / 2)) {
      return <img src={progressQuarter} className="progress" />;
    }

    if (timeLeft > totalTime * (1 / 4)) {
      return <img src={progressHalf} className="progress" />;
    }

    if (timeLeft > 0) {
      return <img src={progressAlmost} className="progress" />;
    }

    return null;
  };

  const timeLeft = getTimeLeft(square.createdAt, totalTime);

  const plantingFruit =
    isFruit(selectedItem) &&
    fruits.find((item) => item.fruit === selectedItem.fruit);

  return (
    <div className="field" onClick={!timeLeft ? click : undefined}>
      <div className="harvest" style={{ opacity: !!showPrice ? "1" : "0" }}>
        <span className="harvest-amount">{harvestPrice}</span>
        <img className="harvest-coin" src={coin} />
      </div>
      {square.fruit === Fruit.None && (
        <>
          {!showPrice && (
            <img className="plant-hint" src={plantingFruit.image} />
          )}
          <img src={terrain} className="soil" />
        </>
      )}
      {
        <span
          className="field-no-funds"
          style={{ opacity: !!showInsufficientFunds ? 1 : 0 }}
        >
          Insufficient funds
        </span>
      }
      {square.fruit !== Fruit.None && (
        <>
          <img src={planted} className="planted-soil" />
          {timeLeft && timeLeft > 0 && Seedling()}
          {timeLeft === 0 && Plant()}
          {Progress()}
          {timeLeft && timeLeft > 0 && (
            <span className="progress-text">{secondsToString(timeLeft)}</span>
          )}
        </>
      )}
      <div className="field-edges">
        <div>
          <img src={selectBoxTL} />
          <img src={selectBoxTR} />
        </div>
        <div>
          <img src={selectBoxBL} />
          <img src={selectBoxBR} />
        </div>
      </div>
    </div>
  );
};
