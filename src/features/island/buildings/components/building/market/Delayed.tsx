import React, { SyntheticEvent, useEffect, useState } from "react";
import { Button } from "components/ui/Button";

interface Props {
  restock: (event: SyntheticEvent) => void;
  isDelayed: boolean;
}

export const Delayed: React.FC<Props> = ({ restock, isDelayed }) => {
  const [isDisabled, setIsDisabled] = useState(isDelayed);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDisabled(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="my-1">
      <p className="text-xxs text-center">
        Sync your farm to the Blockchain to restock
      </p>
      <Button disabled={isDisabled} className="text-xs mt-1" onClick={restock}>
        Sync
      </Button>
    </div>
  );
};
