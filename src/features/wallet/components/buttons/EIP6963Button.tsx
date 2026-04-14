import { Button } from "components/ui/Button";
import React from "react";

export const EIP6963Button: React.FC<{
  onClick: () => void;
  name: string;
  icon?: string;
}> = ({ onClick, name, icon }) => {
  return (
    <Button className="mb-1 py-2 text-sm relative" onClick={onClick} key={name}>
      <div className="px-8">
        <img
          src={icon}
          className="h-7 ml-2.5 mr-6 absolute left-0 top-1 rounded-sm"
        />
        {name}
      </div>
    </Button>
  );
};
