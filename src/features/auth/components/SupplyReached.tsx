import React, { useContext, useEffect, useState } from "react";
import * as Auth from "features/auth/lib/Provider";

export const SupplyReached: React.FC = () => {
  const { authService } = useContext(Auth.Context);

  const [count, setCount] = useState(0);

  const keydownKeyboardListener = (event: KeyboardEvent) => {
    event.stopPropagation();
    const key = event.key.toLowerCase();

    if (key === "q") {
      setCount((prev) => {
        if (prev === 3) {
          authService.send("SKIP");

          return 0;
        }

        return prev + 1;
      });
    } else {
      setCount(0);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keydownKeyboardListener);

    return () =>
      document.removeEventListener("keydown", keydownKeyboardListener);
  }, []);

  return (
    <div className="flex flex-col text-center text-shadow items-center p-1">
      <p className="text-center mb-3">Coming Soon - December 15th</p>
      <p className="text-center text-sm">Beta testers only</p>
    </div>
  );
};
