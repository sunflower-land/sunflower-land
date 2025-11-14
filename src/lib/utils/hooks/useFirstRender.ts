import { useEffect, useEffectEvent, useState } from "react";

export const useFirstRender = (): boolean => {
  const [isFirstRender, setIsFirstRender] = useState(true);

  const markRendered = useEffectEvent(() => {
    setIsFirstRender(false);
  });

  useEffect(() => {
    markRendered();
  }, [markRendered]);

  return isFirstRender;
};
