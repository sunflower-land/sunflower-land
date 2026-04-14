import React from "react";
import { InnerPanel } from "components/ui/Panel";

export const PlayerDetailsSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col flex-1 gap-1">
      {/* Player Info Panel */}
      <InnerPanel className="flex flex-col gap-1 flex-1 pb-1 px-1">
        <div className="flex items-center">
          <div className="h-4 bg-brown-300 animate-pulse w-24"></div>
        </div>
        <div className="flex pb-1">
          <div className="w-10">
            <div className="w-10 h-10 bg-brown-300 animate-pulse"></div>
          </div>
          <div className="flex flex-col gap-1 text-xs mt-1 ml-2 flex-1">
            <div className="h-3 bg-brown-300 animate-pulse w-20"></div>
            <div className="flex items-center justify-between">
              <div className="h-3 bg-brown-300 animate-pulse w-12"></div>
              <div className="h-3 bg-brown-300 animate-pulse w-16"></div>
            </div>
          </div>
        </div>
      </InnerPanel>

      {/* Island Panel */}
      <InnerPanel className="flex flex-col w-full pb-1">
        <div className="p-1 flex items-center">
          <div className="w-10">
            <div className="w-10 h-10 bg-brown-300 animate-pulse"></div>
          </div>
          <div className="flex pb-1 flex-col justify-center gap-1 text-xs mt-1 ml-2 flex-1">
            <div className="h-3 bg-brown-300 animate-pulse w-16"></div>
            <div className="flex items-center">
              <div className="h-3 bg-brown-300 animate-pulse w-20"></div>
            </div>
          </div>
          <div className="flex w-fit h-9 justify-between items-center gap-1 mt-1 bg-brown-300 animate-pulse px-2">
            <div className="flex items-center px-1">
              <div className="w-4 h-4" />
            </div>
          </div>
        </div>
      </InnerPanel>

      {/* Followers Panel */}
      <InnerPanel className="flex flex-col items-center w-full">
        <div className="flex flex-col gap-1 p-1 w-full ml-1 pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="h-3 bg-brown-300 animate-pulse w-16"></div>
              <div className="relative w-10 h-6">
                <div className="absolute">
                  <div className="w-6 h-6 bg-brown-300 animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="flex w-fit h-9 justify-between items-center gap-1 mt-1 mr-0.5 bg-brown-300 animate-pulse px-3">
              <div className="h-3 w-12" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 p-1 pt-0 mb-2 w-full">
          <div className="h-3 bg-brown-300 animate-pulse w-32"></div>
          <div className="h-3 bg-brown-300 animate-pulse w-36"></div>
          <div className="h-3 bg-brown-300 animate-pulse w-24"></div>
        </div>
      </InnerPanel>

      {/* Delivery Panel */}
      <InnerPanel className="flex flex-col w-full pb-1">
        <div className="p-1 flex items-center">
          <div className="w-10">
            <div className="w-10 h-10 bg-brown-300 animate-pulse"></div>
          </div>
          <div className="flex pb-1 flex-col justify-center gap-1 text-xs mt-1 ml-2 flex-1">
            <div className="h-3 bg-brown-300 animate-pulse w-20"></div>
            <div className="h-3 bg-brown-300 animate-pulse w-24"></div>
          </div>
        </div>
      </InnerPanel>
    </div>
  );
};
