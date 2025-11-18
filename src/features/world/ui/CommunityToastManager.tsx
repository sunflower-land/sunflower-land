import React, { useState, useEffect } from "react";
import { InnerPanel } from "components/ui/Panel";
import { createPortal } from "react-dom";
import { ITEM_DETAILS } from "../../game/types/images";
import { InventoryItemName } from "../../game/types/game";
import { translate } from "lib/i18n/translate";

const PIXEL_SCALE = 2.625;
const MAX_TOAST = 6;
type ToastItem = InventoryItemName;

const getToastIcon = (item: ToastItem) => {
  return ITEM_DETAILS[item]?.image;
};

type CommunityToast = {
  item?: InventoryItemName;
  text: string;
  id: string;
};

class CommunityToastManager {
  private listener?: (toast: CommunityToast, isShown: boolean) => void;
  private id = 0;

  constructor() {
    this.id = Date.now();
  }

  public toast = (toast: CommunityToast) => {
    if (this.listener) {
      this.listener(toast, true);
    }
  };

  public listen(cb: (toast: CommunityToast, isShown: boolean) => void) {
    this.listener = cb;
  }
}

export const communityToastManager = new CommunityToastManager();

export const CommunityToasts: React.FC = () => {
  const [toasts, setToasts] = useState<CommunityToast[]>([]);

  useEffect(() => {
    communityToastManager.listen((toast, isShown) => {
      if (!toast.text) {
        // eslint-disable-next-line no-console
        return console.warn(translate("community.toast"));
      }

      const newToast: CommunityToast = {
        ...toast,
        id: Date.now().toString(),
      };

      setToasts((prevToasts) => {
        if (prevToasts.length >= MAX_TOAST) {
          prevToasts.shift();
        }

        return [...prevToasts, newToast];
      });

      // Automatically remove the toast after 5 seconds
      setTimeout(() => {
        hideToast(newToast);
      }, 5000);
    });
  }, []);

  const hideToast = (toast: CommunityToast) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t !== toast));
  };

  return (
    <>
      {toasts.length > 0 &&
        createPortal(
          <InnerPanel
            className="flex flex-col items-start absolute z-[99999] pointer-events-none"
            style={{
              top: `${PIXEL_SCALE * 85}px`,
              left: `${PIXEL_SCALE * 3}px`,
            }}
          >
            {toasts.map((toast) => (
              <div key={toast.id} className="flex items-center justify-center">
                {toast.item && (
                  <img className="h-6" src={getToastIcon(toast.item)} />
                )}
                <span className="text-sm mx-1 mb-0.5">{`${toast.text}`}</span>
              </div>
            ))}
          </InnerPanel>,
          document.body,
        )}
    </>
  );
};
