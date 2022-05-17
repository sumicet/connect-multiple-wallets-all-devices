import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { MetaMask } from '@web3-react/metamask';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { metaMask, coinbase } from '../connectors/connectors';

export interface Provider {
    name: 'MetaMask' | 'Coinbase';
    provider: any;
}

export function useWeb3React() {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [wallet, setWallet] = useState<'MetaMask' | 'Coinbase' | null>(null);
    const [account, setAccount] = useState<string | null>(null);
    const [connector, setConnector] = useState<MetaMask | CoinbaseWallet | null>(null);

    // attempt to connect eagerly on mount
    useEffect(() => {
        // void metaMask.connectEagerly();
    }, []);

    const connect = async (name: 'MetaMask' | 'Coinbase') => {
        console.log(name);
        let connector = null;
        if (name === 'MetaMask') {
            connector = metaMask;
        } else if (name === 'Coinbase') {
            console.timeLog('setCoinbase');
            connector = coinbase;
        }

        try {
            if (!connector) {
                return;
            }

            void (await connector.activate());
            setConnector(connector);

            console.log(connector);

            if (!connector.provider) {
                return;
            }

            const web3 = new Web3(connector.provider as any);
            const accounts = await web3.eth.getAccounts();
            if (!accounts || !accounts.length) {
                return;
            }

            const signPromise = await web3.eth.personal.sign('Connect wallet', accounts[0], '');
            setProviders([
                {
                    name,
                    provider: connector.provider,
                },
            ]);

            console.log(connector.provider);
            setAccount(accounts[0]);
            setWallet(name);
        } catch (err: any) {}
    };

    const disconnect = () => {
        if (!connector) {
            return;
        }

        void connector.deactivate();
        setWallet(null);
        setAccount(null);
    };

    const switchNetwork = async (chainId: number) => {
        if (!connector) {
            return;
        }

        if (chainId === 1) {
            await connector.activate({
                chainName: 'Polygon Mainnet',
                chainId: 137,
                nativeCurrency: {
                    decimals: 18,
                    name: 'MATIC',
                    symbol: 'MATIC',
                },
                rpcUrls: [
                    'https://polygon-mainnet.public.blastapi.io',
                    'https://matic-mainnet.chainstacklabs.com',
                ],
            });
        } else {
            await connector.activate({
                chainName: 'Ethereum Mainnet',
                chainId: 1,
                nativeCurrency: {
                    decimals: 18,
                    name: 'ETH',
                    symbol: 'ETH',
                },
                rpcUrls: ['https://eth-mainnet.public.blastapi.io', 'https://rpc.ankr.com/eth'],
            });
        }
    };

    return { disconnect, connect, wallet, providers, account, switchNetwork };
}
