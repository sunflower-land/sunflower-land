import React, { useContext, useEffect, useState } from "react";

import { Button } from "components/ui/Button";
import { Context } from "../lib/Provider";
import { SUNNYSIDE } from "assets/sunnyside";
import metamaskIcon from "assets/icons/metamask_pixel.png";
import walletIcon from "assets/icons/wallet.png";
import fslIcon from "assets/icons/fsl_black.svg";
import { PIXEL_SCALE } from "features/game/lib/constants";

import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CONFIG } from "lib/config";
import { Wallet } from "features/wallet/Wallet";

import { useIsPWA } from "lib/utils/hooks/useIsPWA";
import { isMobile } from "mobile-device-detect";
import { Loading } from "./Loading";
import { Connector, CreateConnectorFn } from "@wagmi/core";
import {
  WalletContext,
  coinbaseConnector,
  fallbackConnector,
  metaMaskConnector,
  sequenceConnector,
  walletConnectConnector,
  waypointConnector,
} from "features/wallet/WalletProvider";
import { useActor } from "@xstate/react";
import { useConnect } from "wagmi";
import { fslAuthorization } from "../actions/oauth";

const CONTENT_HEIGHT = 365;

export const SEQUENCE_ICON =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMzk2JyBoZWlnaHQ9JzMxOCcgdmlld0JveD0nMCAwIDM5NiAzMTgnIGZpbGw9J25vbmUnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PGcgY2xpcC1wYXRoPSd1cmwoI2NsaXAwXzVfMTMxKSc+PGcgY2xpcC1wYXRoPSd1cmwoI2NsaXAxXzVfMTMxKSc+PHBhdGggZD0nTTAgNjcuNTA0OUwwIDI1MC4xNjVDMCAyODcuNDQ3IDMwLjE0MDIgMzE3LjY3IDY3LjMyIDMxNy42N0gzMjguNjhDMzY1Ljg2IDMxNy42NyAzOTYgMjg3LjQ0NyAzOTYgMjUwLjE2NVY2Ny41MDQ5QzM5NiAzMC4yMjMgMzY1Ljg2IDAgMzI4LjY4IDBINjcuMzJDMzAuMTQwMiAwIDAgMzAuMjIzIDAgNjcuNTA0OVonIGZpbGw9JyMxMTExMTEnLz48cGF0aCBkPSdNMCA2Ny41MDQ5TDAgMjUwLjE2NUMwIDI4Ny40NDcgMzAuMTQwMiAzMTcuNjcgNjcuMzIgMzE3LjY3SDMyOC42OEMzNjUuODYgMzE3LjY3IDM5NiAyODcuNDQ3IDM5NiAyNTAuMTY1VjY3LjUwNDlDMzk2IDMwLjIyMyAzNjUuODYgMCAzMjguNjggMEg2Ny4zMkMzMC4xNDAyIDAgMCAzMC4yMjMgMCA2Ny41MDQ5WicgZmlsbD0ndXJsKCNwYWludDBfbGluZWFyXzVfMTMxKScvPjxwYXRoIGQ9J005OC45OTk5IDc5LjQxNzZDOTguOTk5OSA2OC40NTIzIDkwLjEzNTEgNTkuNTYzMiA3OS4xOTk5IDU5LjU2MzJDNjguMjY0NyA1OS41NjMyIDU5LjM5OTkgNjguNDUyMyA1OS4zOTk5IDc5LjQxNzZDNTkuMzk5OSA5MC4zODI4IDY4LjI2NDcgOTkuMjcyIDc5LjE5OTkgOTkuMjcyQzkwLjEzNTEgOTkuMjcyIDk4Ljk5OTkgOTAuMzgyOCA5OC45OTk5IDc5LjQxNzZaJyBmaWxsPSd1cmwoI3BhaW50MV9saW5lYXJfNV8xMzEpJy8+PHBhdGggZD0nTTk4Ljk5OTkgNzkuNDE3NkM5OC45OTk5IDY4LjQ1MjMgOTAuMTM1MSA1OS41NjMyIDc5LjE5OTkgNTkuNTYzMkM2OC4yNjQ3IDU5LjU2MzIgNTkuMzk5OSA2OC40NTIzIDU5LjM5OTkgNzkuNDE3NkM1OS4zOTk5IDkwLjM4MjggNjguMjY0NyA5OS4yNzIgNzkuMTk5OSA5OS4yNzJDOTAuMTM1MSA5OS4yNzIgOTguOTk5OSA5MC4zODI4IDk4Ljk5OTkgNzkuNDE3NlonIGZpbGw9J3VybCgjcGFpbnQyX2xpbmVhcl81XzEzMSknLz48cGF0aCBkPSdNOTguOTk5OSA3OS40MTc2Qzk4Ljk5OTkgNjguNDUyMyA5MC4xMzUxIDU5LjU2MzIgNzkuMTk5OSA1OS41NjMyQzY4LjI2NDcgNTkuNTYzMiA1OS4zOTk5IDY4LjQ1MjMgNTkuMzk5OSA3OS40MTc2QzU5LjM5OTkgOTAuMzgyOCA2OC4yNjQ3IDk5LjI3MiA3OS4xOTk5IDk5LjI3MkM5MC4xMzUxIDk5LjI3MiA5OC45OTk5IDkwLjM4MjggOTguOTk5OSA3OS40MTc2WicgZmlsbD0ndXJsKCNwYWludDNfbGluZWFyXzVfMTMxKScvPjxwYXRoIGQ9J005OC45OTk5IDIzOC4xMjZDOTguOTk5OSAyMjcuMTYxIDkwLjEzNTEgMjE4LjI3MiA3OS4xOTk5IDIxOC4yNzJDNjguMjY0NyAyMTguMjcyIDU5LjM5OTkgMjI3LjE2MSA1OS4zOTk5IDIzOC4xMjZDNTkuMzk5OSAyNDkuMDkyIDY4LjI2NDcgMjU3Ljk4MSA3OS4xOTk5IDI1Ny45ODFDOTAuMTM1MSAyNTcuOTgxIDk4Ljk5OTkgMjQ5LjA5MiA5OC45OTk5IDIzOC4xMjZaJyBmaWxsPSd1cmwoI3BhaW50NF9saW5lYXJfNV8xMzEpJy8+PHBhdGggZD0nTTMzNi42IDE1OC44MzVDMzM2LjYgMTQ3Ljg3IDMyNy43MzUgMTM4Ljk4MSAzMTYuOCAxMzguOTgxQzMwNS44NjUgMTM4Ljk4MSAyOTcgMTQ3Ljg3IDI5NyAxNTguODM1QzI5NyAxNjkuOCAzMDUuODY1IDE3OC42OSAzMTYuOCAxNzguNjlDMzI3LjczNSAxNzguNjkgMzM2LjYgMTY5LjggMzM2LjYgMTU4LjgzNVonIGZpbGw9J3VybCgjcGFpbnQ1X2xpbmVhcl81XzEzMSknLz48cGF0aCBkPSdNMzM2LjYgMTU4LjgzNUMzMzYuNiAxNDcuODcgMzI3LjczNSAxMzguOTgxIDMxNi44IDEzOC45ODFDMzA1Ljg2NSAxMzguOTgxIDI5NyAxNDcuODcgMjk3IDE1OC44MzVDMjk3IDE2OS44IDMwNS44NjUgMTc4LjY5IDMxNi44IDE3OC42OUMzMjcuNzM1IDE3OC42OSAzMzYuNiAxNjkuOCAzMzYuNiAxNTguODM1WicgZmlsbD0ndXJsKCNwYWludDZfbGluZWFyXzVfMTMxKScvPjxwYXRoIGQ9J00zMTYuOCA1OS41NjMySDE1OC40QzE0Ny40NjUgNTkuNTYzMiAxMzguNiA2OC40NTIzIDEzOC42IDc5LjQxNzZDMTM4LjYgOTAuMzgyOCAxNDcuNDY1IDk5LjI3MiAxNTguNCA5OS4yNzJIMzE2LjhDMzI3LjczNSA5OS4yNzIgMzM2LjYgOTAuMzgyOCAzMzYuNiA3OS40MTc2QzMzNi42IDY4LjQ1MjMgMzI3LjczNSA1OS41NjMyIDMxNi44IDU5LjU2MzJaJyBmaWxsPSd1cmwoI3BhaW50N19saW5lYXJfNV8xMzEpJy8+PHBhdGggZD0nTTMxNi44IDIxOC4yNzJIMTU4LjRDMTQ3LjQ2NSAyMTguMjcyIDEzOC42IDIyNy4xNjEgMTM4LjYgMjM4LjEyNkMxMzguNiAyNDkuMDkyIDE0Ny40NjUgMjU3Ljk4MSAxNTguNCAyNTcuOTgxSDMxNi44QzMyNy43MzUgMjU3Ljk4MSAzMzYuNiAyNDkuMDkyIDMzNi42IDIzOC4xMjZDMzM2LjYgMjI3LjE2MSAzMjcuNzM1IDIxOC4yNzIgMzE2LjggMjE4LjI3MlonIGZpbGw9J3VybCgjcGFpbnQ4X2xpbmVhcl81XzEzMSknLz48cGF0aCBkPSdNMjM3LjYgMTM4Ljk4MUg3OS4yQzY4LjI2NDggMTM4Ljk4MSA1OS40IDE0Ny44NyA1OS40IDE1OC44MzVDNTkuNCAxNjkuOCA2OC4yNjQ4IDE3OC42OSA3OS4yIDE3OC42OUgyMzcuNkMyNDguNTM1IDE3OC42OSAyNTcuNCAxNjkuOCAyNTcuNCAxNTguODM1QzI1Ny40IDE0Ny44NyAyNDguNTM1IDEzOC45ODEgMjM3LjYgMTM4Ljk4MVonIGZpbGw9J3VybCgjcGFpbnQ5X2xpbmVhcl81XzEzMSknLz48L2c+PC9nPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0ncGFpbnQwX2xpbmVhcl81XzEzMScgeDE9JzE5OCcgeTE9JzQuMDU4NTRlLTA1JyB4Mj0nMTk4JyB5Mj0nMzE4JyBncmFkaWVudFVuaXRzPSd1c2VyU3BhY2VPblVzZSc+PHN0b3Agc3RvcC1jb2xvcj0nIzFEMjczRCcvPjxzdG9wIG9mZnNldD0nMScgc3RvcC1jb2xvcj0nIzBEMEYxMycvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSdwYWludDFfbGluZWFyXzVfMTMxJyB4MT0nNjUuNScgeTE9Jzk5JyB4Mj0nOTIuNScgeTI9JzYzJyBncmFkaWVudFVuaXRzPSd1c2VyU3BhY2VPblVzZSc+PHN0b3Agc3RvcC1jb2xvcj0nIzQ0NjJGRScvPjxzdG9wIG9mZnNldD0nMScgc3RvcC1jb2xvcj0nIzdENjlGQScvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSdwYWludDJfbGluZWFyXzVfMTMxJyB4MT0nNjIuODc5OScgeTE9Jzk5LjI5MTInIHgyPSc5Ni4xMzc3JyB5Mj0nOTcuNTkxMScgZ3JhZGllbnRVbml0cz0ndXNlclNwYWNlT25Vc2UnPjxzdG9wIHN0b3AtY29sb3I9JyMzNzU3RkQnLz48c3RvcCBvZmZzZXQ9JzEnIHN0b3AtY29sb3I9JyM2OTgwRkEnLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0ncGFpbnQzX2xpbmVhcl81XzEzMScgeDE9JzYyLjg3OTknIHkxPSc5OS4yOTEyJyB4Mj0nOTYuMTM3NycgeTI9Jzk3LjU5MTEnIGdyYWRpZW50VW5pdHM9J3VzZXJTcGFjZU9uVXNlJz48c3RvcCBzdG9wLWNvbG9yPScjMjQ0N0ZGJy8+PHN0b3Agb2Zmc2V0PScxJyBzdG9wLWNvbG9yPScjNjk4MEZBJy8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9J3BhaW50NF9saW5lYXJfNV8xMzEnIHgxPSc2NScgeTE9JzI1MS41JyB4Mj0nOTEuNScgeTI9JzIyMy41JyBncmFkaWVudFVuaXRzPSd1c2VyU3BhY2VPblVzZSc+PHN0b3Agc3RvcC1jb2xvcj0nI0JDM0VFNicvPjxzdG9wIG9mZnNldD0nMScgc3RvcC1jb2xvcj0nI0Q5NzJGMScvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSdwYWludDVfbGluZWFyXzVfMTMxJyB4MT0nMzA1JyB5MT0nMTcyJyB4Mj0nMzI5LjUnIHkyPScxNDYnIGdyYWRpZW50VW5pdHM9J3VzZXJTcGFjZU9uVXNlJz48c3RvcCBzdG9wLWNvbG9yPScjMjlCREZGJy8+PHN0b3Agb2Zmc2V0PScxJyBzdG9wLWNvbG9yPScjOTZFN0ZCJy8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9J3BhaW50Nl9saW5lYXJfNV8xMzEnIHgxPSczMDAuMTgnIHkxPScxNzguNDE4JyB4Mj0nMzM0LjU2NycgeTI9JzE3Ni43NzInIGdyYWRpZW50VW5pdHM9J3VzZXJTcGFjZU9uVXNlJz48c3RvcCBzdG9wLWNvbG9yPScjMjNCQkZGJy8+PHN0b3Agb2Zmc2V0PScxJyBzdG9wLWNvbG9yPScjODVFN0ZGJy8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9J3BhaW50N19saW5lYXJfNV8xMzEnIHgxPScxNTQuNScgeTE9Jzk5JyB4Mj0nMzE3LjUnIHkyPSc2MCcgZ3JhZGllbnRVbml0cz0ndXNlclNwYWNlT25Vc2UnPjxzdG9wIHN0b3AtY29sb3I9JyMyM0JCRkYnLz48c3RvcCBvZmZzZXQ9JzEnIHN0b3AtY29sb3I9JyM4NUU3RkYnLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0ncGFpbnQ4X2xpbmVhcl81XzEzMScgeDE9JzE1NicgeTE9JzI1OCcgeDI9JzMxMi41JyB5Mj0nMjE4JyBncmFkaWVudFVuaXRzPSd1c2VyU3BhY2VPblVzZSc+PHN0b3Agc3RvcC1jb2xvcj0nIzI0NDdGRicvPjxzdG9wIG9mZnNldD0nMScgc3RvcC1jb2xvcj0nIzY5ODBGQScvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSdwYWludDlfbGluZWFyXzVfMTMxJyB4MT0nODYuMDAwMScgeTE9JzE3OScgeDI9JzIzNS41JyB5Mj0nMTM5JyBncmFkaWVudFVuaXRzPSd1c2VyU3BhY2VPblVzZSc+PHN0b3Agc3RvcC1jb2xvcj0nIzY2MzRGRicvPjxzdG9wIG9mZnNldD0nMScgc3RvcC1jb2xvcj0nIzlDNkRGRicvPjwvbGluZWFyR3JhZGllbnQ+PGNsaXBQYXRoIGlkPSdjbGlwMF81XzEzMSc+PHJlY3Qgd2lkdGg9JzM5NicgaGVpZ2h0PSczMTcuNjcnIGZpbGw9J3doaXRlJy8+PC9jbGlwUGF0aD48Y2xpcFBhdGggaWQ9J2NsaXAxXzVfMTMxJz48cmVjdCB3aWR0aD0nMzk2JyBoZWlnaHQ9JzMxNy42NycgZmlsbD0nd2hpdGUnLz48L2NsaXBQYXRoPjwvZGVmcz48L3N2Zz4K";

const COINBASE_ICON =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTI4IDU2YzE1LjQ2NCAwIDI4LTEyLjUzNiAyOC0yOFM0My40NjQgMCAyOCAwIDAgMTIuNTM2IDAgMjhzMTIuNTM2IDI4IDI4IDI4WiIgZmlsbD0iIzFCNTNFNCIvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNyAyOGMwIDExLjU5OCA5LjQwMiAyMSAyMSAyMXMyMS05LjQwMiAyMS0yMVMzOS41OTggNyAyOCA3IDcgMTYuNDAyIDcgMjhabTE3LjIzNC02Ljc2NmEzIDMgMCAwIDAtMyAzdjcuNTMzYTMgMyAwIDAgMCAzIDNoNy41MzNhMyAzIDAgMCAwIDMtM3YtNy41MzNhMyAzIDAgMCAwLTMtM2gtNy41MzNaIiBmaWxsPSIjZmZmIi8+PC9zdmc+";

const OtherWallets: React.FC<{
  onConnect: (connector: Connector | CreateConnectorFn) => void;
  setRoninDeepLink: (isOn: boolean) => void;
}> = ({ onConnect, setRoninDeepLink }) => {
  return (
    <>
      <>
        <Button
          className="mb-1 py-2 text-sm relative"
          onClick={() => onConnect(sequenceConnector)}
        >
          <div className="px-8">
            <img
              src={SEQUENCE_ICON}
              className="w-7 h-7 mobile:w-6 mobile:h-6  ml-2 mr-6 absolute left-0 top-1"
            />
            {"Sequence"}
          </div>
        </Button>

        <Button
          className="mb-1 py-2 text-sm relative"
          onClick={() => {
            setRoninDeepLink(false);
            onConnect(walletConnectConnector);
          }}
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
      </>
    </>
  );
};

interface Props {
  onConnect: (connector: Connector | CreateConnectorFn) => void;
}

interface Page {
  page: "home" | "other" | "ronin" | "coinbase";
  setPage: (page: "home" | "other" | "ronin" | "coinbase") => void;
}

const MainWallets: React.FC<Props & Page> = ({ onConnect, setPage, page }) => {
  const { t } = useAppTranslation();

  return (
    <>
      <Button
        className="mb-1 py-2 text-sm relative justify-start"
        onClick={() => onConnect(metaMaskConnector)}
      >
        <div className="px-8 mr-2 flex ">
          <img
            src={metamaskIcon}
            className="h-7 ml-2.5 mr-6 absolute left-0 top-1"
          />
          {"Metamask"}
        </div>
      </Button>
      <Button
        className="mb-1 py-2 text-sm relative justify-start"
        onClick={() => setPage("coinbase")}
      >
        <Label
          type="info"
          className="absolute top-1/2 -translate-y-1/2 right-1"
        >
          {t("featured")}
        </Label>
        <div className="px-8 mr-2 flex ">
          <img
            src={COINBASE_ICON}
            className="h-7 ml-2.5 mr-6 absolute left-0 top-1"
          />
          {"Coinbase"}
        </div>
      </Button>
      <Button
        className="mb-1 py-2 text-sm relative justify-start"
        onClick={() => setPage("ronin")}
      >
        <div className="px-8 mr-2 flex ">
          <img
            src={SUNNYSIDE.icons.roninIcon}
            className="h-7 ml-2.5 mr-6 absolute left-0 top-1"
          />
          {"Ronin"}
        </div>
      </Button>

      {page === "home" && (
        <Button
          className="mb-1 py-2 text-sm relative"
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

const RoninWallets: React.FC<
  Props & { setRoninDeepLink: (isOn: boolean) => void }
> = ({ onConnect, setRoninDeepLink }) => {
  const { connectors } = useConnect();
  const isPWA = useIsPWA();

  const eip6963Connectors = connectors
    .filter((connector) => connector.type === "injected" && !!connector.icon)
    .filter((connector) => connector.name === "Ronin Wallet");
  return (
    <>
      {eip6963Connectors.length > 0 && (
        <Button
          className="mb-1 py-2 text-sm relative"
          onClick={() => onConnect(eip6963Connectors[0])}
        >
          <div className="px-8">
            <img
              src={SUNNYSIDE.icons.roninIcon}
              className="h-7 ml-2.5 mr-6 absolute left-0 top-1"
            />
            <span className="whitespace-nowrap">{`Ronin Browser Extension`}</span>
          </div>
        </Button>
      )}
      <Button
        className="mb-1 py-2 text-sm relative"
        onClick={() => {
          setRoninDeepLink(true);
          onConnect(walletConnectConnector);
        }}
      >
        <div className="px-8">
          <img
            src={SUNNYSIDE.icons.roninIcon}
            className="h-7 ml-2.5 mr-6 absolute left-0 top-1"
          />
          {"Ronin Mobile"}
        </div>
      </Button>
      {!isPWA && (
        <>
          <Button
            className="mb-1 py-2 text-sm relative"
            onClick={() => onConnect(waypointConnector)}
          >
            <div className="px-8">
              <img
                src={SUNNYSIDE.icons.roninIcon}
                className="h-7 ml-2.5 mr-6 absolute left-0 top-1"
              />
              {"Ronin Waypoint"}
            </div>
          </Button>
        </>
      )}
    </>
  );
};

const CoinBaseWallets: React.FC<Props> = ({ onConnect }) => {
  const { connectors } = useConnect();

  const eip6963Connectors = connectors
    .filter((connector) => connector.type === "injected" && !!connector.icon)
    .filter((connector) => connector.name === "Coinbase Wallet");

  // useEffect(() => {
  //   if (eip6963Connectors.length === 0) {
  //     onConnect(coinbaseConnector);
  //   }
  // }, []);

  return (
    <>
      {eip6963Connectors.length > 0 && (
        <Button
          className="mb-1 py-2 text-sm relative"
          onClick={() => onConnect(eip6963Connectors[0])}
        >
          <div className="px-8">
            <img
              src={eip6963Connectors[0].icon}
              className="h-7 ml-2.5 mr-6 absolute left-0 top-1"
            />
            <span className="whitespace-nowrap">{`Coinbase Wallet Extension`}</span>
          </div>
        </Button>
      )}
      <Button
        className="mb-1 py-2 text-sm relative"
        onClick={() => {
          onConnect(coinbaseConnector);
        }}
      >
        <div className="px-8">
          <img
            src={COINBASE_ICON}
            className="h-7 ml-2.5 mr-6 absolute left-0 top-1"
          />
          {"Coinbase"}
        </div>
      </Button>
    </>
  );
};

const PWAWallets: React.FC<
  Props & { setRoninDeepLink: (isOn: boolean) => void }
> = ({ onConnect, setRoninDeepLink }) => {
  return (
    <>
      <Button
        className="mb-1 py-2 text-sm relative"
        onClick={() => {
          onConnect(sequenceConnector);
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
      <RoninWallets onConnect={onConnect} setRoninDeepLink={setRoninDeepLink} />
      <CoinBaseWallets onConnect={onConnect} />
      <Button
        className="mb-1 py-2 text-sm relative"
        onClick={() => {
          setRoninDeepLink(false);
          onConnect(walletConnectConnector);
        }}
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

// This must be global so its reference doesn't change
const displayUriListener = (uri: string) => {
  window.open(`roninwallet://wc?uri=${encodeURIComponent(uri)}`, "_self");
};

export const Wallets: React.FC<Props> = ({ onConnect }) => {
  const [page, setPage] = useState<"home" | "other" | "ronin" | "coinbase">(
    "home",
  );

  const isPWA = useIsPWA();
  const isMobilePWA = isMobile && isPWA;

  const { connectors } = useConnect();
  const { t } = useAppTranslation();

  const walletConnectConnector = connectors.filter(
    ({ id }) => id === "walletConnect",
  )[0];

  const [provider, setProvider] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const provider = await walletConnectConnector.getProvider();
      setProvider(provider);
    })();
  }, []);

  const setRoninDeepLink = (isOn: boolean) => {
    if (isOn && isMobile) {
      provider && (provider as any).once("display_uri", displayUriListener);
    }

    if (!isOn) {
      provider &&
        (provider as any).removeListener("display_uri", displayUriListener);
    }
  };

  if (isMobilePWA) {
    return (
      <PWAWallets onConnect={onConnect} setRoninDeepLink={setRoninDeepLink} />
    );
  }

  const eip6963Connectors = connectors.filter(
    (connector) => connector.type === "injected" && !!connector.icon,
  );

  // There is an injected provider, but it's not showing up in EIP-6963
  const showFallback = !!window.ethereum && eip6963Connectors.length === 0;

  if (showFallback && page === "home") {
    return (
      <>
        <Button
          className="mb-1 py-2 text-sm relative"
          onClick={() => onConnect(fallbackConnector)}
        >
          <div className="px-8">
            <img
              src={SUNNYSIDE.icons.worldIcon}
              className="w-7 h-7 mobile:w-6 mobile:h-6  ml-2 mr-6 absolute left-0 top-1"
            />
            {"Web3 Wallet"}
          </div>
        </Button>
        <Button
          className="mb-1 py-2 text-sm relative"
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
      </>
    );
  }
  return (
    <>
      {showFallback && (
        <>
          <Button
            className="mb-1 py-2 text-sm relative"
            onClick={() => onConnect(fallbackConnector)}
          >
            <div className="px-8">
              <img
                src={SUNNYSIDE.icons.worldIcon}
                className="w-7 h-7 mobile:w-6 mobile:h-6  ml-2 mr-6 absolute left-0 top-1"
              />
              {"Web3 Wallet"}
            </div>
          </Button>
        </>
      )}
      {/** Metamask and Ronin have custom buttons - don't show the injected connectors */}
      {eip6963Connectors
        .filter((connector) => connector.name !== "MetaMask")
        .filter((connector) => connector.name !== "Ronin Wallet")
        .filter((connector) => connector.name !== "Coinbase Wallet")
        .map((connector) => (
          <Button
            className="mb-1 py-2 text-sm relative"
            onClick={() => onConnect(connector)}
            key={connector.name}
          >
            <div className="px-8">
              <img
                src={connector.icon}
                className="h-7 ml-2.5 mr-6 absolute left-0 top-1 rounded-sm"
              />
              {connector.name}
            </div>
          </Button>
        ))}

      {page === "home" && (
        <MainWallets onConnect={onConnect} page={page} setPage={setPage} />
      )}
      {page === "other" && (
        <>
          <MainWallets onConnect={onConnect} page={page} setPage={setPage} />
          <OtherWallets
            onConnect={onConnect}
            setRoninDeepLink={setRoninDeepLink}
          />
        </>
      )}
      {page === "ronin" && (
        <RoninWallets
          onConnect={onConnect}
          setRoninDeepLink={setRoninDeepLink}
        />
      )}
      {page === "coinbase" && <CoinBaseWallets onConnect={onConnect} />}
    </>
  );
};

export const SignIn: React.FC<{ type: "signin" | "signup" }> = ({ type }) => {
  const { authService } = useContext(Context);
  const { walletService } = useContext(WalletContext);

  const [walletState] = useActor(walletService);
  const [showLoading, setShowLoading] = useState(false);
  const { t } = useAppTranslation();

  if (showLoading) {
    return (
      <div className="">
        <Loading />
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
          <div
            className="flex items-center mb-2 cursor-pointer "
            onClick={() => authService.send("BACK")}
          >
            <img
              src={SUNNYSIDE.icons.arrow_left}
              className="mr-2"
              style={{
                width: `${PIXEL_SCALE * 8}px`,
              }}
            />
            <span className="text-sm">{t("back")}</span>
          </div>
          <button
            className="w-full p-1 object-contain justify-center items-center cursor-pointer flex mb-1 text-sm relative h-[52px] "
            type="button"
            style={{
              borderImage: `url(${SUNNYSIDE.ui.greyButton})`,
              borderStyle: "solid",
              borderWidth: `8px 8px 10px 8px`,
              borderImageSlice: "3 3 4 3 fill",
              imageRendering: "pixelated",
              borderImageRepeat: "stretch",
              borderRadius: `${PIXEL_SCALE * 5}px`,
              color: "#674544",
            }}
            onClick={() => {
              setShowLoading(true);
              window.location.href = `${CONFIG.API_URL}/auth/google/authorize`;
            }}
          >
            <img src={SUNNYSIDE.icons.googleIcon} />
          </button>
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

      {walletState.matches("chooseWallet") && (
        <>
          {!isMobile && type !== "signup" && (
            <Button
              className="mb-1 py-2 text-sm relative"
              onClick={() => {
                setShowLoading(true);
                window.location.href = `${CONFIG.API_URL}/auth/wechat/authorize`;
              }}
            >
              <img
                src={SUNNYSIDE.icons.wechatIcon}
                className="w-7 h-7 mobile:w-6 mobile:h-6  ml-2 mr-6 absolute left-0 top-1"
              />
              {"Wechat"}
            </Button>
          )}

          <Button
            className="mb-1 py-2 text-sm relative"
            onClick={() => {
              setShowLoading(true);
              fslAuthorization.signIn().then((code) => {
                if (code) {
                  window.location.href = `${CONFIG.API_URL}/auth/fsl/callback?code=${code}`;
                }
              });
            }}
          >
            <img
              src={fslIcon}
              className="w-10 h-10 left-[2px] mr-6 absolute top-0"
            />
            {"FSL ID"}
          </Button>
        </>
      )}

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
    </div>
  );
};

export const SignUp = () => <SignIn type="signup" />;
