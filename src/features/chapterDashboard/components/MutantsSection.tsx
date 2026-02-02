import React, { useMemo, useState } from "react";

import { InnerPanel } from "components/ui/Panel";
import { SectionHeader } from "./SectionHeader";
import { SUNNYSIDE } from "assets/sunnyside";
import { ChapterName } from "features/game/types/chapters";
import {
  CHAPTER_MUTANTS,
  MutantsChapterName,
} from "features/game/types/chapterMutants";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { Label } from "components/ui/Label";

type Props = {
  chapter: ChapterName;
};

export const MutantsSection: React.FC<Props> = ({ chapter }) => {
  const { t } = useAppTranslation();
  const [showDetails, setShowDetails] = useState(false);

  const mutants = CHAPTER_MUTANTS[chapter as MutantsChapterName];
  const preview = useMemo(() => {
    if (!mutants) return [];

    const items = [
      mutants.Chicken,
      mutants.Fish,
      mutants.Flower,
      ...(mutants.Cow ? [mutants.Cow] : []),
      ...(mutants.Sheep ? [mutants.Sheep] : []),
    ];

    // Pick 3 "current mutants" to preview.
    return items.slice(0, 3).map((name) => ({
      name,
      image: ITEM_DETAILS[name as keyof typeof ITEM_DETAILS]?.image,
    }));
  }, [mutants]);

  if (!mutants) {
    return null;
  }

  return (
    <>
      <InnerPanel className="mb-2">
        <div className="p-1 space-y-2">
          <SectionHeader
            title={t("season.codex.mutants")}
            labelType="vibrant"
            actionText={t("read.more")}
            onAction={() => setShowDetails(true)}
          />

          <div className="flex items-start gap-2">
            <div className="relative flex-1 rounded-md overflow-hidden">
              <img
                src={SUNNYSIDE.ui.grey_background}
                className="absolute inset-0 w-full h-full"
              />
              <div className="relative p-2">
                <p className="text-xs text-white mb-2">
                  {t("season.codex.mutants.discover")}
                </p>

                <div className="flex gap-2">
                  {preview.map((p) => (
                    <div
                      key={p.name}
                      className="relative w-12 h-12 flex items-center justify-center"
                    >
                      <img
                        src={SUNNYSIDE.ui.grey_background}
                        className="absolute inset-0 w-full h-full rounded-md"
                      />
                      {p.image ? (
                        <img
                          src={p.image}
                          className="w-2/3 h-2/3 object-contain z-10"
                        />
                      ) : (
                        <img
                          src={SUNNYSIDE.icons.expression_confused}
                          className="w-2/3 h-2/3 object-contain z-10"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </InnerPanel>

      <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg">
        <CloseButtonPanel onClose={() => setShowDetails(false)}>
          <div className="p-2">
            <SectionHeader title={t("season.codex.mutants")} labelType="vibrant" />
            <p className="text-xs mt-2">{t("season.codex.mutants.discover")}</p>

            <img className="my-2 w-full rounded-md" src={mutants.banner} />

            <Label type="default" className="mb-2">
              {t("season.codex.mutants")}
            </Label>

            <NoticeboardItems
              iconWidth={8}
              items={[
                {
                  text: t("season.codex.mutants.one", {
                    item: mutants.Chicken,
                  }),
                  icon: ITEM_DETAILS.Chicken.image,
                },
                {
                  text: t("season.codex.mutants.two", {
                    item: mutants.Fish,
                  }),
                  icon: ITEM_DETAILS.Rod.image,
                },
                {
                  text: t("season.codex.mutants.three", {
                    item: mutants.Flower,
                  }),
                  icon: ITEM_DETAILS["Red Pansy"].image,
                },
                ...(mutants.Cow
                  ? [
                      {
                        text: t("season.codex.mutants.four", {
                          item: mutants.Cow,
                        }),
                        icon: ITEM_DETAILS["Cow"].image,
                      },
                    ]
                  : []),
                ...(mutants.Sheep
                  ? [
                      {
                        text: t("season.codex.mutants.five", {
                          item: mutants.Sheep,
                        }),
                        icon: ITEM_DETAILS["Sheep"].image,
                      },
                    ]
                  : []),
              ]}
            />
          </div>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};

