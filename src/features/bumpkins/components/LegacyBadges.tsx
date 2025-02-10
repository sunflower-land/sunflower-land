import { SplitScreenView } from "components/ui/SplitScreenView";
import { LEGACY_BADGE_TREE } from "features/game/types/skills";
import React, { useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { OuterPanel } from "components/ui/Panel";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SquareIcon } from "components/ui/SquareIcon";
import { getObjectEntries } from "features/game/expansion/lib/utils";

interface Props {
  onBack: () => void;
  onClose: () => void;
}

export const LegacyBadges: React.FC<Props> = ({ onBack, onClose }) => {
  const { t } = useAppTranslation();
  const BADGES = getObjectEntries(LEGACY_BADGE_TREE);
  const [selectedSkill, setSelectedSkill] = useState(BADGES[0]);
  const [LegacyBadgeName, legacySkillDetails] = selectedSkill;
  const { buff } = legacySkillDetails;
  return (
    <CloseButtonPanel
      tabs={[{ icon: SUNNYSIDE.badges.seedSpecialist, name: "Legacy Badges" }]}
      container={OuterPanel}
      onClose={onClose}
    >
      <SplitScreenView
        wideModal
        panel={
          <div className="flex flex-col h-full justify-between">
            <div className="flex gap-x-2 justify-start items-center sm:flex-col-reverse sm:py-0 py-2">
              <img
                src={SUNNYSIDE.icons.arrow_left}
                className="cursor-pointer block sm:hidden"
                alt="back"
                style={{
                  width: `${PIXEL_SCALE * 11}px`,
                  marginRight: `${PIXEL_SCALE * 1}px`,
                }}
                onClick={onBack}
              />
              <div className="sm:mt-2">
                <SquareIcon
                  icon={ITEM_DETAILS[LegacyBadgeName].image}
                  width={14}
                />
              </div>
              <span className="sm:text-center">{LegacyBadgeName}</span>
            </div>
            <div className="flex sm:flex-col flex-wrap gap-1 mt-2 ml-2 sm:ml-0 justify-start sm:justify-center items-start sm:items-center">
              {buff &&
                buff.map(
                  (
                    {
                      labelType,
                      shortDescription,
                      boostedItemIcon,
                      boostTypeIcon,
                    },
                    index,
                  ) => (
                    <Label
                      key={index}
                      type={labelType}
                      icon={boostTypeIcon}
                      secondaryIcon={boostedItemIcon}
                    >
                      {shortDescription}
                    </Label>
                  ),
                )}
            </div>
          </div>
        }
        content={
          <div>
            {/* Header */}
            <div
              className="flex flex-row my-2 items-center"
              style={{ margin: `${PIXEL_SCALE * 2}px` }}
            >
              <img
                src={SUNNYSIDE.icons.arrow_left}
                className="cursor-pointer hidden sm:block"
                alt="back"
                style={{
                  width: `${PIXEL_SCALE * 11}px`,
                  marginRight: `${PIXEL_SCALE * 4}px`,
                }}
                onClick={onBack}
              />
              <Label type="default">{`Legacy Badges`}</Label>
            </div>
            {/* Skills */}
            <div className="flex flex-row flex-wrap gap-0">
              {BADGES.map(([skill, details]) => {
                return (
                  <Box
                    key={skill}
                    image={ITEM_DETAILS[skill].image}
                    onClick={() => setSelectedSkill([skill, details])}
                    isSelected={LegacyBadgeName === skill}
                  />
                );
              })}
            </div>
          </div>
        }
      />
    </CloseButtonPanel>
  );
};
