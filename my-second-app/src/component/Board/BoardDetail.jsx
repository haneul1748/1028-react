import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import {
  BoardContent,
  BoardWriter,
  Container,
  ImageContainer,
  ImagePreview,
  Title,
  Form,
  Button
} from "../styles/styles";
import { AuthContext } from "../context/AuthContext";
import CommentForm from "../Comment/CommentForm";

const BoardDetail = () => {
  const { id } = useParams();
  //   alert(`모범시민 특 잘 찍어봄 : ${id}`);
  const navi = useNavigate();
  const [board, setBoard] = useState(null);
  const [load, isLoad] = useState(false);
  const [msg, setMsg] = useState("");
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`http://localhost:8081/boards/${id}`)
      .then((result) => {
        console.log(result);
        setBoard(result.data);
        isLoad(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const handleDelete = e => {
    e.preventDefault();
    if(confirm("진짜지울거임?")){
        axios.delete(`http://localhost:8081/boards/${id}`, {
            headers: {
                Authorization : `Bearer ${auth.accessToken}`
            }
        })
        .then(() => {
            setBoard({
                boardTitle : "삭제중입니다...",
                boardContent : "삭제중입니다.",
                boardWriter : "삭제중입니다."
            });
            setTimeout(() => {
                navi("/boards");
            }, 5000);
        });
    }
  }

  return (
    <>
      {!load ? (
        <Container>
          <Title
            style={{ width: "50%", margin: "auto", lightingColor: "640px" }}
          >
            게시글을 불러오는 중입니다.
          </Title>
        </Container>
      ) : (
        <Container>
          <Title>{board.boardTitle}</Title>
          <BoardWriter>작성자 : {board.boardWriter}</BoardWriter>
          <BoardContent>{board.boardContent}</BoardContent>
          {board.fileUrl ? (
            <ImageContainer>
              <ImagePreview src={board.fileUrl} alt="첨부이미지" />
            </ImageContainer>
          ) : (
            <div>이미지가 존재하지 않습니다.</div>
          )}
          <Form onSubmit={handleDelete}>
            {board.boardWriter === auth.memberId && (
                <>
                    <Button style={{ backhround:"purple"}}>수정하기</Button>
                    <Button style={{background:"crimson"}}>삭제하기</Button>
                </>
            )}
            
          </Form>
          <Button onClick={() => navi(-1)} style={{background : "blue"}}>뒤로가셈</Button>
        </Container>
      )}
      <CommentForm boardNo={id} />
    </>
  );
};

export default BoardDetail;
