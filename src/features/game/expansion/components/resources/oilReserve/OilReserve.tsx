import React from "react";
import { RecoveredOilReserve } from "./components/RecoveredOilReserve";

interface Props {
  id: string;
}

export const OilReserve: React.FC<Props> = ({ id }) => {
  return (
    <div className="relative w-full h-full flex justify-center items-center">
      <RecoveredOilReserve />
    </div>
  );
};
