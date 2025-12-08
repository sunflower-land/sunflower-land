import React from "react";
import { useTranslation } from "react-i18next";
import flowerIcon from "assets/icons/flower_token.webp";
import { InnerPanel } from "components/ui/Panel";

export const EstimatedPrice: React.FC<{ price: number }> = ({ price }) => {
  const { t } = useTranslation();
  return (
    <InnerPanel className="mb-1">
      <div className="flex justify-between items-center pr-1">
        <div className="flex items-center">
          <img src={flowerIcon} className="w-6" />
          <span className="text-sm ml-2">{`$${price.toFixed(4)}`}</span>
        </div>
      </div>
      <p className="text-xxs italic">{t("marketplace.estimated.price")}</p>
    </InnerPanel>
  );
};
