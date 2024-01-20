import { translate } from "lib/i18n/translate";
import React from "react";

export const Beta: React.FC = () => {
  return (
    <>
      <span className="text-shadow">{translate("statements.beta.one")}</span>
      <span className="text-shadow text-xs block mt-4">
        {translate("statements.beta.two")}
      </span>
    </>
  );
};
