import React, { SyntheticEvent, useEffect, useState } from "react";
import { Button } from "components/ui/Button";

interface Props {
  restock: (event: SyntheticEvent) => void;
}

export const Delayed: React.FC<Props> = ({ restock }) => {
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDisabled(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <p className="text-xxs text-center mb-1.5">
        Sync your farm on chain to restock
      </p>
      <Button disabled={isDisabled} onClick={restock}>
        Sync
      </Button>
    </div>
  );
};
