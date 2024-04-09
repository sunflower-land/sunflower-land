import React, { useContext, useState } from "react";

import { Button } from "components/ui/Button";
import { Context } from "../lib/Provider";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";

import metamaskIcon from "src/assets/icons/metamask_pixel.png";
import walletIcon from "src/assets/icons/wallet.png";
import phantomIcon from "src/assets/icons/phantom.svg";
import okxIcon from "src/assets/icons/okx.svg";
import cryptoComIcon from "src/assets/icons/crypto-com-logo.svg";
import bitgetIcon from "src/assets/icons/bitget_logo.svg";
import googleIcon from "src/assets/icons/sign_in_with_google.svg";
import wechatIcon from "src/assets/icons/wechat.png";

import { Label } from "components/ui/Label";
import { Web3SupportedProviders } from "lib/web3SupportedProviders";
import { getPromoCode } from "features/game/actions/loadSession";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CONFIG } from "lib/config";
import { Wallet } from "features/wallet/Wallet";
import { useActor } from "@xstate/react";
import { WalletContext } from "features/wallet/WalletProvider";
import { pixelGrayBorderStyle } from "features/game/lib/style";
import { useIsPWA } from "lib/utils/hooks/useIsPWA";
import { isMobile } from "mobile-device-detect";

const CONTENT_HEIGHT = 300;

export const SEQUENCE_ICON =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMzk2JyBoZWlnaHQ9JzMxOCcgdmlld0JveD0nMCAwIDM5NiAzMTgnIGZpbGw9J25vbmUnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PGcgY2xpcC1wYXRoPSd1cmwoI2NsaXAwXzVfMTMxKSc+PGcgY2xpcC1wYXRoPSd1cmwoI2NsaXAxXzVfMTMxKSc+PHBhdGggZD0nTTAgNjcuNTA0OUwwIDI1MC4xNjVDMCAyODcuNDQ3IDMwLjE0MDIgMzE3LjY3IDY3LjMyIDMxNy42N0gzMjguNjhDMzY1Ljg2IDMxNy42NyAzOTYgMjg3LjQ0NyAzOTYgMjUwLjE2NVY2Ny41MDQ5QzM5NiAzMC4yMjMgMzY1Ljg2IDAgMzI4LjY4IDBINjcuMzJDMzAuMTQwMiAwIDAgMzAuMjIzIDAgNjcuNTA0OVonIGZpbGw9JyMxMTExMTEnLz48cGF0aCBkPSdNMCA2Ny41MDQ5TDAgMjUwLjE2NUMwIDI4Ny40NDcgMzAuMTQwMiAzMTcuNjcgNjcuMzIgMzE3LjY3SDMyOC42OEMzNjUuODYgMzE3LjY3IDM5NiAyODcuNDQ3IDM5NiAyNTAuMTY1VjY3LjUwNDlDMzk2IDMwLjIyMyAzNjUuODYgMCAzMjguNjggMEg2Ny4zMkMzMC4xNDAyIDAgMCAzMC4yMjMgMCA2Ny41MDQ5WicgZmlsbD0ndXJsKCNwYWludDBfbGluZWFyXzVfMTMxKScvPjxwYXRoIGQ9J005OC45OTk5IDc5LjQxNzZDOTguOTk5OSA2OC40NTIzIDkwLjEzNTEgNTkuNTYzMiA3OS4xOTk5IDU5LjU2MzJDNjguMjY0NyA1OS41NjMyIDU5LjM5OTkgNjguNDUyMyA1OS4zOTk5IDc5LjQxNzZDNTkuMzk5OSA5MC4zODI4IDY4LjI2NDcgOTkuMjcyIDc5LjE5OTkgOTkuMjcyQzkwLjEzNTEgOTkuMjcyIDk4Ljk5OTkgOTAuMzgyOCA5OC45OTk5IDc5LjQxNzZaJyBmaWxsPSd1cmwoI3BhaW50MV9saW5lYXJfNV8xMzEpJy8+PHBhdGggZD0nTTk4Ljk5OTkgNzkuNDE3NkM5OC45OTk5IDY4LjQ1MjMgOTAuMTM1MSA1OS41NjMyIDc5LjE5OTkgNTkuNTYzMkM2OC4yNjQ3IDU5LjU2MzIgNTkuMzk5OSA2OC40NTIzIDU5LjM5OTkgNzkuNDE3NkM1OS4zOTk5IDkwLjM4MjggNjguMjY0NyA5OS4yNzIgNzkuMTk5OSA5OS4yNzJDOTAuMTM1MSA5OS4yNzIgOTguOTk5OSA5MC4zODI4IDk4Ljk5OTkgNzkuNDE3NlonIGZpbGw9J3VybCgjcGFpbnQyX2xpbmVhcl81XzEzMSknLz48cGF0aCBkPSdNOTguOTk5OSA3OS40MTc2Qzk4Ljk5OTkgNjguNDUyMyA5MC4xMzUxIDU5LjU2MzIgNzkuMTk5OSA1OS41NjMyQzY4LjI2NDcgNTkuNTYzMiA1OS4zOTk5IDY4LjQ1MjMgNTkuMzk5OSA3OS40MTc2QzU5LjM5OTkgOTAuMzgyOCA2OC4yNjQ3IDk5LjI3MiA3OS4xOTk5IDk5LjI3MkM5MC4xMzUxIDk5LjI3MiA5OC45OTk5IDkwLjM4MjggOTguOTk5OSA3OS40MTc2WicgZmlsbD0ndXJsKCNwYWludDNfbGluZWFyXzVfMTMxKScvPjxwYXRoIGQ9J005OC45OTk5IDIzOC4xMjZDOTguOTk5OSAyMjcuMTYxIDkwLjEzNTEgMjE4LjI3MiA3OS4xOTk5IDIxOC4yNzJDNjguMjY0NyAyMTguMjcyIDU5LjM5OTkgMjI3LjE2MSA1OS4zOTk5IDIzOC4xMjZDNTkuMzk5OSAyNDkuMDkyIDY4LjI2NDcgMjU3Ljk4MSA3OS4xOTk5IDI1Ny45ODFDOTAuMTM1MSAyNTcuOTgxIDk4Ljk5OTkgMjQ5LjA5MiA5OC45OTk5IDIzOC4xMjZaJyBmaWxsPSd1cmwoI3BhaW50NF9saW5lYXJfNV8xMzEpJy8+PHBhdGggZD0nTTMzNi42IDE1OC44MzVDMzM2LjYgMTQ3Ljg3IDMyNy43MzUgMTM4Ljk4MSAzMTYuOCAxMzguOTgxQzMwNS44NjUgMTM4Ljk4MSAyOTcgMTQ3Ljg3IDI5NyAxNTguODM1QzI5NyAxNjkuOCAzMDUuODY1IDE3OC42OSAzMTYuOCAxNzguNjlDMzI3LjczNSAxNzguNjkgMzM2LjYgMTY5LjggMzM2LjYgMTU4LjgzNVonIGZpbGw9J3VybCgjcGFpbnQ1X2xpbmVhcl81XzEzMSknLz48cGF0aCBkPSdNMzM2LjYgMTU4LjgzNUMzMzYuNiAxNDcuODcgMzI3LjczNSAxMzguOTgxIDMxNi44IDEzOC45ODFDMzA1Ljg2NSAxMzguOTgxIDI5NyAxNDcuODcgMjk3IDE1OC44MzVDMjk3IDE2OS44IDMwNS44NjUgMTc4LjY5IDMxNi44IDE3OC42OUMzMjcuNzM1IDE3OC42OSAzMzYuNiAxNjkuOCAzMzYuNiAxNTguODM1WicgZmlsbD0ndXJsKCNwYWludDZfbGluZWFyXzVfMTMxKScvPjxwYXRoIGQ9J00zMTYuOCA1OS41NjMySDE1OC40QzE0Ny40NjUgNTkuNTYzMiAxMzguNiA2OC40NTIzIDEzOC42IDc5LjQxNzZDMTM4LjYgOTAuMzgyOCAxNDcuNDY1IDk5LjI3MiAxNTguNCA5OS4yNzJIMzE2LjhDMzI3LjczNSA5OS4yNzIgMzM2LjYgOTAuMzgyOCAzMzYuNiA3OS40MTc2QzMzNi42IDY4LjQ1MjMgMzI3LjczNSA1OS41NjMyIDMxNi44IDU5LjU2MzJaJyBmaWxsPSd1cmwoI3BhaW50N19saW5lYXJfNV8xMzEpJy8+PHBhdGggZD0nTTMxNi44IDIxOC4yNzJIMTU4LjRDMTQ3LjQ2NSAyMTguMjcyIDEzOC42IDIyNy4xNjEgMTM4LjYgMjM4LjEyNkMxMzguNiAyNDkuMDkyIDE0Ny40NjUgMjU3Ljk4MSAxNTguNCAyNTcuOTgxSDMxNi44QzMyNy43MzUgMjU3Ljk4MSAzMzYuNiAyNDkuMDkyIDMzNi42IDIzOC4xMjZDMzM2LjYgMjI3LjE2MSAzMjcuNzM1IDIxOC4yNzIgMzE2LjggMjE4LjI3MlonIGZpbGw9J3VybCgjcGFpbnQ4X2xpbmVhcl81XzEzMSknLz48cGF0aCBkPSdNMjM3LjYgMTM4Ljk4MUg3OS4yQzY4LjI2NDggMTM4Ljk4MSA1OS40IDE0Ny44NyA1OS40IDE1OC44MzVDNTkuNCAxNjkuOCA2OC4yNjQ4IDE3OC42OSA3OS4yIDE3OC42OUgyMzcuNkMyNDguNTM1IDE3OC42OSAyNTcuNCAxNjkuOCAyNTcuNCAxNTguODM1QzI1Ny40IDE0Ny44NyAyNDguNTM1IDEzOC45ODEgMjM3LjYgMTM4Ljk4MVonIGZpbGw9J3VybCgjcGFpbnQ5X2xpbmVhcl81XzEzMSknLz48L2c+PC9nPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0ncGFpbnQwX2xpbmVhcl81XzEzMScgeDE9JzE5OCcgeTE9JzQuMDU4NTRlLTA1JyB4Mj0nMTk4JyB5Mj0nMzE4JyBncmFkaWVudFVuaXRzPSd1c2VyU3BhY2VPblVzZSc+PHN0b3Agc3RvcC1jb2xvcj0nIzFEMjczRCcvPjxzdG9wIG9mZnNldD0nMScgc3RvcC1jb2xvcj0nIzBEMEYxMycvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSdwYWludDFfbGluZWFyXzVfMTMxJyB4MT0nNjUuNScgeTE9Jzk5JyB4Mj0nOTIuNScgeTI9JzYzJyBncmFkaWVudFVuaXRzPSd1c2VyU3BhY2VPblVzZSc+PHN0b3Agc3RvcC1jb2xvcj0nIzQ0NjJGRScvPjxzdG9wIG9mZnNldD0nMScgc3RvcC1jb2xvcj0nIzdENjlGQScvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSdwYWludDJfbGluZWFyXzVfMTMxJyB4MT0nNjIuODc5OScgeTE9Jzk5LjI5MTInIHgyPSc5Ni4xMzc3JyB5Mj0nOTcuNTkxMScgZ3JhZGllbnRVbml0cz0ndXNlclNwYWNlT25Vc2UnPjxzdG9wIHN0b3AtY29sb3I9JyMzNzU3RkQnLz48c3RvcCBvZmZzZXQ9JzEnIHN0b3AtY29sb3I9JyM2OTgwRkEnLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0ncGFpbnQzX2xpbmVhcl81XzEzMScgeDE9JzYyLjg3OTknIHkxPSc5OS4yOTEyJyB4Mj0nOTYuMTM3NycgeTI9Jzk3LjU5MTEnIGdyYWRpZW50VW5pdHM9J3VzZXJTcGFjZU9uVXNlJz48c3RvcCBzdG9wLWNvbG9yPScjMjQ0N0ZGJy8+PHN0b3Agb2Zmc2V0PScxJyBzdG9wLWNvbG9yPScjNjk4MEZBJy8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9J3BhaW50NF9saW5lYXJfNV8xMzEnIHgxPSc2NScgeTE9JzI1MS41JyB4Mj0nOTEuNScgeTI9JzIyMy41JyBncmFkaWVudFVuaXRzPSd1c2VyU3BhY2VPblVzZSc+PHN0b3Agc3RvcC1jb2xvcj0nI0JDM0VFNicvPjxzdG9wIG9mZnNldD0nMScgc3RvcC1jb2xvcj0nI0Q5NzJGMScvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSdwYWludDVfbGluZWFyXzVfMTMxJyB4MT0nMzA1JyB5MT0nMTcyJyB4Mj0nMzI5LjUnIHkyPScxNDYnIGdyYWRpZW50VW5pdHM9J3VzZXJTcGFjZU9uVXNlJz48c3RvcCBzdG9wLWNvbG9yPScjMjlCREZGJy8+PHN0b3Agb2Zmc2V0PScxJyBzdG9wLWNvbG9yPScjOTZFN0ZCJy8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9J3BhaW50Nl9saW5lYXJfNV8xMzEnIHgxPSczMDAuMTgnIHkxPScxNzguNDE4JyB4Mj0nMzM0LjU2NycgeTI9JzE3Ni43NzInIGdyYWRpZW50VW5pdHM9J3VzZXJTcGFjZU9uVXNlJz48c3RvcCBzdG9wLWNvbG9yPScjMjNCQkZGJy8+PHN0b3Agb2Zmc2V0PScxJyBzdG9wLWNvbG9yPScjODVFN0ZGJy8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9J3BhaW50N19saW5lYXJfNV8xMzEnIHgxPScxNTQuNScgeTE9Jzk5JyB4Mj0nMzE3LjUnIHkyPSc2MCcgZ3JhZGllbnRVbml0cz0ndXNlclNwYWNlT25Vc2UnPjxzdG9wIHN0b3AtY29sb3I9JyMyM0JCRkYnLz48c3RvcCBvZmZzZXQ9JzEnIHN0b3AtY29sb3I9JyM4NUU3RkYnLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0ncGFpbnQ4X2xpbmVhcl81XzEzMScgeDE9JzE1NicgeTE9JzI1OCcgeDI9JzMxMi41JyB5Mj0nMjE4JyBncmFkaWVudFVuaXRzPSd1c2VyU3BhY2VPblVzZSc+PHN0b3Agc3RvcC1jb2xvcj0nIzI0NDdGRicvPjxzdG9wIG9mZnNldD0nMScgc3RvcC1jb2xvcj0nIzY5ODBGQScvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSdwYWludDlfbGluZWFyXzVfMTMxJyB4MT0nODYuMDAwMScgeTE9JzE3OScgeDI9JzIzNS41JyB5Mj0nMTM5JyBncmFkaWVudFVuaXRzPSd1c2VyU3BhY2VPblVzZSc+PHN0b3Agc3RvcC1jb2xvcj0nIzY2MzRGRicvPjxzdG9wIG9mZnNldD0nMScgc3RvcC1jb2xvcj0nIzlDNkRGRicvPjwvbGluZWFyR3JhZGllbnQ+PGNsaXBQYXRoIGlkPSdjbGlwMF81XzEzMSc+PHJlY3Qgd2lkdGg9JzM5NicgaGVpZ2h0PSczMTcuNjcnIGZpbGw9J3doaXRlJy8+PC9jbGlwUGF0aD48Y2xpcFBhdGggaWQ9J2NsaXAxXzVfMTMxJz48cmVjdCB3aWR0aD0nMzk2JyBoZWlnaHQ9JzMxNy42NycgZmlsbD0nd2hpdGUnLz48L2NsaXBQYXRoPjwvZGVmcz48L3N2Zz4K";

const OtherWallets: React.FC<{
  onConnect: (provider: Web3SupportedProviders) => void;
  showSequence?: boolean;
}> = ({ onConnect, showSequence = false }) => {
  const { t } = useAppTranslation();

  return (
    <>
      <>
        {showSequence && (
          <Button
            className="mb-2 py-2 text-sm relative"
            onClick={() => {
              onConnect(Web3SupportedProviders.SEQUENCE);
            }}
          >
            <div className="px-8">
              <img
                src={SEQUENCE_ICON}
                className="w-7 h-7 mobile:w-6 mobile:h-6  ml-2 mr-6 absolute left-0 top-1"
              />
              {"Sequence"}
            </div>
          </Button>
        )}
        <Button
          className="mb-2 py-2 text-sm relative"
          onClick={() => onConnect(Web3SupportedProviders.WALLET_CONNECT)}
        >
          <div className="px-8">
            <svg
              height="25"
              viewBox="0 0 40 25"
              width="40"
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7   ml-2 mr-6 absolute left-0 top-1"
            >
              <path
                d="m8.19180572 4.83416816c6.52149658-6.38508884 17.09493158-6.38508884 23.61642788 0l.7848727.76845565c.3260748.31925442.3260748.83686816 0 1.15612272l-2.6848927 2.62873374c-.1630375.15962734-.4273733.15962734-.5904108 0l-1.0800779-1.05748639c-4.5495589-4.45439756-11.9258514-4.45439756-16.4754105 0l-1.1566741 1.13248068c-.1630376.15962721-.4273735.15962721-.5904108 0l-2.68489263-2.62873375c-.32607483-.31925456-.32607483-.83686829 0-1.15612272zm29.16903948 5.43649934 2.3895596 2.3395862c.3260732.319253.3260751.8368636.0000041 1.1561187l-10.7746894 10.5494845c-.3260726.3192568-.8547443.3192604-1.1808214.0000083-.0000013-.0000013-.0000029-.0000029-.0000042-.0000043l-7.6472191-7.4872762c-.0815187-.0798136-.2136867-.0798136-.2952053 0-.0000006.0000005-.000001.000001-.0000015.0000014l-7.6470562 7.4872708c-.3260715.3192576-.8547434.319263-1.1808215.0000116-.0000019-.0000018-.0000039-.0000037-.0000059-.0000058l-10.7749893-10.5496247c-.32607469-.3192544-.32607469-.8368682 0-1.1561226l2.38956395-2.3395823c.3260747-.31925446.85474652-.31925446 1.18082136 0l7.64733029 7.4873809c.0815188.0798136.2136866.0798136.2952054 0 .0000012-.0000012.0000023-.0000023.0000035-.0000032l7.6469471-7.4873777c.3260673-.31926181.8547392-.31927378 1.1808214-.0000267.0000046.0000045.0000091.000009.0000135.0000135l7.6473203 7.4873909c.0815186.0798135.2136866.0798135.2952053 0l7.6471967-7.4872433c.3260748-.31925458.8547465-.31925458 1.1808213 0z"
                fill="currentColor"
              ></path>
            </svg>
            {"Wallet Connect"}
          </div>
        </Button>

        <Button
          className="mb-2 py-2 text-sm relative"
          onClick={() => onConnect(Web3SupportedProviders.BITGET)}
        >
          <div className="px-8">
            <img
              src={bitgetIcon}
              alt="Bitget"
              className="h-7 ml-2.5 mr-6 absolute left-0 top-1 rounded-sm"
            />
            <Label
              type="info"
              className="absolute top-1/2 -translate-y-1/2 right-1"
            >
              {t("featured")}
            </Label>
            {"Bitget Wallet"}
          </div>
        </Button>
        <Button
          className="mb-2 py-2 text-sm relative"
          onClick={() => onConnect(Web3SupportedProviders.CRYPTO_COM)}
        >
          <div className="px-8">
            <img
              src={cryptoComIcon}
              alt="Crypto.com"
              className="h-7 ml-2.5 mr-6 absolute left-0 top-1 rounded-sm"
            />
            {"Crypto.com Wallet"}
          </div>
        </Button>
        <Button
          className="mb-2 py-2 text-sm relative"
          onClick={() => onConnect(Web3SupportedProviders.OKX)}
        >
          <div className="px-8">
            <img
              src={okxIcon}
              alt="OKX"
              className="h-7 ml-2.5 mr-6 absolute left-0 top-1 rounded-sm"
            />
            {"OKX Wallet"}
          </div>
        </Button>
        <Button
          className="mb-2 py-2 text-sm relative"
          onClick={() => onConnect(Web3SupportedProviders.PHANTOM)}
        >
          <div className="px-8">
            <img
              src={phantomIcon}
              alt="Phantom"
              className="h-7 ml-2.5 mr-6 absolute left-0 top-1"
            />
            {"Phantom Wallet"}
          </div>
        </Button>
      </>
    </>
  );
};

interface Props {
  onConnect: (provider: Web3SupportedProviders) => void;
  showAll?: boolean;
}

export const Wallets: React.FC<Props> = ({ onConnect, showAll = true }) => {
  const [page, setPage] = useState<"home" | "other">("home");
  const isPWA = useIsPWA();
  const isMobilePWA = isMobile && isPWA;
  const { t } = useAppTranslation();

  const connectToMetaMask = () => {
    onConnect(Web3SupportedProviders.METAMASK);
  };

  const MainWallets = () => {
    return (
      <>
        <Button
          className="mb-2 py-2 text-sm relative justify-start"
          onClick={connectToMetaMask}
        >
          <div className="px-8 mr-2 flex ">
            <img
              src={metamaskIcon}
              className="h-7 ml-2.5 mr-6 absolute left-0 top-1"
            />
            {"Metamask"}
          </div>
        </Button>
        {showAll && (
          <Button
            className="mb-2 py-2 text-sm relative"
            onClick={() => {
              onConnect(Web3SupportedProviders.SEQUENCE);
            }}
          >
            <div className="px-8">
              <img
                src={SEQUENCE_ICON}
                className="w-7 h-7 mobile:w-6 mobile:h-6  ml-2 mr-6 absolute left-0 top-1"
              />
              {"Sequence"}
            </div>
          </Button>
        )}

        {page === "home" && (
          <Button
            className="mb-2 py-2 text-sm relative"
            onClick={() => setPage("other")}
          >
            <div className="px-8">
              <img
                src={walletIcon}
                className="h-7 ml-2.5 mr-6 absolute left-0 top-1"
              />
              {t("welcome.otherWallets")}
            </div>
          </Button>
        )}
      </>
    );
  };

  const PWAWallets = () => {
    return (
      <>
        <Button
          className="mb-2 py-2 text-sm relative"
          onClick={() => {
            onConnect(Web3SupportedProviders.SEQUENCE);
          }}
        >
          <div className="px-8">
            <img
              src={SEQUENCE_ICON}
              className="w-7 h-7 mobile:w-6 mobile:h-6  ml-2 mr-6 absolute left-0 top-1"
            />
            {`Sequence`}
          </div>
        </Button>
        <Button
          className="mb-2 py-2 text-sm relative"
          onClick={() => onConnect(Web3SupportedProviders.WALLET_CONNECT)}
        >
          <div className="px-8">
            <svg
              height="25"
              viewBox="0 0 40 25"
              width="40"
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7   ml-2 mr-6 absolute left-0 top-1"
            >
              <path
                d="m8.19180572 4.83416816c6.52149658-6.38508884 17.09493158-6.38508884 23.61642788 0l.7848727.76845565c.3260748.31925442.3260748.83686816 0 1.15612272l-2.6848927 2.62873374c-.1630375.15962734-.4273733.15962734-.5904108 0l-1.0800779-1.05748639c-4.5495589-4.45439756-11.9258514-4.45439756-16.4754105 0l-1.1566741 1.13248068c-.1630376.15962721-.4273735.15962721-.5904108 0l-2.68489263-2.62873375c-.32607483-.31925456-.32607483-.83686829 0-1.15612272zm29.16903948 5.43649934 2.3895596 2.3395862c.3260732.319253.3260751.8368636.0000041 1.1561187l-10.7746894 10.5494845c-.3260726.3192568-.8547443.3192604-1.1808214.0000083-.0000013-.0000013-.0000029-.0000029-.0000042-.0000043l-7.6472191-7.4872762c-.0815187-.0798136-.2136867-.0798136-.2952053 0-.0000006.0000005-.000001.000001-.0000015.0000014l-7.6470562 7.4872708c-.3260715.3192576-.8547434.319263-1.1808215.0000116-.0000019-.0000018-.0000039-.0000037-.0000059-.0000058l-10.7749893-10.5496247c-.32607469-.3192544-.32607469-.8368682 0-1.1561226l2.38956395-2.3395823c.3260747-.31925446.85474652-.31925446 1.18082136 0l7.64733029 7.4873809c.0815188.0798136.2136866.0798136.2952054 0 .0000012-.0000012.0000023-.0000023.0000035-.0000032l7.6469471-7.4873777c.3260673-.31926181.8547392-.31927378 1.1808214-.0000267.0000046.0000045.0000091.000009.0000135.0000135l7.6473203 7.4873909c.0815186.0798135.2136866.0798135.2952053 0l7.6471967-7.4872433c.3260748-.31925458.8547465-.31925458 1.1808213 0z"
                fill="currentColor"
              ></path>
            </svg>
            {`Wallets`}
          </div>
        </Button>
      </>
    );
  };

  if (isMobilePWA) {
    return <PWAWallets />;
  }

  const isCryptoCom = getPromoCode() === "crypto-com";
  const isEarnAlliance = getPromoCode() === "EARN";
  const isBitget = getPromoCode() === "BITGET";

  return (
    <>
      {isBitget && (
        <Button
          className="mb-2 py-2 text-sm relative"
          onClick={() => onConnect(Web3SupportedProviders.BITGET)}
        >
          <div className="px-8">
            <img
              src={bitgetIcon}
              alt="Bitget"
              className="h-7 ml-2.5 mr-6 absolute left-0 top-1 rounded-sm"
            />
            <Label
              type="info"
              className="absolute top-1/2 -translate-y-1/2 right-1"
            >
              {t("featured")}
            </Label>
            {"Bitget Wallet"}
          </div>
        </Button>
      )}

      {isCryptoCom && (
        <Button
          className="mb-2 py-2 text-sm relative"
          onClick={() => onConnect(Web3SupportedProviders.CRYPTO_COM)}
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
              className="h-7 ml-2.5 mr-6 absolute left-0 top-1"
            />
            {"Metamask"}
          </div>
        </Button>
      )}

      {!isCryptoCom && !isEarnAlliance && !isBitget && (
        <>
          {page === "home" && <MainWallets />}
          {page === "other" && (
            <>
              <MainWallets />
              <OtherWallets showSequence={!showAll} onConnect={onConnect} />
            </>
          )}
        </>
      )}
    </>
  );
};

export const SignIn = () => {
  const { authService } = useContext(Context);
  const { walletService } = useContext(WalletContext);

  const [walletState] = useActor(walletService);
  const [showLoading, setShowLoading] = useState(false);
  const { t } = useAppTranslation();

  if (showLoading) {
    return (
      <div className="">
        <p className="text-sm loading">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div
      className="px-2 overflow-y-auto   scrollable"
      style={{ maxHeight: CONTENT_HEIGHT }}
    >
      {walletState.matches("chooseWallet") && (
        <>
          <div className="flex items-center mb-2">
            <img
              src={SUNNYSIDE.icons.arrow_left}
              className="cursor-pointer mr-2"
              onClick={() => authService.send("BACK")}
              style={{
                width: `${PIXEL_SCALE * 8}px`,
              }}
            />
          </div>
          <button
            className="w-full p-1 object-contain justify-center items-center cursor-pointer flex mb-2 text-sm relative h-[46px] bg-[#F2F2F2]"
            type="button"
            style={pixelGrayBorderStyle}
            onClick={() => {
              setShowLoading(true);
              window.location.href = `${CONFIG.API_URL}/auth/google/authorize`;
            }}
          >
            <img src={googleIcon} />
          </button>
          {!isMobile && (
            <Button
              className="mb-2 py-2 text-sm relative"
              onClick={() => {
                setShowLoading(true);
                window.location.href = `${CONFIG.API_URL}/auth/wechat/authorize`;
              }}
            >
              <img
                src={wechatIcon}
                className="w-7 h-7 mobile:w-6 mobile:h-6  ml-2 mr-6 absolute left-0 top-1"
              />
              {"Wechat"}
            </Button>
          )}
        </>
      )}

      <Wallet
        action="login"
        id={0}
        onReady={(payload) => {
          authService.send("CONNECTED", {
            address: payload.address,
            signature: payload.signature,
          });
        }}
      />

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

export const SignUp = () => <SignIn />;
