import WalletConnectProvider from '@walletconnect/web3-provider';
import QRCodeModal from '@walletconnect/qrcode-modal';
import Web3 from 'web3';
import { ReactNode, useEffect } from 'react';
import * as Styled from './Wrapper.styles';

interface BodyWrapperProps {
    children: ReactNode;
}

/**
 * Container element that wraps the content of most pages and the tabs.
 */
const Wrapper = ({ children }: BodyWrapperProps) => {
    return <Styled.Wrapper>{children}</Styled.Wrapper>;
};

export default Wrapper;
