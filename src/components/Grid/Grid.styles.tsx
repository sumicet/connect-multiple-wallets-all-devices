import styled from 'styled-components';

export const Grid = styled.div<{ columns?: number }>`
    display: grid;
    grid-gap: 10px;
    ${props =>
        props.columns
            ? `grid-template-columns: repeat(${props.columns}, 1fr)`
            : `grid-template-columns: repeat(auto-fit, minmax(160px, 1fr))`};
`;
