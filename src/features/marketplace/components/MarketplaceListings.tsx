import React from "react";
import { MyCollection } from "./profile/MyCollection";
import { MyListings } from "./profile/MyListings";
import { MyOffers } from "./profile/MyOffers";

export const MarketplaceListings: React.FC = () => {
  return (
    <div className="overflow-y-scroll scrollable pr-1 h-full">
      <MyListings />
      <MyCollection />
    </div>
  );
};
