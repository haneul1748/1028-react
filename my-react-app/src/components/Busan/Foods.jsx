import { StyledCard, StyledImg, StyledInnerWrap, StyledMoreButton, StyledStoreName, StyledTitle, StyledWrap } from "./Foods.styles";
import { useEffect, useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";

const Foods = () => {
    // 무슨 코드를 작성해야하나? => 스프링서버로 요청을 보내는 코드 
    const [pageNo, setPageNo] = useState(1);
    const [hasMore, setHasMore] = useState(true); // 식당이 더있는가?
    const [foods, setFoods] = useState([]);
    const navi = useNavigate();

    useEffect(() => {
        /*
        fetch('http://localhost/spring/api/busan?pageNo=1')
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((err) => console.log("문제발생",err))
        .finally(console.log("얘는 무조건함"));
        */
        /*
        axios({
         url : "http://localhost/spring/api/busan?pageNo=1",
         method : "get",
        }).then((result) => console.log(result));
        */
        axios.get(`http://localhost/api/busan?pageNo=${pageNo}`)
            .then((result) => {
                //console.log("응답잘오나~");
                //console.log(result);
                const response = result.data.getFoodKr.item;
                console.log(response);
                setFoods([...foods, ...response]);
                console.log(foods);
                if(response.length < 6) {
                    setHasMore(false);
                }
            });
    }, [pageNo]);

    const buttonHandler = () => {
        setPageNo((pageNo) => pageNo + 1);
    };


    return (
        <>
            <StyledWrap>
                <StyledTitle>부산의 맛집 알아보기</StyledTitle>
                <StyledInnerWrap>
                    {foods.length == 0 ?

                        <div>
                            <StyledCard></StyledCard>
                            <StyledCard></StyledCard>
                            <StyledCard></StyledCard>
                            <StyledCard></StyledCard>
                            <StyledCard></StyledCard>
                            <StyledCard></StyledCard>
                        </div>
                        :
                        foods.map(e => {
                            return (
                                <StyledCard key={e.MAIN_TITLE}
                                onClick={() => navi(`/foods/${e.UC_SEQ}`)}>
                                    <StyledImg src={e.MAIN_IMG_THUMB} />
                                    <br />
                                    <StyledStoreName>{e.MAIN_TITLE}</StyledStoreName>
                                </StyledCard>
                            );
                        })
                    }
                </StyledInnerWrap>
                {hasMore && (
                <StyledMoreButton onClick={buttonHandler}>
                    더보기 ▽
                </StyledMoreButton>
                )}
            </StyledWrap>
        </>
    );
};

export default Foods;