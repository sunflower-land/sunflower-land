import React from "react";
import { MegaStore } from "../megastore/MegaStore";

interface Props {
  onClose: () => void;
}
export const Stylist: React.FC<Props> = ({ onClose }) => {
  return <MegaStore onClose={onClose} />;
};
