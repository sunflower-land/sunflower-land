import React from "react";

import { CONFIG } from "lib/config";
import { Donations } from "./Donations";

const CONTRIBUTORS = [
  "JC",
  "Kotob",
  "whaitte",
  "Ventin",
  "shinon",
  "PurpleDvrnk",
  "SFWhat",
  "Andand0",
  "Telk",
  "Neonlight",
  "Vergel",
  "Netherzapdos",
  "LittleEins",
  "Poro",
  "Mr Findlay",
  "default",
];
const CHRISTMAS_EVENT_DONATION_ADDRESS = CONFIG.CHRISTMAS_EVENT_DONATION;

interface Props {
  onClose: () => void;
}

export const ExampleDonations: React.FC<Props> = ({ onClose }) => {
  return (
    <Donations
      contributors={CONTRIBUTORS}
      donationAddress={CHRISTMAS_EVENT_DONATION_ADDRESS}
      onClose={onClose}
    />
  );
};
