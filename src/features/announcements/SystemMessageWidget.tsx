import React, { useEffect, useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { pixelGrayBorderStyle } from "features/game/lib/style";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";
import { getSystemMessage } from "features/auth/actions/systemMessage";

export const SystemMessageWidget: React.FC = () => {
  const [message, setMessage] = useState<string | null>();

  const { t } = useAppTranslation();

  useEffect(() => {
    const load = async () => {
      const message = await getSystemMessage();
      setMessage(message);
    };
    load();
  }, []);

  if (!message) {
    return null;
  }

  return (
    <div
      className={classNames(
        `w-full items-center flex  text-xs p-2 pr-4 mt-1 relative`,
      )}
      style={{
        background: "#c0cbdc",
        color: "#181425",
        ...pixelGrayBorderStyle,
      }}
    >
      <img
        src={SUNNYSIDE.icons.expression_alerted}
        className="h-5 mr-2"
        onClick={() => setMessage(null)}
      />
      <div>
        <p className="text-xs flex-1">{message}</p>
      </div>
      <img
        src={SUNNYSIDE.icons.close}
        className="absolute right-2 top-1 w-5 cursor-pointer"
        onClick={() => setMessage(null)}
      />
    </div>
  );
};
