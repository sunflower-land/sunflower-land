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
    <div className="w-full mt-1">
      <p className="text-xxs text-center">
        Sync your farm to the Blockchain to restock
      </p>
      <Button disabled={isDisabled} className="mt-2" onClick={restock}>
        Sync
      </Button>
    </div>
  );
};
