import { CONFIG } from "lib/config";
import React, { useLayoutEffect } from "react";

interface Props {
  onDone: (token: string) => void;
  onExpire: () => void;
  onError: () => void;
  action: string;
}
export const CloudFlareCaptcha: React.FC<Props> = ({
  onDone,
  onExpire,
  onError,
  action,
}) => {
  useLayoutEffect(() => {
    const options = {
      sitekey: CONFIG.CLOUDFLARE_CAPTCHA_SITEKEY,
      action,
      "error-callback": () => onDone(""),
      "expired-callback": () => onDone(""),
      // TODO
      // "expired-callback": onExpire,
      // "error-callback": onError,
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
