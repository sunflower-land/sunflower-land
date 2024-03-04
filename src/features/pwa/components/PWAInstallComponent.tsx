/* eslint-disable no-console */
import React, { useRef, useEffect } from "react";
import PWAInstall from "@khmyznikov/pwa-install/dist/pwa-install.react.js";
import { PWAInstallElement } from "@khmyznikov/pwa-install";

type PWAInstallComponentProps = {
  onInstallSuccess?: (event: Event) => void;
  onInstallFail?: (event: Event) => void;
  onUserChoiceResult?: (event: Event) => void;
  onInstallAvailable?: (event: Event) => void;
  onInstallHowTo?: (event: Event) => void;
  onInstallGallery?: (event: Event) => void;
};

export const PWAInstallComponent = ({ ...props }: PWAInstallComponentProps) => {
  const pwaInstallRef = useRef<PWAInstallElement>(null);

  // Filter out null or undefined props
  const nonNullProps = Object.fromEntries(
    Object.entries(props).filter(([_, value]) => value != null)
  );

  useEffect(() => {
    const currentElement = pwaInstallRef.current;

    if (!currentElement) return;

    const handleInstallSuccess = (event: Event) => {
      console.log("Install Success", event);
    };
    const handleInstallFail = (event: Event) => {
      console.log("Install Fail", event);
    };
    const handleUserChoiceResult = (event: Event) => {
      console.log("User Choice Result", event);
    };
    const handleInstallAvailable = (event: Event) => {
      console.log("Install Available", event);
    };
    const handleInstallHowTo = (event: Event) => {
      console.log("Install How To", event);
    };
    const handleInstallGallery = (event: Event) => {
      console.log("Install Gallery", event);
    };

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
  }, []);

  return (
    <>
      <PWAInstall
        ref={pwaInstallRef}
        manual-apple="true"
        manual-chrome="true"
        // disable-chrome="true"
        disable-install-description="false"
        disable-screenshots="true"
        manifest-url="/manifest.webmanifest"
        name="Sunflower Land"
        description="Plant, Chop, Mine, Craft & Collect at Sunflower Land. The MetaVerse game with endless resources."
        icon="pwa/icons/pwa-64x64.png"
        {...nonNullProps}
      />
      <button
        id="show install"
        onClick={() => pwaInstallRef.current?.showDialog(true)}
      >
        {`Show Install Prompt`}
      </button>
    </>
  );
};
