// AJAX 요청을 보내서 응답을 받아올 것

import styled from "styled-components";

// 요번 타임 주제 => 회원들의 정보를 받아왔다고 가정
const StyledDiv = styled.div`
    width: 100%;
    height: 160px;
    border : 1px solid lightgray;
    margin : 40px;
    margin-left : 0;
    background-color: ${(props) => (props.color ? props.color : "white")};
    color: crimson;
`;

const members = [
    {
        memberId: "admin",
        memberName: "짱구",
        email: "jjang@kh.com",
        color: "lightcoral",
    },
    {
        memberId: "user01",
        memberName: "철수",
        email: "ironwater@kh.com",
        color: "lightblue",
    },
    {
        memberId: "user02",
        memberName: "유리",
        email: "glass@kh.com",
        color: "",
    },
];

const MemberInfo = (props) => {
    console.log(props);
    // 구조분해
    const { memberId, memberName, email, color } = props.member;
    // console.log(memberId, memberName, email, color);
    return (
        <StyledDiv color={color}>
            <h5>아이디 : {memberId}</h5>
            <strong>이름 : {memberName}</strong>
            <p>이메일 : {email}</p>
        </StyledDiv>
    );
};

const TestComponent = (props) => {
    return(
        <>
            프롭스값 + 2 : <div>꽥</div>
        </>
    )
}

const Chapter02 = () => {

    return (
        <>
            {members ?
                members.map((e) => (
                <MemberInfo member={e} />
            )) : (
                <h1>조회결과가 없습니다.</h1>
            )} 

        {/* 2절
        <MemberInfo {...members[0]} />
        <MemberInfo {...members[1]} />
        <MemberInfo {...members[2]} />
        */}
            {/* 1절
            <StyledDiv>
                <h5>아이디 : { members[0].memberId}</h5>
                <strong>이름 : {members[0].memberName}</strong>
                <p>이메일 : {members[0].email}</p>
            </StyledDiv>
            <StyledDiv>
                <h3>아이디 : {members[1].memberId}</h3>
                <strong>이름 : {members[1].memberName}</strong>
                <p>이메일 : {members[1].email}</p>
            </StyledDiv>
            <StyledDiv>
                <h3>아이디 : {members[2].memberId}</h3>
                <strong>이름 : {members[2].memberName}</strong>
                <p>이메일 : {members[2].email}</p>
            </StyledDiv>
            */}

            <pre>
                props사용시 주의할 점!
                <br />
                React의 함수형 컴포넌트는 항상 Pure하게 만들어야함!!
            
                React의 사용목적 : 웹 어플리케이션의 UI(UserInterface) = MVC(V) <br />
                필요한 값 입력받기 <br />
                요청보내기 <br />
                요청 결과 출력 <br />
                만들용도로 사용 <br /><br />
            </pre>
        </>
    )
}

export default Chapter02;