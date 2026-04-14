import React from "react";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { TextInput } from "components/ui/TextInput";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const RequireAbsentEditor: React.FC<{
  values: string[];
  onChange: (values: string[]) => void;
}> = ({ values, onChange }) => {
  const { t } = useAppTranslation();
  return (
    <div className="space-y-1">
      <Label type="warning">
        {t("playerEconomyEditor.requireAbsent.title")}
      </Label>
      {values.length === 0 && (
        <p className="text-[10px] italic opacity-50 ml-1">
          {t("playerEconomyEditor.requireAbsent.empty")}
        </p>
      )}
      {values.map((val, index) => (
        <div
          key={`absent-${index}`}
          className="grid grid-cols-12 gap-1 items-center"
        >
          <div className="col-span-10">
            <TextInput
              value={val}
              onValueChange={(v) => {
                const copy = [...values];
                copy[index] = v;
                onChange(copy);
              }}
              placeholder="Token that must NOT exist"
            />
          </div>
          <div className="col-span-2">
            <Button
              variant="secondary"
              onClick={() => onChange(values.filter((_, i) => i !== index))}
              className="w-full"
            >
              <img
                src={SUNNYSIDE.icons.cancel}
                className="w-3"
                style={{ imageRendering: "pixelated" }}
              />
            </Button>
          </div>
        </div>
      ))}
      <Button variant="secondary" onClick={() => onChange([...values, ""])}>
        <span className="text-xs">
          {t("playerEconomyEditor.requireAbsent.add")}
        </span>
      </Button>
    </div>
  );
};
