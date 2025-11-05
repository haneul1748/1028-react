import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  ImageContainer,
  ImagePreview,
  Form,
  Title,
  Label,
  Input,
} from "../styles/styles";
import axios from "axios";

const BoardForm = () => {
  const [boardTitle, setBoardTitle] = useState("");
  const [boardContent, setBoardContent] = useState("");
  const [file, setFile] = useState(null);
  const { auth } = useContext(AuthContext);
  const navi = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      alert("로그인하세요.");
      navi("/login");
    }
  }, [auth.isAuthenticated]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    // console.log(selectedFile);
    const allowTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
    const maxSize = 1024 * 1024 * 10;

    if (!selectedFile && !allowTypes.includes(selectedFile.type)) {
      alert("이미지만 올려주세요 확장자는 jpg등등 이런거만 가능합니다.");
      return;
    }

    if (!selectedFile && !selectedFile.size > maxSize) {
      alert("너무 용량이 커요 크기좀 줄여주세요.");
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!boardContent.trim() || !boardTitle.trim()) {
      alert("제목 및 내용은 꼭 입력 부탁드려요.");
      return;
    }
    const formData = new FormData();
    formData.append("boardTitle", boardTitle);
    formData.append("boardContent", boardContent);
    if (file) {
      formData.append("file", file);
    }

    axios
      .post("http://localhost:8081/boards", formData, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((result) => {
        // console.log(result);
        if (result.status === 201) {
            alert("성공~!");
            navi("/boards");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>게시글 써보기</Title>

        <Label>제목</Label>
        <Input
          type="text"
          placeholder="제목쓰셈."
          onChange={(e) => setBoardTitle(e.target.value)}
        />
        <Label>내용</Label>
        <Input
          type="text"
          placeholder="내용쓰셈 ㅋ"
          onChange={(e) => setBoardContent(e.target.value)}
        />
        <Label>작성자</Label>
        <Input
          type="text"
          value={auth.memberName}
          readOnly
          style={{ background: "lightpink", fontWeight: "bold" }}
        />
        <Label>파일첨부</Label>
        <Input type="file" accept="image/" onChange={handleFileChange} />
        <ImageContainer>
          <ImagePreview src="" alt="미리보기" />
        </ImageContainer>
        <Button>작성하기</Button>
      </Form>
    </Container>
  );
};

export default BoardForm;
