import { useState, useEffect } from "react";
import axios from "axios";

const Comments = (props) => {
    const [ comments, setComments] = useState([]);
    const id = props.id;
    console.log(`상위 컴포넌트가 넘겨준 : ${props.id}`);

    useEffect(() => {
        // 전체 후기를 싹다 조회할 예정이 아님
        axios.get(`http://localhost/api/comments/${id}`).then((result) => {
            // console.log(result);
            setComments([...result.data]);
        });
    }, [props.success, id]);
    
    return (
        <>
           { comments != [] ?
            comments.map((e) => {
                return (
                    <div style={{width : "1100px", margin:"auto"}} key={e.content}>
                        <hr />
                        <h4>{e.content}</h4>
                        <h5>{e.createDate}</h5>
                    </div>
                )
            })
            :
            <h2>아직 댓글이 존재하지 않습니다.</h2>
        }
        </>
    );
};

export default Comments;