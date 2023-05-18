import { Button } from "components/ui/Button";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "../components/CloseablePanel";

const POTIONS = {
  "Bloom Boost": {
    ingredients: {
      Pumpkin: 10,
      Cabbage: 10,
      Iron: 10,
    },
    color: "red",
  },
  "Harmony Hooch": {
    ingredients: {
      Parsnip: 10,
      Radish: 10,
      Wood: 10,
    },
    color: "blue",
  },
  "Earth Essence": {
    ingredients: {
      Potatoes: 10,
      Stone: 10,
      Iron: 10,
    },
    color: "green",
  },
  "Flower Power": {
    ingredients: {
      Sunflowers: 10,
      Iron: 10,
    },
    color: "yellow",
  },
  "Organic Oasis": {
    ingredients: {
      Eggs: 10,
      Kale: 10,
      Stone: 10,
    },
    color: "purple",
  },
};

// - You can see how many attempts you have
// - You can see previous attempts and the success
// - You can see the happiness of the plant
// - You can see what each potion does + add it
// - You can confirm your select of potions before mixing
// - The Potion Master guides a player and is visible at the top (is difficult with height on Mobile devices)

export const Beans = () => {
  const [openModal, setOpenModal] = useState(false);

  console.log({ openModal });

  return (
    <>
      <div>
        <Button onClick={() => setOpenModal(true)}>Beans</Button>
      </div>
      <Modal
        show={openModal}
        onHide={() => setOpenModal(false)}
        onClose={() => setOpenModal(false)}
        centered
      >
        <CloseButtonPanel onClose={() => setOpenModal(false)}>
          <div>Hello friend</div>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
