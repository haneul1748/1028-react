import { StyledMoreButton, StyledTitle, StyledWrap } from "../Foods.styles";
import {
    StyledDescription,
    StyledMainImg,
    StyledOther,
    StyledMap,
} from "./Detail.styles";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Comments from "../Comment/Comments";

const Detail = () => {
    const { id } = useParams();
    const navi = useNavigate();
    // alert(id);
    const [food, setFood] = useState({
        title: "",
        img: "",
        description: "",
        usageTime: "",
        address: "",
        lat: "",
        lng: "",
    });
    const [load, isLoad] = useState(false); // 응답이 돌아왔나 안왔나
    const [content, setContent] = useState(""); // 사용자가 입력한 후기값 담을 상태
    const [success, isSuccess] = useState(false); // 댓글이 작성 될 때 마다 스위칭할 상태

    const contentHandler = (e) => {
        setContent(e.target.value);
    }
    
    const submitHandler = (e) => {
        e.preventDefault();

        if(content.trim() === '') {
            alert('내용을 입력해주세요!');
            return;
        }
        /* 이런저런 유효성 검사 */
        axios.post(`http://localhost/spring/api/comments`, {
            foodNo : id,
            content : content,
        }).then((result) => {
            console.log(result);
            setContent("");
            isSuccess((success) => !success);
        })
    }


    useEffect(() => {
        axios.get(`http://localhost/spring/api/busan/detail/${id}`)
            .then((result) => {
                // console.log(result);
                const response = result.data.getFoodKr.item[0];
                // console.log(response);
                setFood({
                    title: response.MAIN_TITLE,
                    img: response.MAIN_IMG_NORMAL,
                    description: response.ITEMCTNTS,
                    usageTime: response.USAGE_DAY_WEEK_AND_TIME,
                    address: response.ADDR1,
                    lat: response.LAT,
                    lng: response.LNG,
                });

                setTimeout(isLoad(true), 10000);

                if (food.lat) {
                    const lat = parseFloat(food.lat);
                    const lng = parseFloat(food.lng);

                    var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
                        mapOption = {
                            center: new kakao.maps.LatLng(lat, lng), // 지도의 중심좌표
                            level: 3 // 지도의 확대 레벨
                        };

                    var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

                    // 지도를 클릭한 위치에 표출할 마커입니다
                    var marker = new kakao.maps.Marker({
                        // 지도 중심좌표에 마커를 생성합니다 
                        position: map.getCenter()
                    });
                    // 지도에 마커를 표시합니다
                    marker.setMap(map);
                }
            });
    }, [food.lat]);

    if (!load) {
        return (
            <StyledWrap>
                <StyledTitle>음식점을 조회중이오니... 기다리시오.</StyledTitle>
            </StyledWrap>
        )
    };

    return (
        <>
            <StyledWrap>
                <StyledTitle>{food.title}</StyledTitle>
                <StyledMainImg src={food.img} />
                <StyledDescription>{food.description}</StyledDescription>
                <StyledOther>{food.address}</StyledOther>
                <StyledOther>{food.usageTime}</StyledOther>
                <StyledMap id="map"></StyledMap>
                <StyledMoreButton onClick={() => navi(-1)}>뒤로가기</StyledMoreButton>
            </StyledWrap>
            <div style={{width:"50%", margin:"0 auto", height:"60px"}}>
                <form onSubmit={submitHandler}>
                    <input type="text" placeholder="후기를 남겨주세요." onChange={contentHandler}/>
                    <button>후기 넘기기</button>
                </form>
            </div>
            <>
                <Comments id={id} success={success}/>
            </>
        </>
    );
};
export default Detail;