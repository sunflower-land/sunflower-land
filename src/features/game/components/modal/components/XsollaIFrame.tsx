import React, { useEffect } from "react";

type Props = {
  url: string;
  onSuccess: () => void;
  onClose: () => void;
};

export const XsollaIFrame: React.FC<Props> = ({ url, onSuccess, onClose }) => {
  useEffect(() => {
    const listener = (event: any) => {
      const origin = new URL(url).origin;

      if (event.origin !== origin) return;

      const eventData = JSON.parse(event.data);
      if (eventData.command === "close-widget") {
        onClose();
      }

      if (eventData.command === "return") {
        onSuccess();
      }
    };
    window.addEventListener("message", listener);

    return () => window.removeEventListener("message", listener);
  }, []);

  return (
    <iframe
      src={url}
      title="Xsolla Checkout"
      className="w-full h-full rounded-lg shadow-md absolute"
    />
  );
};
