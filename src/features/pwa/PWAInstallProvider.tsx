/* eslint-disable no-console */
import React, {
  createContext,
  useEffect,
  useRef,
  useContext,
  ReactNode,
} from "react";
import PWAInstall from "@khmyznikov/pwa-install/dist/pwa-install.react.js";
import { PWAInstallElement } from "@khmyznikov/pwa-install";

// Define the context type
type PWAInstallContextType = React.MutableRefObject<PWAInstallElement | null>;

// Create a context for the PWAInstall ref
const PWAInstallContext = createContext<PWAInstallContextType | undefined>(
  undefined
);

// PWAInstallProvider props
type PWAInstallProviderProps = {
  children: ReactNode;
};

// PWAInstallProvider component
export const PWAInstallProvider: React.FC<PWAInstallProviderProps> = ({
  children,
}) => {
  const pwaInstallRef = useRef<PWAInstallElement | null>(null);

  useEffect(() => {
    console.log("USER AGENT", navigator.userAgent);
    console.log("WINDOW.ETHEREUM", window.ethereum);
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
    <PWAInstallContext.Provider value={pwaInstallRef}>
      {/* Render the PWAInstall component and pass the ref */}
      {children}
      <div className="fixed top-2 left-1/2" style={{ zIndex: 5678907878 }}>
        <button
          id="show install"
          onClick={() => pwaInstallRef.current?.showDialog(true)}
        >
          {`Show Install Prompt`}
        </button>
      </div>
      <PWAInstall
        ref={pwaInstallRef}
        manual-apple="true"
        manual-chrome="true"
        // disable-chrome="true"
        disable-install-description="false"
        disable-screenshots="true"
        manifest-url="manifest.webmanifest"
        name="Sunflower Land"
        description="Plant, Chop, Mine, Craft & Collect at Sunflower Land. The MetaVerse game with endless resources."
        icon="pwa/icons/pwa-64x64.png"
      />
    </PWAInstallContext.Provider>
  );
};

// Custom hook to access the PWAInstall ref
export const usePWAInstall = (): PWAInstallContextType => {
  const context = useContext(PWAInstallContext);

  if (!context) {
    throw new Error("usePWAInstall must be used within a PWAInstallProvider.");
  }

  return context;
};
