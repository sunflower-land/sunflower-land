import React from "react";
import { Box } from "components/ui/Box";
import { InnerPanel} from "components/ui/Panel";
import { IMMUNITY_TOOLTIP, Immunity_Wearables } from "../../Constants";

interface ImmunityTooltipProps {
  id: Immunity_Wearables;
  image: string;
  description?: string;
  openId: string | null;
  setOpenId: (id: string | null) => void;
}

export const ImmunityTooltip: React.FC<ImmunityTooltipProps> = ({
  id,
  image,
  description,
  openId,
  setOpenId,
}) => {
  const isOpen = openId === id;

  const handleClick = () => {
    setOpenId(isOpen ? null : id);
  };

  const tooltipItem = IMMUNITY_TOOLTIP.find((item) => item.id === id);

  return (
    <div className="flex items-center relative">
      <Box
        image={image}
        className="h-10 cursor-pointer"
        onClick={handleClick}
      />
      {isOpen && tooltipItem && (
        <InnerPanel className="absolute mt-6 w-[210px] left-1/2 transform -translate-x-1/2 -translate-y-full z-[999] pointer-events-auto">
          <div className="m-1">
            <div className="flex flex-row gap-2 mb-2 items-center">
              <img className="h-5" src={image} />
              <span className="text-xs whitespace-nowrap underline">{description}</span>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <img
                src={tooltipItem.image}
                className="h-5 mr-1"
                alt="Crafting time"
              />
              <span className="text-xs">{tooltipItem.description}</span>
            </div>
          </div>
        </InnerPanel>
      )}
    </div>
  );
};