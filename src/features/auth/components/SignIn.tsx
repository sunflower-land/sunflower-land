import React, { useContext } from "react";

import { Context as AuthContext } from "../lib/Provider";

import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { WalletWall } from "features/wallet/components/WalletWall";

const Login: React.FC<{ screen: "signin" | "signup" }> = ({ screen }) => {
  const { authService } = useContext(AuthContext);
  const { t } = useAppTranslation();

  return (
    <>
      <WalletWall
        screen={screen}
        onSignMessage={({ address, signature }) => {
          authService.send({ type: "CONNECTED", address, signature });
        }}
      />
      <div className="flex justify-between my-1 items-center">
        <a href="https://discord.gg/sunflowerland" className="mr-4">
          <img
            src="https://img.shields.io/discord/880987707214544966?label=Sunflower%20Land&logo=Discord&style=social"
            alt="Discord: Sunflower Land"
          />
        </a>
        <a
          href="https://docs.sunflower-land.com/getting-started/how-to-start"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-base font-secondary"
        >
          {t("welcome.needHelp")}
        </a>
      </div>
    </>
  );
};

export const SignIn = () => <Login screen="signin" />;
export const SignUp = () => <Login screen="signup" />;
