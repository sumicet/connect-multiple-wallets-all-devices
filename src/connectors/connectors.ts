import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { CoinbaseWallet } from '@web3-react/coinbase-wallet';

export const [metaMask, metamaskHooks] = initializeConnector<MetaMask>(
    actions => new MetaMask(actions)
);

export const [coinbase, coinbaseHooks] = initializeConnector<CoinbaseWallet>(
    actions =>
        new CoinbaseWallet(actions, {
            appName: 'Multiple Wallets',
            url: 'https://eth-mainnet.public.blastapi.io',
        })
);
