import React from "react";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { Loading } from "features/auth/components";

import { Ocean } from "features/world/ui/Ocean";

export const LoadingFallback: React.FC = () => {
  return (
    <Ocean>
      <Modal show={true} backdrop={false}>
        <Panel>
          <Loading />
        </Panel>
      </Modal>
    </Ocean>
  );
};
