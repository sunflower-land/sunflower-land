import React from "react";

export const FeedSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-1">
      {/* Skeleton messages */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col gap-1 p-1">
          <div className="flex gap-1">
            <div className="w-6 h-6 bg-brown-300 animate-pulse"></div>
            <div className="flex-1">
              <div className="h-2 bg-brown-300 animate-pulse w-20 mb-1"></div>
              <div className="h-3 bg-brown-300 animate-pulse w-32"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
