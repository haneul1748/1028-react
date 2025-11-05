import { Button, Input } from "../../styles/styles";
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { auth } = useContext(AuthContext);
  const [error, setError] = useState("");

  const handleUpdatePassword = () => {
    axios
      .put(
        "http://localhost:8081/members",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      )
      .then((result) => {
        // console.log(result);
        if (result.status === 201) {
          alert("비밀번호 변경에 성공하였습니다!");
        }
      })
      .catch((err) => {
        // console.log(err);
        setError(
          err?.response.data["error-message"] || "비밀 번호 변경 중 문제 발생"
        );
      });
  };

  return (
    <>
      <Input
        type="password"
        placeholder="현재 비밀번호를 입력해주세요."
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <Input
        type="password"
        placeholder="변경할 비밀번호를 입력해주세요."
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <label style={{ color: "crimson", padding: "5px" }}>{error}</label>
      <Button
        type="button"
        style={{ background: "skyblue" }}
        onClick={handleUpdatePassword}
      >
        비밀번호 변경하기
      </Button>
    </>
  );
};

export default ChangePassword;
