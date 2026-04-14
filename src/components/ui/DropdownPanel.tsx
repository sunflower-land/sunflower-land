import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { SUNNYSIDE } from "assets/sunnyside";
import { DropdownButtonPanel, DropdownOptionsPanel } from "./Panel";
import classNames from "classnames";

/** Above HeadlessUI `Modal` / `Dialog` (`z-50`). */
const DROPDOWN_PORTAL_Z = 60;

export interface DropdownOption {
  value: string;
  label?: React.ReactNode;
  icon?: string;
}

interface DropdownProps<T extends string> {
  options: DropdownOption[];
  value?: T;
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
}

export const DropdownPanel = <T extends string>({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className,
}: DropdownProps<T>) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuBox, setMenuBox] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const selectedOption = options.find((option) => option.value === value);
  const selectedLabel = selectedOption?.label ?? selectedOption?.value;

  const updateMenuPosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    setMenuBox({
      top: rect.bottom + 2,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  const closeDropdown = useCallback(() => {
    setShowDropdown(false);
    setMenuBox(null);
  }, []);

  useLayoutEffect(() => {
    if (!showDropdown) return;
    updateMenuPosition();
  }, [showDropdown, updateMenuPosition, options, value]);

  useEffect(() => {
    if (!showDropdown) return;

    const onScrollOrResize = () => updateMenuPosition();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [showDropdown, updateMenuPosition]);

  useEffect(() => {
    if (!showDropdown) return;

    const onPointerDown = (event: MouseEvent) => {
      const node = event.target as Node;
      if (triggerRef.current?.contains(node)) return;
      if (menuRef.current?.contains(node)) return;
      closeDropdown();
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [showDropdown, closeDropdown]);

  useEffect(() => {
    if (!showDropdown) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDropdown();
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showDropdown, closeDropdown]);

  const menuContent =
    showDropdown && menuBox && typeof document !== "undefined" ? (
      <div
        ref={menuRef}
        className="pointer-events-auto"
        style={{
          position: "fixed",
          top: menuBox.top,
          left: menuBox.left,
          width: menuBox.width,
          zIndex: DROPDOWN_PORTAL_Z,
        }}
      >
        <DropdownOptionsPanel className="flex flex-col max-h-[200px] scrollable overflow-y-auto">
          {options
            .filter((option) => option.value !== value)
            .map((option) => (
              <div
                key={option.value}
                className="flex items-start gap-2 py-2 px-1 cursor-pointer hover:bg-[#ead4aa]/50 border-t border-white/40"
                onClick={() => {
                  closeDropdown();
                  onChange(option.value as T);
                }}
              >
                {option.icon && (
                  <img src={option.icon} className="w-5 shrink-0 mt-0.5" />
                )}
                <div className="text-sm flex-1 min-w-0 flex flex-col gap-0.5">
                  {option.label ?? option.value}
                </div>
              </div>
            ))}
        </DropdownOptionsPanel>
      </div>
    ) : null;

  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      <div ref={triggerRef}>
        <DropdownButtonPanel
          className="flex items-center justify-between gap-2"
          onClick={() =>
            showDropdown ? closeDropdown() : setShowDropdown(true)
          }
        >
          <div
            className={classNames("flex items-start gap-2 py-1 px-1 text-left")}
          >
            {selectedOption?.icon && (
              <img src={selectedOption.icon} className="w-5 shrink-0 mt-0.5" />
            )}
            <div className="ml-1 flex-1 min-w-0 flex flex-col gap-0.5">
              {selectedOption ? selectedLabel : placeholder}
            </div>
          </div>
          <img
            src={SUNNYSIDE.icons.chevron_down}
            className={`w-5 ${showDropdown ? "rotate-180" : ""}`}
          />
        </DropdownButtonPanel>
      </div>

      {menuContent && createPortal(menuContent, document.body)}
    </div>
  );
};
