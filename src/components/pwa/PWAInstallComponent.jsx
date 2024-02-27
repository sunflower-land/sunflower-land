/* eslint-disable react/prop-types */
import React, { useRef, useEffect } from "react";

/*  dependencies:
    "@khmyznikov/pwa-install": "*",
    "@lit": "*"
*/
import PWAInstall from "@khmyznikov/pwa-install/dist/pwa-install.react.js";

/*
  manifestUrl = '/manifest.json',
  icon = '',
  name = 'React App',
  description = '',
  installDescription = '',
  disableDescription = false,
  disableScreenshots = false,
  manualApple = false,
  manualChrome = false,
  disableChrome = false,
*/

export const PWAInstallComponent = ({
  // eslint-disable-next-line react/prop-types
  onInstallSuccess,
  onInstallFail,
  onUserChoiceResult,
  onInstallAvailable,
  onInstallHowTo,
  onInstallGallery,
  ...props
}) => {
  const pwaInstallRef = useRef(null);

  // Filter out null or undefined props
  const nonNullProps = Object.fromEntries(
    Object.entries(props).filter(([_, value]) => value != null)
  );

  useEffect(() => {
    const currentElement = pwaInstallRef.current;

    const handleInstallSuccess = (event) => onInstallSuccess?.(event);
    const handleInstallFail = (event) => onInstallFail?.(event);
    const handleUserChoiceResult = (event) => onUserChoiceResult?.(event);
    const handleInstallAvailable = (event) => onInstallAvailable?.(event);
    const handleInstallHowTo = (event) => onInstallHowTo?.(event);
    const handleInstallGallery = (event) => onInstallGallery?.(event);

    if (currentElement) {
      currentElement.addEventListener(
        "pwa-install-success-event",
        handleInstallSuccess
      );
      currentElement.addEventListener(
        "pwa-install-fail-event",
        handleInstallFail
      );
      currentElement.addEventListener(
        "pwa-user-choice-result-event",
        handleUserChoiceResult
      );
      currentElement.addEventListener(
        "pwa-install-available-event",
        handleInstallAvailable
      );
      currentElement.addEventListener(
        "pwa-install-how-to-event",
        handleInstallHowTo
      );
      currentElement.addEventListener(
        "pwa-install-gallery-event",
        handleInstallGallery
      );

      return () => {
        currentElement.removeEventListener(
          "pwa-install-success-event",
          handleInstallSuccess
        );
        currentElement.removeEventListener(
          "pwa-install-fail-event",
          handleInstallFail
        );
        currentElement.removeEventListener(
          "pwa-user-choice-result-event",
          handleUserChoiceResult
        );
        currentElement.removeEventListener(
          "pwa-install-available-event",
          handleInstallAvailable
        );
        currentElement.removeEventListener(
          "pwa-install-how-to-event",
          handleInstallHowTo
        );
        currentElement.removeEventListener(
          "pwa-install-gallery-event",
          handleInstallGallery
        );
      };
    }
  }, [
    onInstallSuccess,
    onInstallFail,
    onUserChoiceResult,
    onInstallAvailable,
    onInstallHowTo,
    onInstallGallery,
  ]);

  return (
    <>
      <PWAInstall
        ref={pwaInstallRef}
        // manual-apple="true"
        // manual-chrome="true"
        // disable-chrome="false"
        install-description="Custom call to install text"
        disable-install-description="false"
        disable-screenshots="true"
        manifest-url="/manifest.webmanifest"
        name="Sunflower Land"
        description="Progressive web application"
        icon="/pwa/pwa-64x64.png"
        {...nonNullProps}
      />
      <button
        id="show install"
        onClick={() => pwaInstallRef.current.showDialog(true)}
      >
        {`Show Install Prompt`}
      </button>
    </>
  );
};
