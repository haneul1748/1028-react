import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  Form,
  Button,
  Container,
  Input,
  Title,
  Tabs,
  Tab,
} from "../../styles/styles";
import ChangePassword from "./ChangePassword";
import DeleteMember from "./DeleteMember";

const Info = () => {
  const { auth } = useContext(AuthContext);
  const navi = useNavigate();
  const [active, setActive] = useState(true);
  
  const handleToggle = () => {
    setActive((active) => !active);
  };

  useEffect(() => {
    if (!auth.isAuthenticated) {
      alert("로그인을 먼저 해주십시오.");
      navi("/login");
    }
  }, []);

  return (
    <>
      <Container>
        <Form>
          <Title>{active ? "비밀번호 변경" : "회원 탈퇴 " }</Title>

          <Tabs>
            <Tab onClick={handleToggle}>다른 메뉴 보기</Tab>
          </Tabs>

          <Input type="text" value={auth.memberId} readOnly />
          <Input type="text" value={auth.memberName} readOnly />

          {active ? <ChangePassword /> : <DeleteMember /> }

          <Button onClick={() => navi(-1)}>뒤로가기</Button>
        </Form>
      </Container>
    </>
  );
};

export default Info;
