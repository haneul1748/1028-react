import {
  Board,
  BoardContent,
  Button,
  BoardOuter,
  BoardTitle,
  BoardWriter,
  Container,
  CreateDate,
  Title,
} from "../styles/styles";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BoardList = () => {
  const navi = useNavigate();
  const [page, setPage] = useState(0);
  const [boards, setBoards] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8081/boards?page=${page}`)
      .then((response) => {
        console.log(response);
        setBoards([...boards, ...response.data]);
        if (response.data.length < 3) {
          setHasMore(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page]);

  const increasePage = () => {
    setPage((page) => page + 1);
  };

  return (
    <Container>
      <Title>게시판</Title>
      <BoardOuter>
        <Button
          style={{ margin: "0", width: "100%" }}
          onClick={() => navi("/form")}
        >
          글쓰기
        </Button>
        <Board style={{ background: "lightpink" }}>
          <BoardTitle>글 번호</BoardTitle>
          <BoardTitle>글 제목</BoardTitle>
          <BoardWriter>작성자</BoardWriter>
          <CreateDate>작성일</CreateDate>
        </Board>
        {boards.map((board) => (
          <Board
            key={board.boardNo}
            onClick={() => navi(`/boards/${board.boardNo}`)}
          >
            <BoardWriter>{board.boardNo}</BoardWriter>
            <BoardTitle>{board.boardTitle}</BoardTitle>
            <BoardWriter>{board.boardWriter}</BoardWriter>
            <CreateDate>{board.createDate}</CreateDate>
          </Board>
        ))}
      </BoardOuter>
      {hasMore && (
        <Button style={{ background: "plum" }} onClick={increasePage}>
          더보기 버튼
        </Button>
      )}
    </Container>
  );
};

export default BoardList;
