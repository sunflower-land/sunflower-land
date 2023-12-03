/**
 * Entry Point to Portal App
 * Include any initialisation logic, stylesheets + more here.
 */
import React from "react";
import "src/styles.css";

import { initialise } from "lib/utils/init";

import { CropBoomApp } from "./examples/cropBoom/CropBoom";

initialise();

export const PortalApp: React.FC = () => {
  return <CropBoomApp />;
};
