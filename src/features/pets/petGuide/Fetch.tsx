import { InnerPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import React, { useEffect, useState } from "react";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { ITEM_DETAILS } from "features/game/types/images";
import { Label } from "components/ui/Label";
import { PIXEL_SCALE } from "features/game/lib/constants";
import classNames from "classnames";
import {
  FETCHES_BY_CATEGORY,
  PetCategoryName,
  PetResourceName,
} from "features/game/types/pets";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const SECONDARY_RESOURCES = Object.values(FETCHES_BY_CATEGORY);

export const Fetch: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t } = useAppTranslation();
  const [secondaryResource, setSecondaryResource] = useState<PetResourceName>(
    SECONDARY_RESOURCES[0],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondaryResource((current) => {
        const index = SECONDARY_RESOURCES.indexOf(current);
        return SECONDARY_RESOURCES[(index + 1) % SECONDARY_RESOURCES.length];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const categories: Record<
    PetCategoryName,
    {
      fetchResource: PetResourceName;
      icon: string;
    }
  > = {
    Guardian: {
      fetchResource: "Chewed Bone",
      icon: ITEM_DETAILS["Chewed Bone"].image,
    },
    Hunter: {
      fetchResource: "Ribbon",
      icon: ITEM_DETAILS.Ribbon.image,
    },
    Voyager: {
      fetchResource: "Ruffroot",
      icon: ITEM_DETAILS.Ruffroot.image,
    },
    Beast: {
      fetchResource: "Wild Grass",
      icon: ITEM_DETAILS["Wild Grass"].image,
    },
    Moonkin: {
      fetchResource: "Heart leaf",
      icon: ITEM_DETAILS["Heart leaf"].image,
    },
    Snowkin: {
      fetchResource: "Frost Pebble",
      icon: ITEM_DETAILS["Frost Pebble"].image,
    },
    Forager: {
      fetchResource: "Dewberry",
      icon: ITEM_DETAILS.Dewberry.image,
    },
  };

  return (
    <InnerPanel className="relative overflow-y-auto max-h-[400px] scrollable gap-2">
      <div className="flex items-center gap-2">
        <img
          src={SUNNYSIDE.icons.arrow_left}
          onClick={onBack}
          style={{
            width: `${PIXEL_SCALE * 11}px`,
            cursor: "pointer",
          }}
        />
        <Label type="default">{t("petGuide.fetch.title")}</Label>
      </div>
      <p className="text-xs px-2 mt-1 mb-2">
        {t("petGuide.fetch.description")}
      </p>
      <NoticeboardItems
        items={[
          {
            text: t("petGuide.fetch.description2"),
            icon: SUNNYSIDE.icons.expression_confused,
          },
          {
            text: t("petGuide.fetch.description3"),
            icon: ITEM_DETAILS.Acorn.image,
          },
          {
            text: t("petGuide.fetch.description4"),
            icon: ITEM_DETAILS["Fossil Shell"].image,
          },
          {
            text: t("petGuide.fetch.description5"),
            icon: ITEM_DETAILS.Moonfur.image,
          },
          {
            text: t("petGuide.fetch.description6"),
            icon: ITEM_DETAILS[secondaryResource].image,
          },
        ]}
      />
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-xs table-fixed border-collapse">
          <tbody>
            {getObjectEntries(categories).map(
              ([categoryName, category], index) => (
                <tr
                  key={categoryName}
                  className={classNames("relative", {
                    "bg-[#ead4aa]": index % 2 === 0,
                  })}
                >
                  <td
                    style={{ border: "1px solid #b96f50" }}
                    className="p-1.5 w-1/3"
                  >
                    {categoryName}
                  </td>
                  <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                    <div className="flex items-center gap-1">
                      <img
                        src={category.icon}
                        className="w-6 h-6 object-contain"
                      />
                      <span>{category.fetchResource}</span>
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </InnerPanel>
  );
};
