import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import Web3 from 'web3';

export interface Provider {
    name: 'MetaMask' | 'Coinbase';
    provider: any;
}

export function useInjectedProvider() {
    const [account, setAccount] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [providers, setProviders] = useState<Provider[]>([]);
    const [wallet, setWallet] = useState<'MetaMask' | 'Coinbase' | null>(null);

    useEffect(() => {
        const init = () => {
            const handleEthereum = () => {
                // @ts-ignore
                let provider: any = window.ethereum;

                if (!provider) {
                    throw new Error('No providers detected.');
                }

                let availableProviders: Provider[] = [];

                const web3 = new Web3(provider);

                // Multiple wallet extensions
                // @ts-ignore
                if (web3?.eth?.currentProvider?.providers?.length) {
                    // @ts-ignore
                    web3?.eth?.currentProvider.providers.forEach((provider: any) => {
                        if (
                            provider.isMetaMask &&
                            !availableProviders.find(elem => elem.name === 'MetaMask')
                        ) {
                            availableProviders.push({
                                name: 'MetaMask',
                                provider,
                            });
                        }
                        if (
                            provider.isCoinbaseWallet &&
                            !availableProviders.find(elem => elem.name === 'Coinbase')
                        ) {
                            availableProviders.push({
                                name: 'Coinbase',
                                provider,
                            });
                        }
                    });
                } else {
                    if (provider?.isMetaMask) {
                        availableProviders.push({
                            name: 'MetaMask',
                            provider,
                        });
                    }
                    // @ts-ignore
                    if (provider?.isCoinbaseWallet) {
                        availableProviders.push({
                            name: 'Coinbase',
                            provider,
                        });
                    }
                }

                setProviders(availableProviders);
            };

            // @ts-ignore
            if (window.ethereum) {
                handleEthereum();
            } else {
                window.addEventListener('ethereum#initialized', handleEthereum, {
                    once: true,
                });

                // If the event is not dispatched by the end of the timeout,
                // the user probably doesn't have MetaMask installed.
                setTimeout(handleEthereum, 3000); // 3 seconds
            }
        };

        init();
    }, []);

    const connect = async (name: 'MetaMask' | 'Coinbase') => {
        if (isMobile && !providers.length) {
            if (name === 'MetaMask') {
                window.open(
                    `https://metamask.app.link/dapp/${window.location.href.replace(
                        /(^\w+:|^)\/\//,
                        ''
                    )}`,
                    '_blank',
                    'noopener noreferrer'
                );
                return;
            } else if (name === 'Coinbase') {
                window.open(
                    `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(window.location.href)}`,
                    '_blank',
                    'noopener noreferrer'
                );
                return;
            }
        }

        if (!providers.length) {
            setError('No providers here.');
            return;
        }

        try {
            const provider = providers.find(elem => elem.name === name);

            if (!provider) {
                setError('Unable to find provider.');
                return;
            }

            const web3 = new Web3(provider.provider);
            const a = await web3.eth.requestAccounts();
            const signPromise = await web3.eth.personal.sign('Connect wallet', a[0], '');
            setAccount(a[0]);
            setWallet(provider.name);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Oops.');
        }
    };

    const disconnect = () => {
        setWallet(null);
        setError(null);
        setAccount(null);
    };

    return { disconnect, connect, wallet, providers, account, switchNetwork: null };
}
