import Wrapper from './components/Wrapper/Wrapper';
import ConnectWalletCard from './components/ConnectWalletCard/ConnectWalletCard';
import { useInjectedProvider } from './hooks/useInjectedProvider';
import { useWeb3React } from './hooks/useWeb3React';
import * as Styled from './App.styles';
import { Grid } from './components/Grid/Grid.styles';
import Web3ReactProvider from './components/Web3ReactProvider/Web3ReactProvider';

export const defaultWallets = ['MetaMask', 'Coinbase'];

function App() {
    const injectedArgs = useInjectedProvider();
    const web3ReactArgs = useWeb3React();

    return (
        <Wrapper>
            <Grid>
                <Web3ReactProvider>
                    <ConnectWalletCard title='Injected Provider' {...injectedArgs} />
                    <ConnectWalletCard title='Web3React' {...web3ReactArgs} />
                </Web3ReactProvider>
            </Grid>
        </Wrapper>
    );
}

export default App;
