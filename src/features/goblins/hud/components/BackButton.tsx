import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";

import leftArrow from "assets/icons/arrow_left.png";
import { OuterPanel } from "components/ui/Panel";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-2 left-2 z-50 shadow-lg">
      <OuterPanel>
        <div className="flex justify-center p-1">
          <Button
            className="bg-brown-200 active:bg-brown-200 w-full"
            onClick={() => navigate(-1)}
          >
            <img className="w-6 md:mr-2" src={leftArrow} alt="back-arrow" />
            <span className="hidden md:flex">Leave Goblin Village</span>
          </Button>
        </div>
      </OuterPanel>
    </div>
  );
};
