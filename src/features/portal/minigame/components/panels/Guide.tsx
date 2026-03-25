import React from "react";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SquareIcon } from "components/ui/SquareIcon";
import { Label } from "components/ui/Label";
import {
  RESOURCES_TABLE,
  ENEMIES_TABLE,
  PORTAL_NAME,
  INSTRUCTIONS,
  IMMUNITY_GUIDE,
  REFEREE,
} from "../../Constants";

export const Guide = () => {
  const { t } = useAppTranslation();

  return (
    <div className="flex flex-col gap-1 max-h-[75vh]">
      {/* title */}
      <div className="flex flex-col gap-1">
        <div className="flex text-center">
          <div className="grow mb-3 text-lg">{t(`${PORTAL_NAME}.guide`)}</div>
        </div>
      </div>

      {/* content */}
      <div className="flex flex-col gap-1 overflow-y-auto scrollable pr-1">
        {/* Instructions */}
        <Label type="default">{t(`${PORTAL_NAME}.instructions`)}</Label>
        {INSTRUCTIONS.map(({ image, description, width = 10 }, index) => (
          <div key={index}>
            <div className="flex items-center mb-3 mx-2">
              <SquareIcon icon={image} width={width} />
              <p className="text-xs ml-3 flex-1">
                {t(`${PORTAL_NAME}.guideDescription`, {
                  description: description,
                })}
              </p>
            </div>
          </div>
        ))}
        {/* Resources */}
        <Label type="default">{t(`${PORTAL_NAME}.resources`)}</Label>
        <table className="w-full text-xs table-fixed border-collapse">
          <tbody>
            {RESOURCES_TABLE.map(
              ({ image, description, width = 13 }, index) => (
                <tr key={index}>
                  <td
                    style={{ border: "1px solid #b96f50" }}
                    className="p-1.5 w-1/6"
                  >
                    <div className="flex items-center justify-center">
                      {<SquareIcon icon={image} width={width} />}
                    </div>
                  </td>
                  <td
                    style={{ border: "1px solid #b96f50" }}
                    className="p-1.5 w-5/6"
                  >
                    {t(`${PORTAL_NAME}.guideDescription`, {
                      description: description,
                    })}
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
        {/* Immunities guide */}
        <Label type="default">{t(`${PORTAL_NAME}.immunities`)}</Label>
        <table className="w-full text-xs table-fixed border-collapse">
          <tbody>
            {IMMUNITY_GUIDE.map(({ image, description, width = 13 }, index) => (
              <tr key={index}>
                <td
                  style={{ border: "1px solid #b96f50" }}
                  className="p-1.5 w-1/6"
                >
                  <div className="flex items-center justify-center">
                    {<SquareIcon icon={image} width={width} />}
                  </div>
                </td>
                <td
                  style={{ border: "1px solid #b96f50" }}
                  className="p-1.5 w-5/6"
                >
                  {t(`${PORTAL_NAME}.guideDescription`, {
                    description: description,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Referee */}
        <Label type="default">{t(`${PORTAL_NAME}.referee`)}</Label>
        <table className="w-full text-xs table-fixed border-collapse">
          <tbody>
            <tr>
              <td
                style={{ border: "1px solid #b96f50" }}
                className="p-1.5 w-1/6"
              >
                <div className="flex items-center justify-center">
                  {<SquareIcon icon={REFEREE.image} width={13} />}
                </div>
              </td>
              <td
                style={{ border: "1px solid #b96f50" }}
                className="p-1.5 w-5/6"
              >
                {t(`${PORTAL_NAME}.guideDescription`, {
                  description: REFEREE.description,
                })}
              </td>
            </tr>
          </tbody>
        </table>
        {/* Enemies */}
        <Label type="default">{t(`${PORTAL_NAME}.enemies`)}</Label>
        <table className="w-full text-xs table-fixed border-collapse">
          <tbody>
            {ENEMIES_TABLE.map(({ image, description, width = 13 }, index) => (
              <tr key={index}>
                <td
                  style={{ border: "1px solid #b96f50" }}
                  className="p-1.5 w-1/6"
                >
                  <div className="flex items-center justify-center">
                    {<SquareIcon icon={image} width={width} />}
                  </div>
                </td>
                <td
                  style={{ border: "1px solid #b96f50" }}
                  className="p-1.5 w-5/6"
                >
                  {t(`${PORTAL_NAME}.guideDescription`, {
                    description: description,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
