import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CommentAuthor, CommentContainer, CommentContent, CommentDate, CommentItem } from "../styles/styles";

const CommentList = ({ boardNo, success }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8081/comments?boardNo=${boardNo}`)
      .then((result) => {
        setComments([...result.data]);
      });
  }, [success]);
  return (
    <CommentContainer>
        {comments.length === 0 ? (
            <CommentItem>
                <CommentAuthor>댓글이</CommentAuthor>
                <CommentContent>하나도</CommentContent>
                <CommentDate>없어용</CommentDate>
            </CommentItem>
        ) : (
            comments.map(comment => {
                return(
                    <CommentItem>
                        <CommentAuthor>{comment.commentWriter}</CommentAuthor>
                        <CommentContent>{comment.commentContent}</CommentContent>
                        <CommentDate>{comment.createDate}</CommentDate>
                    </CommentItem>
                );
            })

        )} 


    </CommentContainer>
  );
};

export default CommentList;
