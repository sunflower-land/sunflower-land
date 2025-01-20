import React, { useRef } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import sunshower from "assets/icons/sunshower.webp";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";

export const Sunshower: React.FC<{
  acknowledge: () => void;
}> = ({ acknowledge }) => {
  const { t } = useAppTranslation();

  const sunshowerPositions = useRef<
    {
      top: number;
      left: number;
      delay: number;
    }[]
  >(
    [...Array(30)].map((_, i) => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 2,
    })),
  );

  return (
    <>
      <Panel className="relative z-10">
        <div className="p-1">
          <Label type="vibrant" icon={sunshower} className="mb-2">
            {t("sunshower.specialEvent")}
          </Label>

          <NoticeboardItems
            items={[
              {
                text: t("sunshower.info.one"),
                icon: SUNNYSIDE.icons.plant,
              },
            ]}
          />
        </div>
        <Button onClick={acknowledge}>{t("continue")}</Button>
      </Panel>
      <div className="fixed inset-0  overflow-hidden">
        {sunshowerPositions.current.map(({ top, left, delay }, i) => (
          <img
            key={i}
            src={sunshower}
            className="w-12 absolute animate-pulse"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              animationDelay: `${delay}s`,
            }}
          />
        ))}
      </div>
    </>
  );
};
