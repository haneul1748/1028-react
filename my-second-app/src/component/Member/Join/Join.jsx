import { useState } from "react";
import { Form, Button, Container, Input, Title } from "../../styles/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Join = () => {
  const navi = useNavigate();
  const [memberId, setMemberId] = useState("");
  const [memberPwd, setMemberPwd] = useState("");
  const [memberName, setMemberName] = useState("");
  const [loading, isLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const handlerSubmit = (e) => {
    e.preventDefault();
    isLoading(true);
    // console.log(`아이디 : ${memberId}`);
    // console.log(`비밀번호 : ${memberPwd}`);
    // console.log(`닉네임 : ${memberName}`);
    try {
      axios
        .post("http://localhost:8081/members", {
          memberId,
          memberPwd,
          memberName,
        })
        .then((result) => {
          //console.log(result);
          if (result.status == 201) {
            alert("회원 가입 성공");
            setTimeout(() => {
              navi("/");
            }, 1000);
          }
        })
        .catch((error) => {
          // console.log(error.response.data.error - msg);
          setErrMsg(error.response.data["error-message"]);
          isLoading(false);
        });
    } catch (e) {
      console.log(e);
    }
  };


  return (
    <>
      <Container>
        {loading ? (
          <Title>회원가입 시도중 ... </Title>
        ) : (
          <Form onSubmit={handlerSubmit}>
            <Title>회원가입</Title>
            <label style={{ color: "red" }}>{errMsg}</label>
            <h4>아이디</h4>
            <Input
              placeholder="아이디를 입력해주세요."
              type="text"
              onChange={(e) => setMemberId(e.target.value)}
            />
            <h4>비밀번호</h4>
            <Input
              placeholder="비밀번호를 입력해주세요."
              type="password"
              onChange={(e) => setMemberPwd(e.target.value)}
            />
            <h4>닉네임</h4>
            <Input
              placeholder="닉네임을 입력해주세요."
              type="text"
              onChange={(e) => setMemberName(e.target.value)}
            />
            <Button type="submit">즐거운 회원가입하기</Button>
          </Form>
        )}
      </Container>
    </>
  );
};
export default Join;