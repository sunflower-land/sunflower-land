import { SUNNYSIDE } from "assets/sunnyside";
import chest from "assets/icons/chest.png";
import sfl from "assets/icons/token_2.png";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import { NPCFixed } from "features/island/bumpkin/components/NPC";
import React, { useContext } from "react";
import { Context } from "../lib/Provider";
import { getPromoCode } from "features/game/actions/loadSession";

export const Offer: React.FC = () => {
  const { authService } = useContext(Context);
  const promo = getPromoCode();
  if (promo === "okx") {
    return (
      <>
        <div className="p-2">
          <p className="mb-2">
            Howdy Farmer, I have an exclusive OKX offer for you!
          </p>

          <p className="mb-2 text-sm">
            Sign up <span className="underline">today</span> and you will
            receive:
          </p>

          <div className="flex flex-wrap">
            <div className="flex mb-2 items-center w-1/2">
              <div className="w-8">
                <img src={SUNNYSIDE.icons.plant} className="h-6" />
              </div>
              <p className="text-sm">1 Farm NFT</p>
            </div>
            <div className="flex mb-2 items-center w-1/2">
              <div className="h-8 w-8">
                <div className="-ml-0.5">
                  <NPCFixed
                    parts={{
                      body: "Beige Farmer Potion",
                      hair: "Rancher Hair",
                      shirt: "Red Farmer Shirt",
                    }}
                    width={32}
                  />
                </div>
              </div>
              <p className="text-sm">1 Bumpkin NFT</p>
            </div>
            <div className="flex mb-2 items-center w-1/2">
              <div className="w-8">
                <img
                  src={ITEM_DETAILS["Block Buck"].image}
                  className="h-5 mr-2"
                />
              </div>
              <p className="text-sm">10 Block Bucks</p>
            </div>
            <div className="flex mb-2 items-center w-1/2">
              <div className="w-8">
                <img src={chest} className="h-6 mr-2  animate-pulsate" />
              </div>
              <p className="text-sm">Mystery Starter Pack</p>
            </div>
            <div className="flex mb-2 items-center w-1/2">
              <div className="w-8">
                <img src={sfl} className="h-6 mr-2  animate-pulsate" />
              </div>
              <p className="text-sm">30 SFL</p>
            </div>
          </div>
          <div className="flex items-center my-1">
            <span className="line-through text-sm mr-1">$4.99</span>
            <Label type="info">
              <span className="text-sm">$2.99</span>
            </Label>
          </div>
        </div>
        <Button onClick={() => authService.send("CONTINUE")}>
          Get Starter Pack Now
        </Button>
      </>
    );
  }
  return (
    <>
      <div className="p-2">
        <p className="mb-2">Howdy Farmer, I have an exclusive offer for you!</p>

        <p className="mb-2 text-sm">
          Sign up <span className="underline">today</span> and you will receive:
        </p>

        <div className="flex flex-wrap">
          <div className="flex mb-2 items-center w-1/2">
            <div className="w-8">
              <img src={SUNNYSIDE.icons.plant} className="h-6" />
            </div>
            <p className="text-sm">1 Farm NFT</p>
          </div>
          <div className="flex mb-2 items-center w-1/2">
            <div className="h-8 w-8">
              <div className="-ml-0.5">
                <NPCFixed
                  parts={{
                    body: "Beige Farmer Potion",
                    hair: "Rancher Hair",
                    shirt: "Red Farmer Shirt",
                  }}
                  width={32}
                />
              </div>
            </div>
            <p className="text-sm">1 Bumpkin NFT</p>
          </div>
          <div className="flex mb-2 items-center w-1/2">
            <div className="w-8">
              <img
                src={ITEM_DETAILS["Block Buck"].image}
                className="h-5 mr-2"
              />
            </div>
            <p className="text-sm">5 Block Bucks</p>
          </div>
          <div className="flex mb-2 items-center w-1/2">
            <div className="w-8">
              <img src={chest} className="h-6 mr-2  animate-pulsate" />
            </div>
            <p className="text-sm">1 Mystery Gift</p>
          </div>
        </div>
        <div className="flex items-center my-1">
          <span className="line-through text-sm mr-1">$4.99</span>
          <Label type="info">
            <span className="text-sm">$2.99</span>
          </Label>
        </div>
      </div>
      <Button onClick={() => authService.send("CONTINUE")}>
        Get Starter Pack Now
      </Button>
    </>
  );
};
