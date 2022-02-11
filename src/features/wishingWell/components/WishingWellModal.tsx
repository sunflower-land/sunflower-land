import React, { useEffect, useState } from "react";

import { Panel } from "components/ui/Panel";
import { loadWishingWell, WishingWellTokens } from "../actions/loadWishingWell";

interface Props {
  onClose: () => void;
}

export const WishingWellModal: React.FC<Props> = ({ onClose }) => {
  const [wishingWell, setWishingWell] = useState<WishingWellTokens>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const wishingWell = await loadWishingWell();
      setWishingWell(wishingWell);
      setIsLoading(false);
    };

    load();
  });

  const Content = () => {
    if (isLoading) {
      return <span>Loading...</span>;
    }

    return <div>{JSON.stringify(wishingWell, null, 2)}</div>;
  };

  return (
    <Panel className="relative">
      <span>What would you like to do?</span>
      {Content()}
    </Panel>
  );
};
