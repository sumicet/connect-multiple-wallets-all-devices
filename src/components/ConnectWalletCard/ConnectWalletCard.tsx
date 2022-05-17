import { defaultWallets } from '../../App';
import { Provider } from '../../hooks/useInjectedProvider';
import { Card } from '../Card/Card.styles';
import { Grid } from '../Grid/Grid.styles';
import * as Popover from '@radix-ui/react-popover';
import * as Separator from '@radix-ui/react-separator';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { coinbaseHooks, metamaskHooks } from '../../connectors/connectors';

const { useChainId: useMetamaskChainId } = metamaskHooks;
const { useChainId: useCoinbaseChainId } = coinbaseHooks;

/**
 *
 * @disconnect Disconnect wallet
 * @connect Connect wallet
 * @wallet Metamask or Coinbase
 * @providers Each element should have a name & a provider object
 * @account Selected wallet address
 */
function ConnectWalletCard({
    title,
    disconnect,
    connect,
    wallet,
    providers,
    account,
    switchNetwork,
}: {
    title: string;
    account: string | null;
    disconnect: () => void;
    connect: (name: 'MetaMask' | 'Coinbase') => Promise<void>;
    wallet: 'MetaMask' | 'Coinbase' | null;
    providers: Provider[];
    switchNetwork: ((chainId: number) => Promise<void>) | null;
}) {
    const showNetworks =
        switchNetwork &&
        providers &&
        providers[0] &&
        providers[0].provider.chainId &&
        title === 'Web3React';

    const metamaskChainId = useMetamaskChainId();
    const coinbaseChainId = useCoinbaseChainId();

    return (
        <div>
            <div
                style={{
                    background: '#151718',
                    padding: 10,
                    borderRadius: 8,
                    maxWidth: '80vw',
                }}
            >
                <div
                    style={{
                        marginBottom: 10,
                    }}
                >
                    <h2>{title}</h2>
                </div>
                <Separator.Root style={{ height: 1, background: '#ffffff17', marginBottom: 10 }} />
                <p style={{ marginBottom: 10 }}>
                    {account ? (
                        <>
                            Connected with <b>{wallet}</b> as {account.slice(0, 6)}...
                            {account.slice(account.length - 3, account.length)}
                        </>
                    ) : (
                        'Wallet not connected.'
                    )}
                </p>
                {/* {error && <p>{error}</p>} */}
                <Grid columns={showNetworks ? 2 : 0}>
                    <div style={{ display: 'grid', gap: 10 }}>
                        {wallet ? (
                            <Card onClick={disconnect}>
                                <p>Disconnect</p>
                            </Card>
                        ) : (
                            defaultWallets.map(name => {
                                const disabled =
                                    !providers.find(elem => elem.name === name) &&
                                    !!providers.length &&
                                    title === 'Injected Provider';
                                return (
                                    <Card
                                        key={name}
                                        onClick={() => {
                                            !disabled && connect(name as 'MetaMask' | 'Coinbase');
                                        }}
                                        disabled={disabled}
                                    >
                                        <p>{name}</p>
                                    </Card>
                                );
                            })
                        )}
                    </div>
                    <div style={{ display: 'grid', gap: 10 }}>
                        {showNetworks &&
                            [1, 137].map(id => {
                                const chainId =
                                    wallet === 'MetaMask' ? metamaskChainId : coinbaseChainId;
                                console.log(chainId);

                                if (!chainId) {
                                    return null;
                                }

                                if (chainId !== id) {
                                    return (
                                        <div key={id}>
                                            <Card
                                                onClick={async () => {
                                                    switchNetwork(chainId);
                                                }}
                                            >
                                                <p>
                                                    Switch to{' '}
                                                    {chainId !== 1 ? 'Ethereum' : 'Polygon'}
                                                </p>
                                            </Card>
                                        </div>
                                    );
                                }
                            })}
                    </div>
                </Grid>
            </div>
        </div>
    );
}

export default ConnectWalletCard;
