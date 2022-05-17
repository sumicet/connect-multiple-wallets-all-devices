import { useEffect, useState } from 'react';
import Web3 from 'web3';
import Wrapper from './components/Wrapper/Wrapper';
import { Card } from './components/Card/Card.styles';
import * as Popover from '@radix-ui/react-popover';
import { isMobile } from 'react-device-detect';
import { CloseIcon } from './assets/images/CloseIcon';
import * as Styled from './App.styles';
import { openApp } from './utils/getDeepLink';

interface Provider {
    name: 'MetaMask' | 'Coinbase';
    provider: any;
}

const defaultWallets = ['MetaMask', 'Coinbase'];

function App() {
    const [web3, setWeb3] = useState<any>();
    const [accounts, setAccounts] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [providers, setProviders] = useState<Provider[]>([]);
    const [wallet, setWallet] = useState<string | null>(null);

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

                // @ts-ignore
                console.log(web3?.eth?.currentProvider?.providers);

                // Multiple wallet extensions
                // @ts-ignore
                if (web3?.eth?.currentProvider?.providers?.length) {
                    // @ts-ignore
                    web3?.eth?.currentProvider.providers.forEach((provider: any) => {
                        console.log(provider.isMetaMask);
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

    const connect = async (name: string) => {
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
            setAccounts(a);
            setWeb3(web3);
            setWallet(provider.name);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Oops.');
        }
    };

    const disconnect = () => {
        setWallet(null);
        setError(null);
        setAccounts([]);
        setWeb3(undefined);
    };

    return (
        <Wrapper>
            <Popover.Root>
                <Popover.Trigger
                    style={{
                        background: '#151718',
                        padding: 10,
                        borderRadius: 8,
                        cursor: 'pointer',
                    }}
                >
                    <p>
                        {accounts[0] ? (
                            <>
                                Connected as {accounts[0].slice(0, 6)}...
                                {accounts[0].slice(accounts[0].length - 3, accounts[0].length)}
                            </>
                        ) : (
                            'Connect wallet'
                        )}
                    </p>
                </Popover.Trigger>
                <Popover.Anchor color='red' />
                <Popover.Content
                    style={{
                        background: '#151718',
                        display: 'grid',
                        gap: 10,
                        gridColumn: 1,
                        padding: 10,
                        borderRadius: 8,
                        maxWidth: '80vw',
                    }}
                >
                    <div
                        style={{
                            background: 'transparent',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            display: 'flex',
                        }}
                    >
                        <p>
                            {web3 ? (
                                <>
                                    Connected with <b>{wallet}</b>.
                                </>
                            ) : (
                                'No wallet selected.'
                            )}
                        </p>
                        <Popover.Close
                            style={{
                                background: 'transparent',
                                cursor: 'pointer',
                                marginLeft: 10,
                            }}
                        >
                            <Styled.IconContainer>
                                <CloseIcon />
                            </Styled.IconContainer>
                        </Popover.Close>
                    </div>
                    {error && <p>{error}</p>}
                    {wallet ? (
                        <Card onClick={disconnect}>
                            <p>Disconnect</p>
                        </Card>
                    ) : (
                        defaultWallets.map(name => {
                            const disabled =
                                !providers.find(elem => elem.name === name) && !!providers.length;
                            return (
                                <Card
                                    key={name}
                                    onClick={event => {
                                        !disabled && connect(name);
                                    }}
                                    disabled={disabled}
                                >
                                    <p>{name}</p>
                                </Card>
                            );
                        })
                    )}

                    <Popover.Arrow fill='#151718' />
                </Popover.Content>
            </Popover.Root>
        </Wrapper>
    );
}

export default App;
