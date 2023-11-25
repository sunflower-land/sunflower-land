import React, { ChangeEvent, useContext, useState } from "react";

import { Button } from "components/ui/Button";
import { Context } from "../lib/Provider";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE, TEST_FARM } from "features/game/lib/constants";

import metamaskIcon from "src/assets/icons/metamask_pixel.png";
import walletIcon from "src/assets/icons/wallet.png";
import phantomIcon from "src/assets/icons/phantom.svg";
import okxIcon from "src/assets/icons/okx.svg";
import cryptoComIcon from "src/assets/icons/crypto-com-logo.svg";
import bitgetIcon from "src/assets/icons/bitget_logo.svg";

import { Label } from "components/ui/Label";
import { Web3SupportedProviders } from "lib/web3SupportedProviders";
import { getPromoCode, savePromoCode } from "features/game/actions/loadSession";
import { hasFeatureAccess } from "lib/flags";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const OtherWallets = () => {
  const { authService } = useContext(Context);
  const { t } = useAppTranslation();

  return (
    <>
      <>
        <Button
          className="mb-2 py-2 text-sm relative"
          onClick={() =>
            authService.send("CONNECT_TO_WALLET", {
              chosenProvider: Web3SupportedProviders.BITGET,
            })
          }
        >
          <div className="px-8">
            <img
              src={bitgetIcon}
              alt="Bitget"
              className="h-7 mobile:h-6 ml-2.5 mr-6 absolute left-0 top-1 rounded-sm"
            />
            <Label
              type="info"
              className="absolute top-1/2 -translate-y-1/2 right-1"
            >
              {t("featured")}
            </Label>
            Bitget {t("wallet")}
          </div>
        </Button>
        <Button
          className="mb-2 py-2 text-sm relative"
          onClick={() =>
            authService.send("CONNECT_TO_WALLET", {
              chosenProvider: Web3SupportedProviders.CRYPTO_COM,
            })
          }
        >
          <div className="px-8">
            <img
              src={cryptoComIcon}
              alt="Crypto.com"
              className="h-7 mobile:h-6 ml-2.5 mr-6 absolute left-0 top-1 rounded-sm"
            />
            Crypto.com {t("wallet")}
          </div>
        </Button>
        <Button
          className="mb-2 py-2 text-sm relative"
          onClick={() =>
            authService.send("CONNECT_TO_WALLET", {
              chosenProvider: Web3SupportedProviders.OKX,
            })
          }
        >
          <div className="px-8">
            <img
              src={okxIcon}
              alt="OKX"
              className="h-7 mobile:h-6 ml-2.5 mr-6 absolute left-0 top-1 rounded-sm"
            />
            OKX {t("wallet")}
          </div>
        </Button>
        <Button
          className="mb-2 py-2 text-sm relative"
          onClick={() =>
            authService.send("CONNECT_TO_WALLET", {
              chosenProvider: Web3SupportedProviders.PHANTOM,
            })
          }
        >
          <div className="px-8">
            <img
              src={phantomIcon}
              alt="Phantom"
              className="h-7 mobile:h-6 ml-2.5 mr-6 absolute left-0 top-1"
            />
            Phantom {t("wallet")}
          </div>
        </Button>
      </>

      <div className="bg-white b-1 mx-auto w-2/3 h-[1px] my-3" />
      <Button
        className="mb-2 py-2 text-sm relative"
        onClick={() =>
          authService.send("CONNECT_TO_WALLET", {
            chosenProvider: Web3SupportedProviders.WALLET_CONNECT,
          })
        }
      >
        <div className="px-8">
          <svg
            height="25"
            viewBox="0 0 40 25"
            width="40"
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 mobile:w-6 mobile:h-6  ml-2 mr-6 absolute left-0 top-1"
          >
            <path
              d="m8.19180572 4.83416816c6.52149658-6.38508884 17.09493158-6.38508884 23.61642788 0l.7848727.76845565c.3260748.31925442.3260748.83686816 0 1.15612272l-2.6848927 2.62873374c-.1630375.15962734-.4273733.15962734-.5904108 0l-1.0800779-1.05748639c-4.5495589-4.45439756-11.9258514-4.45439756-16.4754105 0l-1.1566741 1.13248068c-.1630376.15962721-.4273735.15962721-.5904108 0l-2.68489263-2.62873375c-.32607483-.31925456-.32607483-.83686829 0-1.15612272zm29.16903948 5.43649934 2.3895596 2.3395862c.3260732.319253.3260751.8368636.0000041 1.1561187l-10.7746894 10.5494845c-.3260726.3192568-.8547443.3192604-1.1808214.0000083-.0000013-.0000013-.0000029-.0000029-.0000042-.0000043l-7.6472191-7.4872762c-.0815187-.0798136-.2136867-.0798136-.2952053 0-.0000006.0000005-.000001.000001-.0000015.0000014l-7.6470562 7.4872708c-.3260715.3192576-.8547434.319263-1.1808215.0000116-.0000019-.0000018-.0000039-.0000037-.0000059-.0000058l-10.7749893-10.5496247c-.32607469-.3192544-.32607469-.8368682 0-1.1561226l2.38956395-2.3395823c.3260747-.31925446.85474652-.31925446 1.18082136 0l7.64733029 7.4873809c.0815188.0798136.2136866.0798136.2952054 0 .0000012-.0000012.0000023-.0000023.0000035-.0000032l7.6469471-7.4873777c.3260673-.31926181.8547392-.31927378 1.1808214-.0000267.0000046.0000045.0000091.000009.0000135.0000135l7.6473203 7.4873909c.0815186.0798135.2136866.0798135.2952053 0l7.6471967-7.4872433c.3260748-.31925458.8547465-.31925458 1.1808213 0z"
              fill="currentColor"
            ></path>
          </svg>
          Wallet Connect
        </div>
      </Button>
    </>
  );
};

export const SignIn: React.FC<{ isNewPlayer?: boolean }> = ({
  isNewPlayer,
}) => {
  const { authService } = useContext(Context);
  const [page, setPage] = useState<"home" | "other">("home");
  const { t } = useAppTranslation();

  const connectToMetaMask = () => {
    authService.send("CONNECT_TO_WALLET", {
      chosenProvider: Web3SupportedProviders.METAMASK,
    });
  };

  const handleBack = () => {
    if (page === "other") {
      setPage("home");
    } else {
      authService.send("BACK");
    }
  };

  const MainWallets = () => {
    if (isNewPlayer && !window.ethereum) {
      return (
        <>
          <Button
            className="mb-2 py-2 text-sm relative"
            onClick={() =>
              authService.send("CONNECT_TO_WALLET", {
                chosenProvider: Web3SupportedProviders.SEQUENCE,
              })
            }
          >
            <div className="px-8">
              <img
                src="https://sequence.app/static/images/sequence-logo.7c854742a6b8b4969004.svg"
                className="w-7 h-7 mobile:w-6 mobile:h-6  ml-2 mr-6 absolute left-0 top-1"
              />
              Email & Social Login
            </div>
          </Button>
          <Button
            className="mb-2 py-2 text-sm relative"
            onClick={() => {
              authService.send("CONNECT_TO_WALLET", {
                chosenProvider: Web3SupportedProviders.WALLET_CONNECT,
              });
            }}
          >
            <div className="px-8">
              <img
                src={walletIcon}
                className="h-7 mobile:h-6 ml-2.5 mr-6 absolute left-0 top-1"
              />
              Connect Wallet
            </div>
          </Button>
        </>
      );
    }
    return (
      <>
        <Button
          className="mb-2 py-2 text-sm relative"
          onClick={() =>
            authService.send("CONNECT_TO_WALLET", {
              chosenProvider: Web3SupportedProviders.SEQUENCE,
            })
          }
        >
          <div className="px-8">
            <img
              src="https://sequence.app/static/images/sequence-logo.7c854742a6b8b4969004.svg"
              className="w-7 h-7 mobile:w-6 mobile:h-6  ml-2 mr-6 absolute left-0 top-1"
            />
            {t("welcome.email")}
          </div>
        </Button>
        <Button
          className="mb-2 py-2 text-sm relative justify-start"
          onClick={connectToMetaMask}
        >
          <div className="px-8 mr-2 flex ">
            <img
              src={metamaskIcon}
              className="h-7 mobile:h-6 ml-2.5 mr-6 absolute left-0 top-1"
            />
            Metamask
          </div>
        </Button>
        <Button
          className="mb-2 py-2 text-sm relative"
          onClick={() => setPage("other")}
        >
          <div className="px-8">
            <img
              src={walletIcon}
              className="h-7 mobile:h-6 ml-2.5 mr-6 absolute left-0 top-1"
            />
            {t("welcome.otherWallets")}
          </div>
        </Button>
      </>
    );
  };

  const isCryptoCom = getPromoCode() === "crypto-com";
  const isEarnAlliance = getPromoCode() === "EARN";
  const isBitget = getPromoCode() === "BITGET";

  return (
    <div className="px-2">
      <div className="flex items-center mb-2">
        <img
          src={SUNNYSIDE.icons.arrow_left}
          className="cursor-pointer mr-2"
          onClick={handleBack}
          style={{
            width: `${PIXEL_SCALE * 8}px`,
          }}
        />
        {!hasFeatureAccess(TEST_FARM, "NEW_FARM_FLOW") && (
          <div className="flex items-center">
            <img src={SUNNYSIDE.ui.green_bar_4} className="h-5 mr-2" />
            <span className="text-xs">{t("onboarding.step.two")}</span>
          </div>
        )}
      </div>

      {isBitget && (
        <Button
          className="mb-2 py-2 text-sm relative"
          onClick={() =>
            authService.send("CONNECT_TO_WALLET", {
              chosenProvider: Web3SupportedProviders.BITGET,
            })
          }
        >
          <div className="px-8">
            <img
              src={bitgetIcon}
              alt="Bitget"
              className="h-7 mobile:h-6 ml-2.5 mr-6 absolute left-0 top-1 rounded-sm"
            />
            <Label
              type="info"
              className="absolute top-1/2 -translate-y-1/2 right-1"
            >
              {t("featured")}
            </Label>
            Bitget {t("wallet")}
          </div>
        </Button>
      )}

      {isCryptoCom && (
        <Button
          className="mb-2 py-2 text-sm relative"
          onClick={() =>
            authService.send("CONNECT_TO_WALLET", {
              chosenProvider: Web3SupportedProviders.CRYPTO_COM,
            })
          }
        ></Button>
      )}

      {isEarnAlliance && (
        <Button
          className="mb-2 py-2 text-sm relative justify-start"
          onClick={connectToMetaMask}
        >
          <div className="px-8 mr-2 flex ">
            <img
              src={metamaskIcon}
              className="h-7 mobile:h-6 ml-2.5 mr-6 absolute left-0 top-1"
            />
            Metamask
          </div>
        </Button>
      )}

      {!isCryptoCom && !isEarnAlliance && !isBitget && (
        <>
          {page === "home" && <MainWallets />}
          {page === "other" && <OtherWallets />}
        </>
      )}

      <div className="flex justify-between my-1">
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
          className="underline text-white text-xs"
        >
          {t("welcome.needHelp")}
        </a>
      </div>
    </div>
  );
};

export const SignUp = () => {
  const [showPromoCode, setShowPromoCode] = useState(false);
  const [promoCode, setPromoCode] = useState(getPromoCode());
  const { t } = useAppTranslation();
  if (showPromoCode) {
    return (
      <>
        <div className="p-2">
          <p className="text-xs mb-1">Enter your promo code:</p>
          <input
            style={{
              boxShadow: "#b96e50 0px 1px 1px 1px inset",
              border: "2px solid #ead4aa",
            }}
            type="text"
            min={1}
            value={promoCode}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setPromoCode(e.target.value);
            }}
            className={
              "text-shadow mr-2 rounded-sm shadow-inner shadow-black bg-brown-200 w-full p-2 h-10"
            }
          />
        </div>
        <div className="flex space-x-1">
          <Button
            onClick={() => {
              setShowPromoCode(false);
            }}
          >
            {t("back")}
          </Button>
          <Button
            disabled={!promoCode}
            onClick={() => {
              setShowPromoCode(false);
              savePromoCode(promoCode as string);
            }}
          >
            {t("ok")}
          </Button>
        </div>
      </>
    );
  }
  return (
    <>
      {promoCode && (
        <div className="absolute top-3 right-5">
          <Label type="formula" icon={SUNNYSIDE.icons.search}>
            {`Promo Code: ${getPromoCode()}`}
          </Label>
        </div>
      )}
      {!promoCode && (
        <div className="absolute top-3 right-5 flex items-center">
          <Button onClick={() => setShowPromoCode(true)} className="h-6">
            <div className="flex">
              <span className="text-xxs">Add Promo Code</span>
            </div>
          </Button>
          <img src={SUNNYSIDE.icons.expression_confused} className="h-4 ml-1" />
        </div>
      )}

      <SignIn isNewPlayer />
    </>
  );
};
