import styled from "styled-components";
  
export const StyledWrap = styled.div`
  width: 1200px;
  min-height: 1200px;
  height: auto;
  margin: auto;
  margin-top: 30px;
  margin-bottom: 30px;
  border: 1px solid #ffc3c359;
  box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.02);
`;

export const StyledTitle = styled.h1`
  font-size: 60px;
  font-weight: 800;
  color: #ff9a9e;
  text-align: center;
  margin: 65px 0px;
`;

export const StyledInnerWrap = styled.div`
  width: 1100px;
  margin: auto;
  height: auto;
  min-height: 800px;
  padding: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 11px;
`;

export const StyledCard = styled.div`
  width: 330px;
  height: 250px;
  margin: 9px 9px;
  padding: 8px;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);
  border-radius: 13px;
  display: inline-block;

  &:hover {
    cursor: pointer;
    box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.4);
    opacity: 0.9;
  }
`;

export const StyledImg = styled.img`
  width: 330px;
  height: 180px;
`;

export const StyledStoreName = styled.h3`
  font-weight: bold;
  text-align: center;
  font-size: 17px;
  margin: 0px;
  margin-top: 12px;
`;

export const StyledMoreButton = styled.div`
  width: 150px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin: auto;
  border-radius: 22px;
  background-color: #ff9a9e;
  color: white;
  font-weight: 900;
  border: 2px dotted lightpink;
  margin-top: 35px;
  font-size: 18px;

  &:hover {
    cursor: pointer;
    background-color: white;
    color: #ff9a9e;
  }
`;
