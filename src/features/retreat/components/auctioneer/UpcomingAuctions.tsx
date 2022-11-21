import React from "react";
import { AuctionDetails } from "./AuctionDetails";

export const UpcomingAuctions: React.FC = () => {
  return (
    <div
      className="overflow-y-scroll h-full overflow-y-auto scrollable"
      style={{
        maxHeight: "450px",
      }}
    >
      <AuctionDetails />
      <AuctionDetails />
      <AuctionDetails />
    </div>
  );
};
