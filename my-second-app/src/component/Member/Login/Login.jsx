import { Button, Container, Form, Input, Title } from "../../styles/styles";
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [memberId, setMemberId] = useState("");
  const [memberPwd, setMemberPwd] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, isLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    const regexp = /^[a-zA-Z0-9]{3,20}$/;
    console.log(memberId);
    console.log(memberPwd);
    if (!regexp.test(memberId)) {
      setMsg("아이디는 영어랑 숫자만 쓰세요.(3자에서 20자 사이)");
      return;
    } else if (!regexp.test(memberPwd)) {
      setMsg("비밀번호는 영어랑 숫자만 쓰세요.(3자에서 20자 사이)");
      return;
    } else {
      setMsg("");
    }

    axios
      .post("http://localhost:8081/auth/login", {
        memberId,
        memberPwd,
      })
      .then((result) => {
        /*
            console.log(result);
            const accessToken = reuslt.data.accessTokne;
            const refreshToken = reuslt.data.refreshTokne;
            */
        const { memberId, memberName, accessToken, refreshToken, role } =
          result.data;
        login(memberId, memberName, accessToken, refreshToken, role);
        alert("축하해요 로그인에 성공하셨습니다.");
        window.location.href = "/";
        // console.log(memberId, memberName, accessToken, refreshToken, role);
        /*
        localStorage.setItem("memberId", memberId);
        localStorage.setItem("memberName", memberName);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("role", role);
        */
        //sessionSto.setItem
      })
      .catch((error) => {
        //console.error(error);
        alert(error.response.data["error-message"]);
      });
  };

  return (
    <>
      <Container height="300px">
        <Form onSubmit={handleLogin}>
          <Title>로그인싹싹이</Title>
          <Input
            type="text"
            placeholder="아이디를 입력해주세요"
            onChange={(e) => setMemberId(e.target.value)}
          />
          <label
            style={{ fontSize: "13px", color: "orangered", padding: "4px" }}
          >
            {msg}
          </label>
          <Input
            type="password"
            placeholder="비밀번호를 입력해주세요"
            onChange={(e) => setMemberPwd(e.target.value)}
          />
          <Button type="submit">로그인하셈 메롱메롱</Button>
        </Form>
      </Container>
    </>
  );
};
export default Login;
