import React from "react";

import { CONFIG } from "lib/config";
import { Donations } from "./Donations";

const CONTRIBUTORS = [
  "Poro",
  "Grith",
  "Maxam",
  "Telk",
  "Vergelsxtn",
  "shinon",
  "kohirabbit",
  "deefault",
  "Jc",
  "Andando",
  "whaitte",
  "LittleEins",
  "Netherzapdos",
  "PurpleDrvnk",
  "RadishPies",
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
