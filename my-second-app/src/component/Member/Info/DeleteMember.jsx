import { Button, Input } from "../../styles/styles";
import axios from "axios";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const DeleteMember = () => {
  const [password, setPassword] = useState("");
  const { auth, logout } = useContext(AuthContext);
  const navi = useNavigate();

  const handleDelete = () => {
    axios
      .delete("http://localhost:8081/members", {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
        data: {
          password: password,
        },
      })
      .then((result) => {
        console.log(result);
        logout();
        navi("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <Input
        type="text"
        placeholder="비밀번호를 입력해주세요."
        required
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <Button onClick={handleDelete} type="button">
        탈퇴하기
      </Button>
    </>
  );
};

export default DeleteMember;
