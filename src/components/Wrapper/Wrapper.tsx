import { ReactNode } from 'react';
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
