import { useEffect, useState } from 'react';
import Web3 from 'web3';
import Wrapper from './components/Wrapper/Wrapper';
import { Card } from './components/Card/Card.styles';
import * as Popover from '@radix-ui/react-popover';
import { isMobile } from 'react-device-detect';

function App() {
    const [web3, setWeb3] = useState<any>();
    const [accounts, setAccounts] = useState<string[]>([]);
    const [isMetaMask, setIsMetaMask] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [wallets, setWallets] = useState<string[]>([]);

    useEffect(() => {
        const init = () => {
            const handleEthereum = () => {
                // @ts-ignore
                const { ethereum } = window;
                const w = new Web3(ethereum as any);
                setWeb3(w);

                if (!w) {
                    return;
                }

                let wal: string[] = [];

                if (isMobile) {
                    if (ethereum?.isMetaMask) {
                        wal.push('MetaMask');
                    }
                    // @ts-ignore
                    if (ethereum?.isCoinbaseWallet) {
                        wal.push('Coinbase');
                    }
                } else {
                    // @ts-ignore
                    w.eth?.currentProvider?.providers?.forEach((provider: any) => {
                        if (provider.isMetaMask && !wal.find(elem => elem === 'MetaMask')) {
                            wal.push('MetaMask');
                        }
                        if (provider.isCoinbaseWallet && !wal.find(elem => elem === 'Coinbase')) {
                            wal.push('Coinbase');
                        }
                    });
                }

                setWallets(wal);
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
        if (!web3) {
            return;
        }

        try {
            let selectedProvider = null;
            if (isMobile) {
                // @ts-ignore
                const { ethereum } = window;
                selectedProvider = ethereum;
            } else {
                web3.eth?.currentProvider?.providers?.forEach((provider: any) => {
                    if (provider.isMetaMask && name === 'MetaMask') {
                        selectedProvider = provider;
                    }
                    if (provider.isCoinbaseWallet && name === 'Coinbase') {
                        selectedProvider = provider;
                    }
                });
            }

            if (!selectedProvider) {
                return;
            }

            const selectedWeb3 = new Web3(selectedProvider as any);
            if (accounts[0]) {
                const signPromise = await selectedWeb3.eth.personal.sign(
                    'Sign something...',
                    accounts[0],
                    ''
                );
            } else {
                const a = await selectedWeb3.eth.requestAccounts();
                const signPromise = await selectedWeb3.eth.personal.sign(
                    'Sign something...',
                    a[0],
                    ''
                );
                setAccounts(a);
            }
        } catch (err: any) {
            setError(err.message || 'Oops.');
        }
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
                <Popover.Content>
                    <div
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
                        <p>{web3 ? 'Provider detected' : 'Provider missing.'}</p>
                        <p>{error}</p>
                        {wallets.map(wallet => (
                            <Card key={wallet} onClick={() => connect(wallet)}>
                                <p>{wallet}</p>
                            </Card>
                        ))}
                    </div>
                    <Popover.Close />
                    <Popover.Arrow fill='#151718' />
                </Popover.Content>
            </Popover.Root>
        </Wrapper>
    );
}

export default App;
