import React, { useState } from "react";

import { InnerPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ChapterStore } from "features/world/ui/megastore/ChapterStore";
import { GameState } from "features/game/types/game";
import shopIcon from "assets/icons/shop.png";

export const ShopSection: React.FC<{ gameState: GameState }> = ({
  gameState,
}) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <InnerPanel className="mb-2">
        <div className="p-1">
          <Button className="w-full relative" onClick={() => setShow(true)}>
            <span className="flex items-center justify-center gap-2 w-full">
              <span>Shop</span>
              <img src={shopIcon} className="h-5" />
            </span>
          </Button>
        </div>
      </InnerPanel>

      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <CloseButtonPanel onClose={() => setShow(false)}>
          <div className="p-2">
            <ChapterStore state={gameState} />
          </div>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
