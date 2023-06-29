import { CONFIG } from "lib/config";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../lib/Provider";
import { useActor } from "@xstate/react";
import { Loading } from "./Loading";
import { wallet } from "lib/blockchain/wallet";
import { signTransaction } from "../actions/createAccount";
import { CharityAddress } from "./CreateFarm";

interface PokoConfig {
  url: string;
  network: string;
  marketplaceCode: string;
  itemName: string;
  itemImageURL: string;
  listingId: number;
  apiKey: string;
  extra: string;
  receiverId: string;
}

const PokoIFrame: React.FC<
  PokoConfig & { onProcessing: () => void; onSuccess: () => void }
> = ({
  onProcessing,
  onSuccess,
  url,
  network,
  marketplaceCode,
  itemImageURL,
  itemName,
  listingId,
  apiKey,
  extra,
  receiverId,
}) => {
  useEffect(() => {
    const handler = (
      event: MessageEvent<{ type: string; message: string }>
    ) => {
      console.log({ event });
      const origin = new URL(url).origin;

      if (event.origin !== origin) return;

      const data = JSON.parse(event.data as unknown as string);

      if (data.eventName !== "onPokoDirectCheckoutStatusChange") return;
      if (data.data?.status === "succeeded") {
        onSuccess();
      }
      if (data.data?.status === "payment_received") {
        onProcessing();
      }
    };

    window.addEventListener("message", handler);

    return () => window.removeEventListener("message", handler);
  }, []);
  // It is possible to theme this with &backgroundColorHex=c18669&textColorHex=ffffff&primaryColorHex=e7a873
  // I wasn't able to get it looking nice though
  return (
    <iframe
      src={`${url}?itemName=${itemName}&itemImageURL=${itemImageURL}&network=${network}&apiKey=${apiKey}&listingId=${listingId}&type=nft&marketplaceCode=${marketplaceCode}&receiverId=${receiverId}&extra=${extra}`}
      className="w-full h-[85vh] sm:h-[65vh]"
      title="Poko widget"
      allow="accelerometer; autoplay; camera; gyroscope; payment"
    />
  );
};

export const BuyWithPoko: React.FC = () => {
  const { authService } = useContext(Context);
  const [authState] = useActor(authService);

  const [loading, setLoading] = useState(false);
  const [pokoConfig, setPokoConfig] = useState<PokoConfig>();

  const loadTransaction = async () => {
    setLoading(true);
    try {
      const amount = 2.99;

      const transaction = await signTransaction({
        charity: CharityAddress.TheWaterProject,
        token: authState.context.user.rawToken as string,
        captcha: authState.context.transactionId as string,
        transactionId: authState.context.transactionId as string,
        type: "USDC",
      });

      const details = {
        signature: transaction.signature,
        deadline: transaction.deadline,
        mintFee: transaction.fee,
        bumpkinItemIds: transaction.bumpkinWearableIds,
        referrerId: transaction.referrerId,
        referrerAmount: transaction.referrerAmount,
        account: wallet.myAccount?.toLowerCase(),
      };

      setPokoConfig({
        url:
          CONFIG.NETWORK === "mumbai"
            ? "https://dev.checkout.pokoapp.xyz/checkout"
            : "https://checkout.pokoapp.xyz/checkout",
        network:
          CONFIG.NETWORK === "mumbai" ? "polygonMumbaiRealUSDC" : "polygon",
        marketplaceCode: "sunflowerland",
        listingId: authState.context.user.farmId as number,
        itemName: encodeURIComponent(
          `${amount} Block Buck${amount > 1 ? "s" : ""}`
        ),
        itemImageURL: encodeURIComponent(
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAAXNSR0IArs4c6QAAABhQTFRFAAAAPolIGBQkcz45Y8dN/q40JlxC93Yi51WP2wAAAAh0Uk5TAP/////////VylQyAAAAm0lEQVRYhe3X0QqAIAyFYVem7//GDQ0ZEjWLYK7zX3UR38WhkkJACCGEjpaRHIB8TywRUVR0axoHq0allBIpujanADVIlxtQbriKnIGnMzKSc95KfNGZmlfPONjMtiELTNUB68WQNhEoN/QNtk+i3PDlc2gZlEdAN+Pjr419sN2mPPU8gfqmBqWp3FB/ppgFg/m/gC9AhBBCP2kHvTwQvZ+Xte4AAAAASUVORK5CYII="
        ),
        apiKey: CONFIG.POKO_DIRECT_CHECKOUT_API_KEY,
        extra: encodeURIComponent(JSON.stringify(details)),
        receiverId: wallet.myAccount?.toLowerCase() as string,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransaction();
  }, []);

  if (loading) {
    return (
      <div className="h-32">
        <Loading />
      </div>
    );
  }

  return pokoConfig ? (
    <PokoIFrame
      {...pokoConfig}
      onProcessing={() => setLoading(true)}
      onSuccess={() => authService.send("CONTINUE")}
    />
  ) : (
    <div className="h-32">Something went wrong</div>
  );
};
