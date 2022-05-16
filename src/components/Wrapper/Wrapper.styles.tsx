import styled from 'styled-components';

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    /* flex: 1; */
    flex-grow: 1;
    max-width: 100%;
    background: linear-gradient(to bottom, #323232 0%, #3f3f3f 40%, #1c1c1c 150%),
        linear-gradient(to top, rgba(255, 255, 255, 0.4) 0%, rgba(0, 0, 0, 0.25) 200%);
    background-blend-mode: multiply;
    align-items: center;
    justify-content: center;
`;
