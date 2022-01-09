import { useService } from "@xstate/react";
import React from "react";

import present from "../../images/decorations/treasure.png";
import {
  BlockchainEvent,
  BlockchainState,
  Context,
  service,
} from "../../machine";
import { RewardModal } from "../ui/RewardModal";

interface Props {
  account: string;
}

export const Reward: React.FC<Props> = ({ account }) => {
  const [showModal, setShowModal] = React.useState(false);
  const [reward, setReward] = React.useState(null);
  const [machineState, send] = useService<
    Context,
    BlockchainEvent,
    BlockchainState
  >(service);
  const [isCollected, setIsCollected] = React.useState(false);

  const onUpgrade = () => {
    setShowModal(true);
  };

  const onReceiveConfirm = () => {
    setShowModal(false);
    send("OPEN_REWARD");
    setIsCollected(true);
  };

  React.useEffect(() => {
    const load = async () => {
      const reward = await machineState.context.blockChain.getReward();
      setReward(reward);
    };

    if (account) {
      load();

      setIsCollected(false);
    }
  }, [account]);

  if (!reward || isCollected) {
    return null;
  }

  return (
    <>
      <RewardModal
        reward={reward}
        onReceive={onReceiveConfirm}
        onClose={() => setShowModal(false)}
        isOpen={showModal}
      />

      {/* Present */}
      <div style={{ gridColumn: "12/13", gridRow: "9/10" }}>
        <img id="present" src={present} onClick={onUpgrade} />
      </div>
    </>
  );
};
