import { NPC_WEARABLES } from "lib/npcs";
import React from "react";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { translate } from "lib/i18n/translate";

// const desiredFlowerDialogues = (desiredFlowerName: string) => [
//   `${translate("flowerShop.desired.dreaming", {
//     desiredFlowerName: desiredFlowerName,
//   })}`,
//   `${translate("flowerShop.desired.delightful", {
//     desiredFlowerName: desiredFlowerName,
//   })}`,
//   `${translate("flowerShop.desired.wonderful", {
//     desiredFlowerName: desiredFlowerName,
//   })}`,
//   `${translate("flowerShop.desired.setMyHeart", {
//     desiredFlowerName: desiredFlowerName,
//   })}`,
// ];

// const lostPagesDialogues = [
//   `${translate("flowerShop.missingPages.alas")}.`,
//   `${translate("flowerShop.missingPages.cantBelieve")}`,
//   `${translate("flowerShop.missingPages.inABind")}`,
//   `${translate("flowerShop.missingPages.sadly")}`,
// ];

// const _springBlossom = (week: number) => (state: MachineState) =>
//   state.context.state.springBlossom[week];
// const _inventory = (state: MachineState) => state.context.state.inventory;

interface Props {
  onClose: () => void;
}
export const FlowerShop: React.FC<Props> = ({ onClose }) => {
  // const { gameService } = useContext(Context);
  // const inventory = useSelector(gameService, _inventory);

  // const [tab, setTab] = useState(0);

  // const [confirmAction, setConfirmAction] = useState(false);

  // const desiredFlowerDialogue = useRandomItem(
  //   desiredFlowerDialogues(springBlossom?.weeklyFlower)
  // );

  // if (true) {
  return (
    <SpeakingModal
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES.poppy}
      message={[
        {
          text: `${translate("flowerShop.noFlowers.noTrade")}`,
          actions: [
            {
              text: "Close",
              cb: () => onClose(),
            },
          ],
        },
      ]}
    />
  );
  // }

  // if (!confirmAction) {
  //   return (
  //     <SpeakingModal
  //       onClose={onClose}
  //       bumpkinParts={NPC_WEARABLES.poppy}
  //       message={[
  //         {
  //           text: desiredFlowerDialogue,
  //         },
  //         {
  //           text: `${translate("flowerShop.do.have.trade", {
  //             desiredFlower: springBlossom.weeklyFlower,
  //           })}`,

  //           actions: [
  //             {
  //               text: "Close",
  //               cb: () => onClose(),
  //             },
  //             {
  //               text: "Trade",
  //               cb: () => setConfirmAction(true),
  //             },
  //           ],
  //         },
  //       ]}
  //     />
  //   );
  // }

  // return (
  //   <CloseButtonPanel
  //     bumpkinParts={NPC_WEARABLES.poppy}
  //     tabs={[{ icon: SUNNYSIDE.icons.seedling, name: "Flower Trade" }]}
  //     onClose={onClose}
  //     currentTab={tab}
  //     setCurrentTab={setTab}
  //   >
  //     {tab === 0 && (
  //       <FlowerTrade
  //         alreadyComplete={!!springBlossom.tradedFlowerShop}
  //         desiredFlower={springBlossom.weeklyFlower}
  //         flowerCount={(
  //           inventory[springBlossom.weeklyFlower] ?? new Decimal(0)
  //         ).toNumber()}
  //       />
  //     )}
  //   </CloseButtonPanel>
  // );
};
