import classNames from "classnames";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useEffect, useState } from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
}

export const Loading: React.FC<Props> = ({ text, className }) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length >= 3) {
          return "";
        } else {
          return prevDots + ".";
        }
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const { t } = useAppTranslation();
  return (
    <span
      className={classNames(
        "text-base",
        className,
        "relative mb-1 mx-1 block w-fit"
      )}
    >
      {text || t("loading")}

      <span
        className="absolute top-0"
        style={{
          left: "calc(100% - 12px)",
        }}
      >
        {dots}
      </span>
      <span className="opacity-0">{`...`}</span>
    </span>
  );
};
