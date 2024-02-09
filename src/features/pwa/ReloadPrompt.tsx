// /* eslint-disable no-console */
// import React, { useEffect, useRef, useState } from "react";
// import { useRegisterSW } from "virtual:pwa-register/react";
// import { ReactPortal } from "components/ui/ReactPortal";
// import classNames from "classnames";
// import { Button } from "components/ui/Button";
// import lifecycle from "page-lifecycle/dist/lifecycle.mjs";
// import { CONFIG } from "lib/config";

// const CHECK_FOR_UPDATE_INTERVAL = 1000 * 60 * 2;

// export function ReloadPrompt() {
//   const [checking, setChecking] = useState(false);

//   return (
//     <ReactPortal>
//       <div
//         className="fixed p-2 bg-black rounded-sm top-20 safe-pt left-1/2 -translate-x-1/2 text-xs flex flex-col"
//         style={{ zIndex: 10000 }}
//       >
//         <span>{`Checking for update: ${checking}`}</span>
//         <span>{`Needs update: ${needRefresh}`}</span>
//         <span>{`Release version: ${CONFIG.RELEASE_VERSION.slice(-5)}`}</span>
//       </div>
//       <div
//         className={classNames(
//           "fixed inset-x-0 bottom-0 transition-all duration-500 delay-1000 bg-brown-300 safe-pb safe-px",
//           {
//             "translate-y-20": !needRefresh,
//             "-translate-y-0": needRefresh,
//           }
//         )}
//         style={{ zIndex: 10000 }}
//       >
//         {needRefresh && (
//           <div className="mx-auto max-w-2xl flex p-2 items-center safe-pb safe-px">
//             <div className="p-1 flex flex-1">
//               <span className="text-xs">
//                 New content available, click on reload button to update.
//               </span>
//             </div>
//             <Button
//               className="max-w-max h-10"
//               onClick={() => {
//                 updateServiceWorker(true);
//                 // Safety net for if updateServiceWorker fails
//                 window.location.reload();
//               }}
//             >
//               Reload
//             </Button>
//           </div>
//         )}
//       </div>
//     </ReactPortal>
//   );
// }
