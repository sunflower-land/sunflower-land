import React, { useEffect, useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { pixelGrayBorderStyle } from "features/game/lib/style";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";
import { getSystemMessage } from "features/auth/actions/systemMessage";

export const ChapterIntroSection: React.FC = () => {
  const { t } = useAppTranslation();

  return (
    <div
      className={classNames(
        `w-full items-center flex  text-xs p-2 pr-4 mt-1 relative mb-1`,
      )}
      style={{
        background: "#c0cbdc",
        color: "#181425",
        ...pixelGrayBorderStyle,
      }}
    >
      <img src={SUNNYSIDE.icons.expression_alerted} className="h-5 mr-2" />
      <div>
        <p className="text-xs flex-1">Chapter Intro</p>
      </div>
    </div>
  );
};
