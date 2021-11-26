import React from "react";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import soil from "../../images/land/soil/planted.png";
import watering from "../../images/characters/goblin_watering.gif";

import { UpgradeOverlay } from "../ui/UpgradeModal";

import { ActionableItem, Fruit, Square } from "../../types/contract";

import { Field } from "./Field";
import { FruitItem } from "../../types/fruits";

interface Props {
  land: Square[];
  balance: number;
  onHarvest: (landIndex: number) => void;
  onPlant: (landIndex: number) => void;
  selectedItem: ActionableItem;
  fruits: FruitItem[];
}

export const SecondLand: React.FC<Props> = ({
  fruits,
  land,
  balance,
  onHarvest,
  onPlant,
  selectedItem,
}) => {
  const isUnlocked = land.length > 5;
  const [showWatering, setShowWatering] = React.useState(false);
  const hasRendered = React.useRef(false);
  React.useEffect(() => {
    if (!isUnlocked) {
      return;
    }
    if (land[5].fruit === Fruit.None) {
      setShowWatering(false);
    }

    // Only show it on first load
    if (!hasRendered.current && land[5].fruit !== Fruit.None) {
      setShowWatering(true);
    }

    if (balance) {
      hasRendered.current = true;
    }
  }, [land, balance]);

  return (
    <>
      <div className="dirt" style={{ gridColumn: "2/3", gridRow: "8/9" }}>
        {showWatering && <img id="watering2" src={watering} />}
        {isUnlocked ? (
          <Field
            fruits={fruits}
            balance={balance}
            selectedItem={selectedItem}
            square={land[5]}
            onClick={
              land[5].fruit === Fruit.None
                ? () => onPlant(5)
                : () => onHarvest(5)
            }
          />
        ) : (
          <div className="field">
            <img src={soil} />
          </div>
        )}
      </div>
      <div className="dirt" style={{ gridColumn: "3/4", gridRow: "9/10" }}>
        {isUnlocked ? (
          <Field
            fruits={fruits}
            balance={balance}
            selectedItem={selectedItem}
            square={land[6]}
            onClick={
              land[6].fruit === Fruit.None
                ? () => onPlant(6)
                : () => onHarvest(6)
            }
          />
        ) : (
          <div className="field">
            <img src={soil} />
          </div>
        )}
      </div>
      <div className="dirt" style={{ gridColumn: "2/3", gridRow: "9/10" }}>
        {isUnlocked ? (
          <Field
            fruits={fruits}
            balance={balance}
            selectedItem={selectedItem}
            square={land[7]}
            onClick={
              land[7].fruit === Fruit.None
                ? () => onPlant(7)
                : () => onHarvest(7)
            }
          />
        ) : (
          <div className="field">
            <img src={soil} />
          </div>
        )}
      </div>
      <div className="dirt" style={{ gridColumn: "3/4", gridRow: "8/9" }} />

      <div
        className="left-edge"
        style={{ gridColumn: "1/2", gridRow: "8/9" }}
      />
      <div
        className="left-edge"
        style={{ gridColumn: "1/2", gridRow: "9/10" }}
      />
      <div
        className="right-edge"
        style={{ gridColumn: "4/5", gridRow: "9/10" }}
      />
      <div className="top-edge" style={{ gridColumn: "2/3", gridRow: "7/8" }} />
      <div className="top-edge" style={{ gridColumn: "3/4", gridRow: "7/8" }} />
      <div
        className="bottom-edge"
        style={{ gridColumn: "2/3", gridRow: "10/11" }}
      />
      <div
        className="bottom-edge"
        style={{ gridColumn: "3/4", gridRow: "10/11" }}
      />

      {!isUnlocked && (
        <OverlayTrigger
          overlay={UpgradeOverlay}
          placement="bottom"
          delay={{ show: 250, hide: 400 }}
        >
          <div
            className="upgrade-overlay"
            style={{ gridColumn: "2/3", gridRow: "8/9" }}
          />
        </OverlayTrigger>
      )}
    </>
  );
};
