import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { MetaMask } from '@web3-react/metamask';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import Web3 from 'web3';
import { metaMask, coinbase } from '../connectors/connectors';
import { openMobileApp } from '../utils/openApp';

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

            if (isMobile && !window.ethereum) {
                openMobileApp(name);
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

        try {
            if (chainId === 1) {
                try {
                    await connector?.provider?.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: Web3.utils.toHex(137) }],
                    });
                } catch (err: any) {
                    try {
                        await connector?.provider?.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainName: 'Polygon',
                                    chainId: Web3.utils.toHex(137),
                                    nativeCurrency: {
                                        name: 'MATIC',
                                        decimals: 18,
                                        symbol: 'MATIC',
                                    },
                                    rpcUrls: [
                                        'https://polygon-mainnet.public.blastapi.io',
                                        'https://matic-mainnet.chainstacklabs.com',
                                        'https://polygon-rpc.com',
                                        'https://polygon-mainnet.public.blastapi.io',
                                        'https://rpc-mainnet.matic.quiknode.pro',
                                    ],
                                    blockExplorerUrls: ['https://polygonscan.com/'],
                                    iconUrls: [
                                        'https://polygonscan.com/images/logo-white.svg?v=0.0.2',
                                    ],
                                },
                            ],
                        });
                    } catch (err: any) {
                        console.log(err);
                    }
                }
            } else {
                try {
                    await connector?.provider?.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: Web3.utils.toHex(1) }],
                    });
                } catch (err: any) {
                    try {
                        await connector?.provider?.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainName: 'Ethereum',
                                    chainId: Web3.utils.toHex(1),
                                    nativeCurrency: {
                                        decimals: 18,
                                        name: 'ETH',
                                        symbol: 'ETH',
                                    },
                                    rpcUrls: [
                                        'https://eth-mainnet.public.blastapi.io',
                                        'https://rpc.ankr.com/eth',
                                    ],
                                },
                            ],
                        });
                    } catch (err: any) {
                        console.log(err);
                    }
                }
            }
        } catch (err: any) {
            alert(err.message);
        }
    };

    return { disconnect, connect, wallet, providers, account, switchNetwork };
}
