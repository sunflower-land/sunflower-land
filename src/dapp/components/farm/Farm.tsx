import React from "react";
import { useService } from "@xstate/react";
import Decimal from "decimal.js-light";

import { Land } from "./Land";
import { FruitItem, FRUITS, getMarketFruits } from "../../types/fruits";
import {
  Fruit,
  Square,
  Action,
  Transaction,
  ActionableItem,
  isFruit,
  ACTIONABLE_ITEMS,
} from "../../types/contract";
import {
  cacheAccountFarm,
  getSelectedItem,
} from "../../utils/localStorage";

import {
  service,
  Context,
  BlockchainEvent,
  BlockchainState,
} from "../../machine";

import coin from "../../images/ui/icon.png";
import questionMark from "../../images/ui/expression_confused.png";

import { Panel } from "../ui/Panel";
import { Timer } from "../ui/Timer";
import { Button } from "../ui/Button";
import { AudioPlayer } from "../ui/AudioPlayer";

import { FruitBoard } from "./FruitBoard";
import { Tour } from "./Tour";
import { getMarketRate } from "../../utils/supply";
import { Message } from "../ui/Message";
import { DEFAULT_INVENTORY, Inventory } from "../../types/crafting";

import Modal from "react-bootstrap/Modal";

import closeIcon from "../../images/ui/close.png";

export const Farm: React.FC = () => {
  const [balance, setBalance] = React.useState<Decimal>(new Decimal(0));
  const [land, setLand] = React.useState<Square[]>(
    Array(5).fill({
      fruit: Fruit.None,
      createdAt: 0,
    })
  );
  const [inventory, setInventory] =
    React.useState<Inventory>(DEFAULT_INVENTORY);

  const [totalItemSupplies, setTotalItemSupplies] =
    React.useState<Inventory>(DEFAULT_INVENTORY);

  const [supply, setSupply] = React.useState<Supply>({
    statue: 0,
  });

  const farmIsFresh = React.useRef(false);
  const accountId = React.useRef<string>();
  const [selectedItem, setSelectedItem] = React.useState<ActionableItem>(
    ACTIONABLE_ITEMS[0]
  );
  const [fruits, setFruits] = React.useState<FruitItem[]>(FRUITS);
  const [machineState, send] = useService<
    Context,
    BlockchainEvent,
    BlockchainState
  >(service);

  const isDirty = machineState.context.blockChain.isUnsaved();
  console.log(
    "%c 🥪 machineState.context.blockChain: ",
    "font-size:12px;background-color: #2EAFB0;color:#fff;",
    machineState.context.blockChain
  );

  // If they have unsaved changes, alert them before leaving
  React.useEffect(() => {
    window.onbeforeunload = function (e) {
      if (!isDirty) {
        return undefined;
      }
      e = e || window.event;

      // For IE and Firefox prior to version 4
      if (e) {
        e.returnValue = "Sure?";
      }

      // For Safari
      return "Sure?";
    };
  }, [isDirty, machineState]);

  React.useEffect(() => {
    const load = async () => {
      const isFarming =
        machineState.matches("farming") ||
        machineState.matches("onboarding");

      const doRefresh = !farmIsFresh.current;

      // HACK: Upgrade modal does not upgrade balance and farm so mark farm as stale
      if (
        machineState.matches("upgrading") ||
        machineState.matches("loading") ||
        machineState.matches("rewarding") ||
        machineState.matches("crafting")
      ) {
        farmIsFresh.current = false;
      }

      // Load fresh data from blockchain only if there are no unsaved changes
      if (
        isFarming &&
        doRefresh &&
        !machineState.context.blockChain.isUnsaved()
      ) {
        const {
          farm,
          balance: currentBalance,
          id,
        } = machineState.context.blockChain.myFarm;
        setLand(farm);
        setBalance(new Decimal(currentBalance));
        farmIsFresh.current = true;
        accountId.current = id;

        const cachedItem = getSelectedItem(id);
        setSelectedItem(cachedItem);

        const supply = await machineState.context.blockChain.totalSupply();
        const marketRate = getMarketRate(supply);
        const marketFruits = getMarketFruits(marketRate);
        setFruits(marketFruits);
      }

      if (machineState.matches("farming")) {
        const inventory =
          await machineState.context.blockChain.getInventory();
        setInventory(inventory);
        const itemSupplies =
          await machineState.context.blockChain.getTotalItemSupplies();
        setTotalItemSupplies(itemSupplies);
      }
    };

    load();
  }, [machineState]);

  const onChangeItem = (item: ActionableItem) => {
    setSelectedItem(item);

    cacheAccountFarm(accountId.current, { selectedItem: item.name });
    // TODO - ?localStorage.setItem("fruit", fruit);
  };
  const onHarvest = React.useCallback(
    async (landIndex: number) => {
      if (!isFruit(selectedItem)) {
        return;
      }

      const now = Math.floor(Date.now() / 1000);

      const harvestedFruit = land[landIndex];
      const transaction: Transaction = {
        action: Action.Harvest,
        fruit: Fruit.None,
        landIndex,
        createdAt: now,
      };
      machineState.context.blockChain.addEvent(transaction);

      setLand((oldLand) =>
        oldLand.map((field, index) =>
          index === landIndex ? { fruit: Fruit.None, createdAt: 0 } : field
        )
      );
      const price = fruits.find(
        (item) => item.fruit === harvestedFruit.fruit
      ).sellPrice;

      setBalance(balance.plus(price));

      send("HARVEST");
    },
    [balance, fruits, land, machineState.context.blockChain, send]
  );

  const onPlant = React.useCallback(
    async (landIndex: number) => {
      if (!isFruit(selectedItem)) {
        return;
      }

      const price = fruits.find(
        (item) => item.fruit === selectedItem.fruit
      ).buyPrice;

      if (balance.lt(price)) {
        return;
      }

      const now = Math.floor(Date.now() / 1000);
      const transaction: Transaction = {
        action: Action.Plant,
        fruit: selectedItem.fruit,
        landIndex,
        createdAt: now,
      };
      machineState.context.blockChain.addEvent(transaction);

      setLand((oldLand) => {
        const newLand = oldLand.map((field, index) =>
          index === landIndex ? transaction : field
        );
        return newLand;
      });
      setBalance(balance.minus(price));

      send("PLANT");
    },
    [balance, selectedItem, fruits, machineState.context.blockChain, send]
  );

  const onBuyMore = () => {
    window.open(
      "https://quickswap.exchange/#/swap?outputCurrency=0xdf9B4b57865B403e08c85568442f95c26b7896b0",
      "_blank"
    );
  };

  const getFriendFarm = async (acc) => {
    const data = await machineState.context.blockChain.loadFriend(acc);
    console.log(
      "%c 🌽 data: ",
      "font-size:12px;background-color: #ED9EC7;color:#fff;",
      data
    );
    return data;
  };
  const save = async () => {
    send("SAVE", { action: "SYNC" });
  };

  const safeBalance = balance.toNumber();

  const [friendFarm, setFriendFarm] = React.useState({
    active: false,
    data: null,
  });

  // TODO: return type
  const handleGetFriend = async (account) => {
    const data = await getFriendFarm(account).catch(() =>
      console.log("Provided address is invalid")
    );

    if (data) {
      setFriendFarm({
        active: true,
        data,
      });
    }
    return setModalValue(null);
  };
  const [showModal, setShowModal] = React.useState(false);
  const [modalValue, setModalValue] = React.useState(null);

  const openExploreFarmModal = () => {
    setShowModal(true);
  };

  const closeExploreFarmModal = () => {
    setModalValue(null);
    setShowModal(false);
  };

  const exploreFarmModal = showModal && (
    <Modal
      show={showModal}
      centered
      onHide={closeExploreFarmModal}
      backdrop={false}
      dialogClassName="gather-modal"
    >
      <Panel>
        <div className="gather-panel">
          <img
            src={closeIcon}
            className="gather-close-icon"
            onClick={closeExploreFarmModal}
          />
          Enter wallet address
        </div>
        <div id="explore-input-container">
          <input
            type="text"
            step="Address id"
            id="explore-farm-input"
            placeholder="Ex: 0x6e5fa679211d7f6b54e14e187d34ba547c5d3fe0"
            onChange={(e) => setModalValue(e.target.value)}
          />
          <Button
            disabled={!modalValue}
            onClick={() => handleGetFriend(modalValue)}
          >
            Search
          </Button>
        </div>
      </Panel>
    </Modal>
  );

  const render = friendFarm.active ? (
    <>
      <Land
        fruits={fruits}
        selectedItem={selectedItem}
        land={friendFarm.data.farm}
        balance={safeBalance}
        onHarvest={onHarvest}
        onPlant={onPlant}
        account={friendFarm.data.id}
        inventory={friendFarm.data.inventory}
        totalItemSupplies={totalItemSupplies}
      />
      <span id="save-button">
        <Panel hasInner={false}>
          <Button
            onClick={() => (
              setFriendFarm((prevState) => ({
                ...prevState,
                active: false,
              })),
              setShowModal(false)
            )}
          >
            Go back
          </Button>
        </Panel>
      </span>
    </>
  ) : (
    <>
      <Tour />
      {exploreFarmModal}
      <Land
        fruits={fruits}
        selectedItem={selectedItem}
        land={land}
        balance={safeBalance}
        onHarvest={onHarvest}
        onPlant={onPlant}
        account={accountId.current}
        inventory={inventory}
        totalItemSupplies={totalItemSupplies}
      />
      <AudioPlayer />
      <span id="save-button">
        <Panel hasInner={false}>
          <Button
            onClick={save}
            disabled={
              !isDirty ||
              machineState.matches("timerComplete") ||
              machineState.matches("saving")
            }
          >
            Save
            {isDirty && (
              <Timer
                startAtSeconds={machineState.context.blockChain.lastSaved()}
              />
            )}
          </Button>
          <Button
            onClick={() =>
              window.open("https://docs.sunflower-farmers.com/")
            }
          >
            About
            <img src={questionMark} id="question" />
          </Button>
          <Button onClick={() => openExploreFarmModal()}>
            Explore farms
          </Button>
        </Panel>
      </span>

      <div id="balance">
        <Panel>
          <div id="inner">
            <img src={coin} />
            {machineState.context.blockChain.isConnected &&
              safeBalance.toFixed(3)}
          </div>
        </Panel>
      </div>

      <div id="buy-now" onClick={onBuyMore}>
        <Message>Quickswap</Message>
      </div>

      <FruitBoard
        fruits={fruits}
        selectedItem={selectedItem}
        onSelectItem={onChangeItem}
        land={land}
        balance={safeBalance}
        inventory={inventory}
      />
    </>
  );

  return render;
};

export default Farm;
