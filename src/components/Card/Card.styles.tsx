import styled from 'styled-components';

export const Card = styled.div<{ disabled?: boolean }>`
    border: 1px solid #ffffff17;
    border-radius: 8px;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;

    padding: 5px 10px;

    ${props =>
        props.disabled &&
        `
        & > p { color: #ffffff3d; }
    `}

    ${props =>
        !props.disabled &&
        `
        cursor: pointer;
    `}
`;
