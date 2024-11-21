import React from "react";
import { MyCollection } from "./profile/MyCollection";
import { MyListings } from "./profile/MyListings";
import { MyOffers } from "./profile/MyTrades";

export const MarketplaceProfile: React.FC = () => {
  return (
    <div className="overflow-y-scroll scrollable pr-1 h-full">
      <MyListings />
      <MyOffers />
      <MyCollection />
    </div>
  );
};
