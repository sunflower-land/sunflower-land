import React from "react";
import { MyListings } from "./MyListings";
import { MyCollection } from "./MyCollection";
import { MyOffers } from "./MyOffers";

export const MyTrades: React.FC = () => {
  return (
    <div className="overflow-y-scroll scrollable pr-1 h-full">
      <MyOffers />
      <MyListings />
      <MyCollection />
    </div>
  );
};
