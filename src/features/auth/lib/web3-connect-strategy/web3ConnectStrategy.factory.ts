import { Web3SupportedProviders } from "lib/web3SupportedProviders";
import { IWeb3ConnectStrategy } from "./interfaces/IWeb3ConnectStrategy";
import { MetamaskStrategy } from "./metamask.strategy";
import { OKXStrategy } from "./okx.strategy";
import { PhantomStrategy } from "./phantom.strategy";
import { SequenceStrategy } from "./sequence.strategy";
import { WalletConnectStrategy } from "./walletConnect.strategy";
import { CryptoComStrategy } from "./cryptoCom.strategy";
import { BitgetStrategy } from "./bitget.strategy";

export function web3ConnectStrategyFactory(
  providerName: Web3SupportedProviders,
): IWeb3ConnectStrategy {
  switch (providerName) {
    case Web3SupportedProviders.METAMASK:
      return new MetamaskStrategy();
    case Web3SupportedProviders.OKX:
      return new OKXStrategy();
    case Web3SupportedProviders.PHANTOM:
      return new PhantomStrategy();
    case Web3SupportedProviders.SEQUENCE:
      return new SequenceStrategy();
    case Web3SupportedProviders.WALLET_CONNECT:
      return new WalletConnectStrategy();
    case Web3SupportedProviders.CRYPTO_COM:
      return new CryptoComStrategy();
    case Web3SupportedProviders.BITGET:
      return new BitgetStrategy();
  }
}
