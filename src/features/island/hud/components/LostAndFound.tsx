import { Loading } from "features/auth/components";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { balanceOf, loadBalanceBatch } from "lib/blockchain/BumpkinItems";
import { wallet } from "lib/blockchain/wallet";
import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LostAndFound: React.FC<Props> = ({ isOpen, onClose }) => {
  const { gameService } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    // Load balances
    const loadBalances = async () => {
      const balance = await balanceOf(
        wallet.web3Provider,
        gameService.state.context.state.farmAddress as string,
        81
      );

      console.log({ balance });
      const balances = await loadBalanceBatch(
        wallet.web3Provider,
        gameService.state.context.state.farmAddress as string
      );

      console.log(balances);
    };

    loadBalances();
    setLoading(false);
  }, [isOpen]);

  if (loading) return <Loading />;

  return (
    <Modal show={isOpen} centered onHide={onClose}>
      <CloseButtonPanel
        title="Lost and Found"
        onClose={onClose}
      ></CloseButtonPanel>
    </Modal>
  );
};
