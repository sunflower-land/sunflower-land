// import React, { useContext, useRef, useState } from "react";
// import { useActor } from "@xstate/react";
// import classNames from "classnames";

// import selectBox from "assets/ui/select/select_box.png";
// import cancel from "assets/icons/cancel.png";

// import { Context } from "features/game/GameProvider";


// import { ITEM_DETAILS } from "features/game/types/images";
// import { GRID_WIDTH_PX } from "features/game/lib/constants";
// import { FlowerSoil } from "./FlowerSoil";
// import { harvestAudio, plantAudio } from "lib/utils/sfx";
// import { HealthBar } from "components/ui/HealthBar";

// const POPOVER_TIME_MS = 1000;
// const HOVER_TIMEOUT = 1000;

// interface Props {
//   selectedItem?: InventoryItemName;
//   flowerFieldIndex: number;
//   className?: string;
//   onboarding?: boolean;
// }

// const isFlowerReady = (
//   now: number,
//   plantedAt: number,
//   harvestSeconds: number
// ) => now - plantedAt > harvestSeconds * 1000;

// export const FlowerField: React.FC<Props> = ({
//   selectedItem,
//   className,
//   flowerFieldIndex,
// }) => {
//   const [showPopover, setShowPopover] = useState(true);
//   const [popover, setPopover] = useState<JSX.Element | null>();
//   const { gameService } = useContext(Context);
//   const [touchCount, setTouchCount] = useState(0);
//   const [flowerReward, setFlowerReward] = useState<FlowerReward | null>(null);
//   const [game] = useActor(gameService);
//   const clickedAt = useRef<number>(0);
//   const flowerField = game.context.state.flowerFields[flowerFieldIndex];
//   const [showFlowerDetails, setFlowerDetails] = useState(false);

//   const displayPopover = async (element: JSX.Element) => {
//     setPopover(element);
//     setShowPopover(true);

//     await new Promise((resolve) => setTimeout(resolve, POPOVER_TIME_MS));
//     setShowPopover(false);
//   };

//   const onCollectFlowerReward = () => {
//     setFlowerReward(null);
//     setTouchCount(0);

//     gameService.send("item.harvested", {
//       index: flowerFieldIndex,
//     });
//   };

//   const handleMouseHover = () => {
//     // check field if there is a crop
//     if (flowerField) {
//       const flower = FLOWERS()[flowerField.name];
//       const now = Date.now();
//       const isReady = isFlowerReady(
//         now,
//         flowerField.plantedAt,
//         flower.harvestSeconds
//       );
//       const isJustPlanted = now - flowerField.plantedAt < 1000;

//       // show details if field is NOT ready and NOT just planted
//       if (!isReady && !isJustPlanted) {
//         setFlowerDetails(true);
//       }
//     }

//     return;
//   };

//   const handleMouseLeave = () => {
//     setFlowerDetails(false);
//   };

//   const onClick = () => {
//     // Small buffer to prevent accidental double clicks
//     const now = Date.now();
//     if (now - clickedAt.current < 100) {
//       return;
//     }

//     clickedAt.current = now;

//     // Already looking at a reward
//     if (flowerReward) {
//       return;
//     }

//     if (
//       flowerField?.flowerReward &&
//       isFlowerReady(
//         now,
//         flowerField.plantedAt,
//         FLOWERS()[flowerField.name].harvestSeconds
//       )
//     ) {
//       if (touchCount < 1) {
//         setTouchCount((count) => count + 1);
//         return;
//       }

//       // They have touched enough!
//       setFlowerReward(flowerField.flowerReward);

//       return;
//     }

//     // Plant
//     if (!flowerField) {
//       try {
//         gameService.send("flower.planted", {
//           index: flowerFieldIndex,
//           item: selectedItem,
//         });

//         plantAudio.play();

//         displayPopover(
//           <div className="flex items-center justify-center text-xs text-white text-shadow overflow-visible">
//             <img
//               src={ITEM_DETAILS[selectedItem as FlowerName].image}
//               className="w-4 mr-1"
//             />
//             <span>-1</span>
//           </div>
//         );
//       } catch (e: any) {
//         // TODO - catch more elaborate errors
//         displayPopover(<img className="w-5" src={cancel} />);
//       }

//       return;
//     }

//     try {
//       gameService.send("flower.harvested", {
//         index: flowerFieldIndex,
//       });

//       harvestAudio.play();

//       displayPopover(
//         <div className="flex items-center justify-center text-xs text-white text-shadow overflow-visible">
//           <img
//             src={ITEM_DETAILS[flowerField.name].image}
//             className="w-4 mr-1"
//           />
//           <span>{`+${flowerField.multiplier || 1}`}</span>
//         </div>
//       );
//     } catch (e: any) {
//       // TODO - catch more elaborate errors
//       displayPopover(<img className="w-5" src={cancel} />);
//     }

//     setTouchCount(0);
//   };

//   const playing = game.matches("playing") || game.matches("autosaving");

//   return (
//     <div
//       onMouseEnter={handleMouseHover}
//       onMouseLeave={handleMouseLeave}
//       className={classNames("relative group", className)}
//       style={{
//         width: `${GRID_WIDTH_PX}px`,
//         height: `${GRID_WIDTH_PX}px`,
//       }}
//     >
//       <FlowerSoil
//         className="absolute bottom-0"
//         flowerField={flowerField}
//         showFlowerDetails={showFlowerDetails}
//       />

//       <div
//         className={classNames(
//           "transition-opacity pointer-events-none absolute -bottom-2 left-1",
//           {
//             "opacity-100": touchCount > 0,
//             "opacity-0": touchCount === 0,
//           }
//         )}
//       >
//         <HealthBar percentage={100 - touchCount * 50} />
//       </div>

//       <div
//         className={classNames(
//           "transition-opacity absolute -bottom-2 w-full z-20 pointer-events-none flex justify-center",
//           {
//             "opacity-100": showPopover,
//             "opacity-0": !showPopover,
//           }
//         )}
//       >
//         {popover}
//       </div>
//       {playing && (
//         <img
//           src={selectBox}
//           style={{
//             opacity: 0.1,
//           }}
//           className="absolute inset-0 w-full opacity-0 sm:group-hover:opacity-100 sm:hover:!opacity-100 z-20 cursor-pointer"
//           onClick={onClick}
//         />
//       )}
//       <FlowerRewards
//         flowerReward={flowerReward}
//         onCollected={onCollectFlowerReward}
//         flowerFieldIndex={flowerFieldIndex}
//       />
//     </div>
//   );
// };
