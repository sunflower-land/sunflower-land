import { Button } from "components/ui/Button";
import React from "react";

export const Migrate: React.FC = () => {
  return (
    <div>
      <span className="white">Welcome back!</span>

      <span>
        It looks like you built up a bit of an empire in Sunflower Farmers.
        Let's bring in these resources
      </span>

      <Button onClick={() => {}}>Create my Sunflower Land NFT</Button>
    </div>
  );
};
