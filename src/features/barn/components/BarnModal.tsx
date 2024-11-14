import React, { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { Button } from "components/ui/Button";
import { getKeys } from "features/game/types/decorations";
import { ANIMALS, AnimalType } from "features/game/types/animals";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { AnimalBuildingKey } from "features/game/types/game";
import Decimal from "decimal.js-light";
import { getBumpkinLevel } from "features/game/lib/level";
import { getBoostedAnimalCapacity } from "features/game/events/landExpansion/buyAnimal";
import { Label } from "components/ui/Label";
import { pickRandomPositionInAnimalHouse } from "features/game/expansion/placeable/lib/collisionDetection";

import coinsIcon from "assets/icons/coins.webp";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

type Props = {
  show: boolean;
  buildingKey: AnimalBuildingKey;
  onClose: () => void;
};

const _state = (state: MachineState) => state.context.state;
const _bumpkin = (state: MachineState) => state.context.state.bumpkin;
const _building = (buildingKey: AnimalBuildingKey) => (state: MachineState) =>
  state.context.state[buildingKey];

export const BarnModal: React.FC<Props> = ({ show, buildingKey, onClose }) => {
  const { gameService } = useContext(Context);

  const state = useSelector(gameService, _state);
  const bumpkin = useSelector(gameService, _bumpkin);
  const building = useSelector(gameService, _building(buildingKey));

  const { t } = useAppTranslation();

  const barnAnimals = getKeys(ANIMALS).filter(
    (animal) => ANIMALS[animal].buildingRequired === "Barn",
  );

  const [currentTab, setCurrentTab] = useState(0);
  const [selectedName, setSelectedName] = useState<AnimalType>(barnAnimals[0]);

  const handleBuyAnimal = () => {
    const position = pickRandomPositionInAnimalHouse(
      state,
      buildingKey,
      selectedName,
    );

    gameService.send({
      type: "animal.bought",
      animal: selectedName,
      id: uuidv4().slice(0, 8),
      coordinates: {
        x: position.x,
        y: position.y,
      },
    });

    onClose();
  };

  const getAnimalCount = () => {
    return Object.values(building.animals).filter(
      (animal) => animal.type === selectedName,
    ).length;
  };

  const bumpkinLevel = getBumpkinLevel(bumpkin.experience);

  const hasRequiredLevel = () => {
    return bumpkinLevel >= ANIMALS[selectedName].levelRequired;
  };

  const atMaxCapacity =
    getAnimalCount() >= getBoostedAnimalCapacity(buildingKey, state);

  return (
    <Modal show={show} onHide={onClose}>
      <CloseButtonPanel
        onClose={onClose}
        tabs={[{ name: t("animals.buyAnimal"), icon: coinsIcon }]}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      >
        <SplitScreenView
          panel={
            <CraftingRequirements
              gameState={state}
              details={{
                item: selectedName,
              }}
              limit={getBoostedAnimalCapacity("barn", state)}
              requirements={{
                coins: ANIMALS[selectedName].coins,
                showCoinsIfFree: true,
                level: ANIMALS[selectedName].levelRequired,
              }}
              label={
                atMaxCapacity ? (
                  <Label type="danger">{`Barn is full!`}</Label>
                ) : undefined
              }
              actionView={
                <Button
                  disabled={!hasRequiredLevel || atMaxCapacity}
                  onClick={handleBuyAnimal}
                  className="w-full"
                >{`Buy ${selectedName}`}</Button>
              }
            />
          }
          content={
            <div className="pl-1">
              <div className="flex flex-wrap mb-2">
                {barnAnimals.map((name: AnimalType) => (
                  <Box
                    isSelected={selectedName === name}
                    key={name}
                    onClick={() => setSelectedName(name)}
                    image={ITEM_DETAILS[name].image}
                    showOverlay={!hasRequiredLevel()}
                    secondaryImage={
                      !hasRequiredLevel() ? SUNNYSIDE.icons.lock : undefined
                    }
                    count={new Decimal(getAnimalCount())}
                  />
                ))}
              </div>
            </div>
          }
        />
      </CloseButtonPanel>
    </Modal>
  );
};
