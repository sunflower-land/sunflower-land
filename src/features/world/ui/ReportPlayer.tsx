import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Dropdown } from "components/ui/Dropdown";
import { Label } from "components/ui/Label";
import { NumberInput } from "components/ui/NumberInput";
import { TextInput } from "components/ui/TextInput";
import React, { useState } from "react";

interface Props {
  id: number;
}
const REASONS = ["Botting", "Multiaccounting", "Bug Abuse", "Other"];
export const ReportPlayer: React.FC<Props> = ({ id }) => {
  const [farmId, setFarmId] = useState(id);
  const [reason, setReason] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string>("");
  return (
    <>
      <div className="p-1 flex flex-col overflow-y-auto scrollable">
        <div className="flex flex-col">
          <Label type="default" icon={SUNNYSIDE.icons.search} className="my-1">
            {`Farm ID`}
          </Label>
          <NumberInput
            value={farmId}
            onValueChange={(decimal) => setFarmId(decimal.toNumber())}
            maxDecimalPlaces={0}
          />
        </div>
        <div className="flex flex-col">
          <Label type="default" icon={SUNNYSIDE.icons.search} className="my-1">
            {`Reason`}
          </Label>
          <Dropdown
            options={REASONS}
            value={reason}
            onChange={(value) => setReason(value)}
          />
        </div>
        <div className="flex flex-col">
          <Label
            type="default"
            icon={SUNNYSIDE.icons.expression_chat}
            className="my-1"
          >
            {`Message`}
          </Label>
          <TextInput
            value={message}
            onValueChange={setMessage}
            placeholder="Describe the issue..."
          />
        </div>
      </div>
      <Button className="my-1" disabled={!farmId || !reason || !message}>
        {`Send`}
      </Button>
    </>
  );
};
