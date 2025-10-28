import "./Chapter01.css";
import { StyledP, StyledBlueP } from "./Chapter01.style.js"; // 파일명에 맞게 경로 수정

const Chapter01 = () => {
    /*
        1. 함수형 컴포넌트 사용 시 주의할 점 :
        두 개 이상이라면 반드시 하나 이상의 부모요소로 감싸주어야 함

        2. 감쌀태그가 존재하지 않는다면, 빈 태그 <></>로 감싸주거나
        리액트에서 제공해주는 Fragment컴포넌트를 사용해야함

    */
    return (
        <>
            <p style={{color: "forestgreen", backgroundColor: "yellow"}}>
                스타일 입히는 방법
            </p>
            <p className="styled-p">스타일 입히는 방법 두 번째</p>
            <StyledP>이거는 스타일컴포넌트로 스타일입힘</StyledP>
            <StyledBlueP>얘도 마찬가지임</StyledBlueP>
        </>
    );
};

export default Chapter01;