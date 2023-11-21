import React, { useState } from "react";

import suspiciousGoblin from "assets/npcs/suspicious_goblin.gif";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export type JiggerStatus = "VERIFY" | "PENDING" | "REJECTED";
interface Props {
  verificationUrl: string;
  status: JiggerStatus;
  onClose: () => void;
}

export const Jigger: React.FC<Props> = ({
  verificationUrl,
  status,
  onClose,
}) => {
  const [showWarning, setShowWarning] = useState(false);
  const { t } = useAppTranslation();
  if (showWarning) {
    return (
      <div className="flex flex-col items-center p-2">
        <span className="text-center">Proof of Humanity</span>
        <img src={SUNNYSIDE.icons.expression_alerted} className="w-6 mt-2" />
        <span className="text-sm mt-2 mb-2">
          You will be redirected to a 3rd party service to take a quick selfie.
          Never share any personal information or crypto data.
        </span>

        <div className="flex w-full">
          <Button
            onClick={() => {
              window.location.href = verificationUrl as string;
            }}
          >
            {t("continue")}
          </Button>
        </div>
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div className="flex flex-col items-center p-2">
        <span className="text-center">Uh oh!</span>
        <img src={suspiciousGoblin} alt="Warning" className="w-16 m-2" />
        <span className="text-sm mt-2 mb-2">
          You failed the Jigger Proof of Humanity.
        </span>
        <span className="text-sm mt-2 mb-2">
          You can continue playing, but some actions will be restricted while
          you are being verified.
        </span>
        <span className="text-sm mt-2 mb-2">
          Please reach out to support@usejigger.com if you beleive this was a
          mistake.
        </span>
        <div className="flex w-full">
          <Button className="mr-2" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    );
  }

  if (status === "PENDING") {
    return (
      <div className="flex flex-col items-center p-2">
        <span className="text-center">Uh oh!</span>
        <img src={suspiciousGoblin} alt="Warning" className="w-16 m-2" />
        <span className="text-sm mt-2 mb-2">
          Your proof of humanity is still being processed by Jigger. This can
          take up to 2 hours.
        </span>
        <span className="text-sm mt-2 mb-2">
          You can continue playing, but some actions will be restricted while
          you are being verified.
        </span>
        <span className="text-sm mt-2 mb-2">Thank you for your patience.</span>
        <div className="flex w-full">
          <Button className="mr-2" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-center">Uh oh!</span>
      <img src={suspiciousGoblin} alt="Warning" className="w-16 m-2" />
      <span className="text-sm mt-2 mb-2">
        The multi-account detection system has picked up strange behaviour.
      </span>
      <span className="text-sm mt-2 mb-2">
        You can continue playing, but some actions will be restricted while you
        are being verified.
      </span>
      <div className="flex w-full">
        <Button className="mr-2" onClick={onClose}>
          Close
        </Button>
        <Button onClick={() => setShowWarning(true)}>Verify</Button>
      </div>
    </div>
  );
};
