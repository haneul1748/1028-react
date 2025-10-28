import styled from "styled-components";

export const StyledP = styled.p`
    background-color: white;
    color: black;
    width: 500px;
    height: 200px;
    line-height: 200px;
    border: 1px dotted orange;

    &:hover {
        cursor: pointer;
        background-color: crimson;
    }
`;

export const StyledBlueP = styled.p`
    background-color: skyblue;
    color: white;
    font-weight: 900;
`;