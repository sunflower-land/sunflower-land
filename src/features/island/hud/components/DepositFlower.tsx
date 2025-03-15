import React, { useContext, useState } from "react";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";

import baseIcon from "assets/icons/chains/base.png";
import polygonIcon from "assets/icons/chains/polygon.webp";
import {
  DropdownOptionsPanel,
  ButtonPanel,
  DropdownButtonPanel,
} from "components/ui/Panel";
import flowerIcon from "assets/icons/flower_token.webp";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { CopySvg } from "components/ui/CopyField";
import { useTranslation } from "react-i18next";

const networkOptions = [
  { value: "Base", icon: baseIcon },
  { value: "Polygon", icon: polygonIcon }, // You might want to use a different icon for Polygon
];

const _depositAddress = (state: MachineState): string =>
  state.context.data["depositingFlower"]?.depositAddress ??
  "0xdef0123456789abcdef0123456789abcdef012345";

export const DepositFlower: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useTranslation();
  const [selectedNetwork, setSelectedNetwork] = useState<string>();
  const [acknowledged, setAcknowledged] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState<string>(t("copied"));

  const depositAddress = useSelector(gameService, _depositAddress);

  const handleNetworkChange = (network: string) => {
    setAcknowledged(false);
    setSelectedNetwork(network);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(depositAddress);

      setShowLabel(true);
    } catch (e: unknown) {
      setShowLabel(true);
      setTooltipMessage(typeof e === "string" ? e : t("copy.failed"));
    }

    // Close tooltip after two seconds
    setTimeout(() => {
      setShowLabel(false);
    }, 2000);
  };

  return (
    <>
      <div>
        <div className="flex items-center gap-3 mb-2">
          <img
            src={SUNNYSIDE.icons.arrow_left}
            className="w-6 cursor-pointer"
            onClick={onClose}
          />
          <Label type="default" icon={flowerIcon}>
            {`Deposit $FLOWER`}
          </Label>
        </div>

        <Dropdown
          options={networkOptions}
          value={selectedNetwork}
          onChange={handleNetworkChange}
          placeholder="Select network"
        />

        {!acknowledged && selectedNetwork && (
          <>
            <div className="flex flex-col gap-2 p-2 mt-2">
              <div className="flex  gap-2">
                <img src={SUNNYSIDE.icons.expression_alerted} className="h-5" />
                <span className="text-xxs sm:text-xs">
                  {`Only deposit $FLOWER from ${selectedNetwork}. Other deposits will be lost.`}
                </span>
              </div>
              <div className="flex gap-2">
                <img src={flowerIcon} className="h-5" />
                <span className="text-xxs sm:text-xs">
                  {`Minimum deposit is 2 $FLOWER.`}
                </span>
              </div>
              <div className="flex gap-2">
                <img src={SUNNYSIDE.icons.stopwatch} className="h-5" />
                <span className="text-xxs sm:text-xs">
                  {`Processing times may vary.`}
                </span>
              </div>
            </div>
            <ButtonPanel
              className="w-full text-center"
              onClick={() => setAcknowledged(true)}
            >
              <span>{`I understand`}</span>
            </ButtonPanel>
          </>
        )}

        {acknowledged && selectedNetwork && (
          <div className="relative flex flex-col items-center justify-center gap-2 p-2 mt-2">
            <span className="px-3 sm:px-[50px]  text-center break-all select-text">
              {depositAddress}
            </span>
            <div className="flex items-center gap-1" onClick={copyToClipboard}>
              <CopySvg height={12} />
              <span className="text-xxs sm:text-xs pb-1">
                {`Copy deposit address`}
              </span>
            </div>
            <div
              className={`absolute top-8 right-10 transition duration-400 pointer-events-none ${
                showLabel ? "opacity-100" : "opacity-0"
              }`}
            >
              <Label type="success">{tooltipMessage}</Label>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

interface DropdownOption {
  value: string;
  icon?: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className={`flex flex-col gap-2 relative ${className}`}>
      <DropdownButtonPanel
        className="flex items-center justify-between gap-2"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="flex items-center gap-2">
          {selectedOption?.icon && (
            <img src={selectedOption.icon} className="w-5" />
          )}
          <p className="mb-1 ml-1">
            {selectedOption ? selectedOption.value : placeholder}
          </p>
        </div>
        <img
          src={SUNNYSIDE.icons.chevron_down}
          className={`w-5 ${showDropdown ? "rotate-180" : ""}`}
        />
      </DropdownButtonPanel>

      {showDropdown && (
        <div className="absolute top-[78%] left-0 right-0 z-50">
          <DropdownOptionsPanel className="flex flex-col">
            {options
              .filter((option) => option.value !== value)
              .map((option) => (
                <div
                  key={option.value}
                  className="flex items-center gap-2 py-2 cursor-pointer hover:brightness-90"
                  onClick={() => {
                    setShowDropdown(false);
                    onChange(option.value);
                  }}
                >
                  {option.icon && <img src={option.icon} className="w-5" />}
                  <span className="text-sm">{option.value}</span>
                </div>
              ))}
          </DropdownOptionsPanel>
        </div>
      )}
    </div>
  );
};
