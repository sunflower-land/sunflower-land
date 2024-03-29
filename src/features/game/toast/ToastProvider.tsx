import React, { FC, useRef, useState } from "react";
import Decimal from "decimal.js-light";
import { randomID } from "lib/utils/random";
import { createContext } from "react";
import { getKeys } from "../types/craftables";
import { InventoryItemName } from "../types/game";

/**
 * The type of the toast.
 */
export type ToastItem = InventoryItemName | "SFL" | "XP" | "coins";

/**
 * The toast props.
 * @param item The toast item.
 * @param difference The quantity difference of the item.
 * @param id The toast ID.
 * @param hidden Whether the toast is visible or not.
 */
export interface Toast {
  item: ToastItem;
  difference: Decimal;
  id: string;
  hidden: boolean;
}

/**
 * The context of the toast provider.
 * @param toastList The toasts list for the toast panel.
 * @param setInventory Sets the inventory state of the toast provider.
 * @param setSflBalance Sets the sfl balance state of the toast provider.
 * @param setCoinBalance Sets the coin balance state of the toast provider.
 * @param setExperience Sets the experience state of the toast provider.
 */
export const ToastContext = createContext<{
  toastsList: Toast[];
  setInventory: (
    inventory: Partial<Record<InventoryItemName, Decimal>>
  ) => void;
  setSflBalance: (balance: Decimal) => void;
  setCoinBalance: (balance: number) => void;
  setExperience: (experience: Decimal) => void;
}>({
  toastsList: [],
  // eslint-disable-next-line no-console
  setInventory: console.log,
  // eslint-disable-next-line no-console
  setSflBalance: console.log,
  // eslint-disable-next-line no-console
  setCoinBalance: console.log,
  // eslint-disable-next-line no-console
  setExperience: console.log,
});

/**
 * The toast timeout in milliseconds.
 * Toasts will be hidden or removed after the timeout if there are no state updates.
 */
const TOAST_TIMEOUT_MS = 5000;

/**
 * The toast provder for setting the toast list for the toast panel.
 */
export const ToastProvider: FC = ({ children }) => {
  const [toastsList, setToastsList] = useState<Toast[]>([]);

  const oldInventory = useRef<Partial<Record<InventoryItemName, Decimal>>>();
  const newInventory = useRef<Partial<Record<InventoryItemName, Decimal>>>();
  const oldSflBalance = useRef<Decimal>();
  const newSflBalance = useRef<Decimal>();
  const oldExperience = useRef<Decimal>();
  const newExperience = useRef<Decimal>();
  const oldCoinBalance = useRef<number>();
  const newCoinBalance = useRef<number>();

  const timeout = useRef<NodeJS.Timeout>();

  /**
   * Gets the quantity difference of the item between the new and old states.
   * @param item The toast item.
   * @returns The quantity difference of the item between the new and old states.
   */
  const getDifference = (item: ToastItem) => {
    if (item === "coins") {
      return new Decimal(
        (newCoinBalance.current ?? 0) - (oldCoinBalance.current ?? 0)
      );
    }

    if (item === "SFL")
      return (newSflBalance.current ?? new Decimal(0))?.minus(
        oldSflBalance.current ?? new Decimal(0)
      );

    if (item === "XP")
      return (newExperience.current ?? new Decimal(0))?.minus(
        oldExperience.current ?? new Decimal(0)
      );

    return (newInventory.current?.[item] ?? new Decimal(0))?.minus(
      oldInventory.current?.[item] ?? new Decimal(0)
    );
  };

  /**
   * Adds the toast to the toasts list.
   * Toasts will be hidden after the timeout.
   * Existing toasts with matching items will be replaced by the new toast if the quantity difference of the toast is updated.
   * @param toast The toast to add to the toasts list.
   */
  const addToast = (toast: Omit<Toast, "id" | "difference" | "hidden">) => {
    const id = `${Date.now()}-${randomID()}-${toast.item}`;
    const difference = getDifference(toast.item);

    if (difference.equals(0)) return;

    setToastsList((toastList) => {
      // do not add new toast if the quantity difference of the toast is the same as that of existing toasts with the matching item
      const existingToast = toastList.find(
        (existingToast) => existingToast.item === toast.item
      );
      if (!!existingToast && existingToast.difference.equals(difference)) {
        return toastList;
      }

      // add new toast to the start of the list
      const newToast = {
        ...toast,
        id,
        difference,
        hidden: false,
      };
      const toasts = [
        newToast,
        ...toastList.filter((toast) => toast.item !== newToast.item),
      ];

      return toasts;
    });

    // hide toast after timeout
    window.setTimeout(() => {
      hideToast(id);
    }, TOAST_TIMEOUT_MS);
  };

  /**
   * Set the hidden flag to true for the toast with the matching ID.
   * @param toastId The toast ID.
   */
  const hideToast = (toastId: string) => {
    setToastsList((toastList) => {
      const matching = (toast: Toast): boolean => toast.id === toastId;

      const foundToast = toastList.find(matching);
      if (!foundToast) return toastList;

      // add hidden toasts to the end of the list
      return [
        ...toastList.filter((toast) => !matching(toast)),
        { ...foundToast, hidden: true },
      ];
    });
  };

  /**
   * Updates the old states to the current states and clear the toasts list.
   */
  const updateOldStates = () => {
    oldInventory.current = newInventory.current;
    oldSflBalance.current = newSflBalance.current;
    oldCoinBalance.current = newCoinBalance.current;
    oldExperience.current = newExperience.current;
    setToastsList([]);
  };

  const debouncedSetOldStates = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = undefined;
    }
    timeout.current = setTimeout(() => {
      updateOldStates();
    }, TOAST_TIMEOUT_MS);
  };

  /**
   * Sets the new inventory state and add toast if there are quantity differences for inventory items.
   * @param inventory The new inventory state.
   */
  const setInventory = (
    inventory: Partial<Record<InventoryItemName, Decimal>>
  ) => {
    // set the new state
    newInventory.current = inventory;

    // if old state is not set, skip the toast logic because it is the first time setting the state
    if (!oldInventory.current) {
      oldInventory.current = inventory;
      return;
    }

    // get the inventory difference between the new and old states
    const difference: Partial<Record<InventoryItemName, Decimal>> = {};

    getKeys(inventory).forEach((item) => {
      difference[item] = inventory[item] ?? new Decimal(0);
    });

    getKeys(oldInventory.current ?? {}).forEach((item) => {
      const value = oldInventory.current?.[item] ?? new Decimal(0);
      difference[item] = difference[item]?.minus(value) ?? value.mul(-1);

      // item not needed in record if there is no quantity difference
      if (difference[item]?.equals(new Decimal(0))) {
        delete difference[item];
      }
    });

    // set toast for each item in the inventory with quantity difference
    getKeys(difference).forEach((item) => {
      addToast({ item });
    });

    // clear all toasts after debounced timeout
    debouncedSetOldStates();
  };

  /**
   * Sets the new sfl balance state and add toast if there is a quantity difference.
   * @param balance The new sfl balance state.
   */
  const setSflBalance = (balance: Decimal) => {
    // set the new state
    newSflBalance.current = balance;

    // if old state is not set, skip the toast logic because it is the first time setting the state
    if (!oldSflBalance.current) {
      oldSflBalance.current = balance;
      return;
    }

    // set toast if balance difference is not zero
    const difference = balance.minus(oldSflBalance.current ?? new Decimal(0));
    if (!difference.equals(0)) {
      addToast({ item: "SFL" });
    }

    // clear all toasts after timeout
    debouncedSetOldStates();
  };

  /**
   * Sets the new coin balance state and add toast if there is a quantity difference.
   * @param balance The new coin balance state.
   */
  const setCoinBalance = (balance: number) => {
    // set the new state
    newCoinBalance.current = balance;

    // if old state is not set, skip the toast logic because it is the first time setting the state
    if (!oldCoinBalance.current) {
      oldCoinBalance.current = balance;
      return;
    }

    // set toast if balance difference is not zero
    const difference = balance - (oldCoinBalance.current ?? 0);

    if (difference !== 0) {
      addToast({ item: "coins" });
    }

    // clear all toasts after timeout
    debouncedSetOldStates();
  };

  /**
   * Sets the new experience state and add toast if there is a quantity difference.
   * @param inventory The new experience state.
   */
  const setExperience = (experience: Decimal) => {
    // set the new state
    newExperience.current = experience;

    // if old state is not set, skip the toast logic because it is the first time setting the state
    if (!oldExperience.current) {
      oldExperience.current = experience;
      return;
    }

    // set toast if experience difference is not zero
    const difference = experience.minus(
      oldExperience.current ?? new Decimal(0)
    );
    if (!difference.equals(0)) {
      addToast({ item: "XP" });
    }

    // clear all toasts after debounced timeout
    debouncedSetOldStates();
  };

  return (
    <ToastContext.Provider
      value={{
        toastsList,
        setInventory,
        setSflBalance,
        setExperience,
        setCoinBalance,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};
