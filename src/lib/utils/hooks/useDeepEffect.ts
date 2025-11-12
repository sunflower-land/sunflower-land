import { useEffect, useRef } from "react";
import { isEqual } from "lodash";

export function useDeepEffect(callback: () => void, dependencies: any[]) {
  const ref = useRef<any[]>(undefined);

  if (!ref.current || !isEqual(ref.current, dependencies)) {
    ref.current = dependencies;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(callback, [ref.current]);
}
