import React from "react";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  value: number;
  max: number;
  onChange: (value: number) => void;
}

/**
 * Compact −/value/+ quantity control used in the Direction C detail panel and
 * cart rows. Stops click propagation so it can live inside clickable rows.
 */
export const Stepper: React.FC<Props> = ({ value, max, onChange }) => {
  const { t } = useAppTranslation();

  return (
    <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
      <Button
        className="w-8 h-9 p-0"
        disabled={value <= 0}
        onClick={() => onChange(value - 1)}
        aria-label={t("withdraw.stepper.decrease")}
      >
        {"-"}
      </Button>
      <div className="num w-8 text-center text-sm">{value}</div>
      <Button
        className="w-8 h-9 p-0"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        aria-label={t("withdraw.stepper.increase")}
      >
        {"+"}
      </Button>
    </div>
  );
};
