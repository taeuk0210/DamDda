import { React, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainImageCarousel } from "components/common/ImageCarousel";
import { MultiCategoryComponent } from "components/common/MultiCategoryComponent";
import { ShortcutBoxComponent } from "components/common/ShortcutBoxComponent";
import { NewsSection } from "components/main/NewsSections";
import { ProjectRowComponent } from "components/common/ProjectRowComponent";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import StarIcon from "@mui/icons-material/Star";
import Box from "@mui/material/Box";
import axios from "axios";

import new_section_image1 from "assets/newSection_image_1.png";
import new_section_image2 from "assets/newSection_image_2.png";
import new_section_image3 from "assets/newSection_image_3.png";
import new_section_image4 from "assets/newSection_image_4.png";
import Banner2 from "assets/Banner2.png";
import { Layout } from "components/layout/DamDdaContainer"; // Layout 컴포넌트 import
import { useLocation } from "react-router-dom";
import { ADMIN_SERVER_URL } from "constants/URLs";

const cardData = [
  // 카드 데이터 설정
  {
    title: "펀딩 뉴스",
    description: "1억 목표 달성! 성공적인 펀딩 프로젝트의 비결을 확인하세요.",
    buttonText: "자세히 보기",
    imageUrl: new_section_image1,
  },
  {
    title: "프로모션",
    description: "최대 50% 할인! 지금 펀딩에 참여하고 특별 혜택을 누리세요.",
    buttonText: "자세히 보기",
    imageUrl: new_section_image2,
  },
  {
    title: "전통 문화 성공 사례",
    description: "혁신적인 아이디어로 3천만원 펀딩을 달성한 프로젝트 소개.",
    buttonText: "자세히 보기",
    imageUrl: new_section_image3,
  },
  {
    title: "K-POP 새로운 프로젝트",
    description: "최신 펀딩 프로젝트에 지금 참여하세요!",
    buttonText: "자세히 보기",
    imageUrl: new_section_image4,
  },
];

export function Main() {
  const location = useLocation();

  //////////////////////////////////
  const navigate = useNavigate();
  const [category, setCategory] = useState("전체 ");
  const isFirstRender = useRef(true); // 처음 렌더링 여부 추적
  const [search, setSearch] = useState("");

  const services = [
    {
      title: "협업하기",
      description: "함께 협업하고 성공적인 프로젝트를 만들어보세요.",
      icon: <InsertDriveFileIcon style={{ fontSize: 50, color: "white" }} />,
      backgroundColor: "#7a82ed",
    },
    {
      title: "프로젝트 등록하기",
      description: "새로운 프로젝트를 등록하고 펀딩을 시작하세요.",
      icon: <AddCircleOutlineIcon style={{ fontSize: 50, color: "white" }} />,
      backgroundColor: "#7a82ed",
    },
    {
      title: "인기 프로젝트 가기",
      description: "가장 인기 있는 프로젝트에 참여하고 후원하세요.",
      icon: <StarIcon style={{ fontSize: 50, color: "white" }} />,
      backgroundColor: "#edf1ff",
    },
  ];
  const CarouselStyle = {
    width: "1320px",
    height: "400px",
    marginTop: "100px",
    overflow: "hidden", // 부모 컨테이너에서 넘치는 부분 숨기기
    marginTop: "150px",
  };
  //////////////////////////////////

  //카테고리

  // cartegory 또는 search가 바뀔 때 실행되는 useEffect
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // 첫 렌더링 이후로는 false로 설정
      return;
    }

    const fetchData = () => {
      navigate(`/entire?category=${category}&search=${search}`);
    };

    fetchData();
  }, [category, search]); // 의존성 배열에 cartegory와 search 추가

  // useEffect(() => {
  //   if (isFirstRender.current) {
  //     // 처음 렌더링 시에는 실행되지 않도록 함
  //     isFirstRender.current = false;
  //     return;
  //   }

  //   // 이후 상태가 변경될 때만 navigate 호출
  //   navigate(`/entire?category=${category}&search=${search}`);
  // }, [category, search, navigate]);

  ///캐러샐 (OK)
  // 캐러셀 이미지 로드
  const [images, setImages] = useState([]);

  const fetchImage = async () => {
    try {
      const response = await axios.get(`${ADMIN_SERVER_URL}/files/carousels`);

      // 데이터 로그 찍기

      setImages(response.data);
    } catch (error) {
      console.error("이미지 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchImage();
  }, []);

  //////////////////////////////////

  return (
    <Layout>
      <Box
        key={location.pathname + location.state?.forceReload}
        sx={{
          margin: "0 auto",
          maxWidth: "1350px",
          // minWidth: '600px',
        }}
      >
        <MainImageCarousel images={images} style={CarouselStyle} />{" "}
        {/* 상태를 props로 전달 */}
        <MultiCategoryComponent setCategory={setCategory} />
        <ProjectRowComponent
          sortCondition={"likeCnt"}
          title={"인기 프로젝트"}
          subTitle={"좋아요가 가장 많은 프로젝트"}
        />
        <ProjectRowComponent
          sortCondition={"targetFunding"}
          title={"최다 후원 프로젝트"}
          subTitle={"많은 사람들의 이유있는 후원! 후원금이 가장 많은 프로젝트!"}
        />
        <NewsSection cardData={cardData} />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "20px",
          }}
        >
          <img
            src={Banner2}
            alt="Banner"
            style={{
              maxWidth: "1820px",
              height: "220px",
              borderRadius: "20px",
              objectFit: "cover",
            }}
          />
        </div>
        <ProjectRowComponent
          sortCondition={"recommend"}
          title={"사용자 추천 프로젝트"}
          subTitle={"나에게 딱 맞는 프로젝트."}
        />
        <ProjectRowComponent
          sortCondition={"viewCnt"}
          title={"최다 조회 프로젝트"}
          subTitle={"많은 사람들이 구경한 프로젝트"}
        />
        <ProjectRowComponent
          sortCondition={"endDate"}
          title={"마감 임박 프로젝트"}
          subTitle={"마감임박! 마지막 기회 놓치지 말아요!"}
        />
        {/* <ShortcutBoxComponent services={services} /> */}
      </Box>
    </Layout>
  );
}
