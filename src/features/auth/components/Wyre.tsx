import React, { useEffect, useState } from "react";

export const Wyre: React.FC = () => {
  const [wyre, setWyre] = useState<any>(null);

  useEffect(() => {
    const wyre = new (window as any).Wyre({
      env: "test",
      reservation: "2YZC2JFVVGJB8GALXPJB",
      operation: {
        type: "debitcard-hosted-dialog",
      },
    });

    wyre.on("paymentSuccess", (event: any) => {
      console.log("PAYMENT", event);
    });

    wyre.open();

    setWyre(wyre);
  }, []);

  return <>Wyre</>;
};
