import { CONFIG } from "lib/config";
import React, { useLayoutEffect } from "react";

interface Props {
  onDone: (token: string) => void;
  action: string;
}
export const CloudFlareCaptcha: React.FC<Props> = ({ onDone, action }) => {
  useLayoutEffect(() => {
    const options = {
      sitekey: CONFIG.CLOUDFLARE_CAPTCHA_SITEKEY,
      action,
      "error-callback": () => onDone(""),
      "expired-callback": () => onDone(""),
      callback: onDone,
    };

    (window as any).turnstile.render("#cloudflareCaptcha", options);
  }, []);

  return (
    <div
      className="h-28 w-full flex items-center justify-center"
      id="cloudflareCaptcha"
    />
  );
};
