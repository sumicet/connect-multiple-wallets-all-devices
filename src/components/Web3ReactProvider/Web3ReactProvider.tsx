import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { Web3ReactHooks, Web3ReactProvider as Web3ReactProviderX } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { coinbase, coinbaseHooks, metaMask, metamaskHooks } from '../../connectors/connectors';

const connectors: [MetaMask | CoinbaseWallet, Web3ReactHooks][] = [
    [metaMask, metamaskHooks],
    [coinbase, coinbaseHooks],
];

export default function Web3ReactProvider({ children }: { children: any }) {
    return <Web3ReactProviderX connectors={connectors}>{children}</Web3ReactProviderX>;
}
