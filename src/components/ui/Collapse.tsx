import React, { useEffect, useRef, useState } from "react";

export const Collapse: React.FC<{
  isExpanded: boolean;
  className?: string;
}> = ({ isExpanded, children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setContentHeight(ref.current.clientHeight);
    }
  }, [children]);

  return (
    <div
      className="overflow-hidden transition-all duration-500"
      style={{
        height: isExpanded ? contentHeight : 0,
      }}
    >
      <div className={className} ref={ref}>
        {children}
      </div>
    </div>
  );
};
