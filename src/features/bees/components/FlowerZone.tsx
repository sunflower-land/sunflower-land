// import React, { useContext } from "react";

// import { Context } from "features/game/GameProvider";
// import { GRID_WIDTH_PX } from "features/game/lib/constants";

// import { FlowerField } from "./FlowerField";

// export const FlowerZone: React.FC = () => {
//   const { selectedItem } = useContext(Context);

//   return (
//     <div
//       className="absolute flex justify-center flex-col "
//       style={{
//         width: `${GRID_WIDTH_PX * 3}px`,
//         height: `${GRID_WIDTH_PX * 3}px`,
//         left: `${GRID_WIDTH_PX * 4}px`,
//         top: `${GRID_WIDTH_PX * 13}px`,
//       }}
//     >
//       {/* Top row */}
//       <div className="flex justify-between">
//         <FlowerField selectedItem={selectedItem} flowerFieldIndex={0} />
//       </div>
//       {/* Middle row */}
//       <div className="flex justify-center">
//         <FlowerField selectedItem={selectedItem} flowerFieldIndex={1} />
//       </div>
//     </div>
//   );
// };


import React, { useContext } from "react";

import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Field } from "./Field";

export const FlowerZone: React.FC = () => {
  const { selectedItem } = useContext(Context);

  return (
    <div
      className="absolute flex justify-center flex-col "
      style={{
        width: `${GRID_WIDTH_PX * 3}px`,
        height: `${GRID_WIDTH_PX * 3}px`,
        left: `${GRID_WIDTH_PX * 3}px`,
        top: `${GRID_WIDTH_PX * 8.5}px`,
      }}
    >
      {/* Top row */}
      <div className="flex justify-between">
        <Field selectedItem={selectedItem} fieldIndex={22} />
        <Field selectedItem={selectedItem} fieldIndex={23} />
      </div>
      {/* Middle row */}
      <div className="flex justify-center">
        <Field selectedItem={selectedItem} fieldIndex={24} />
      </div>
      {/* Bottom row */}
  
    </div>
  );
};
