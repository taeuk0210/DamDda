import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useUser } from "UserContext";
import { ProductCard } from "./ProjectCard";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { SERVER_URL } from "constants/URLs";
import { useNavigate } from "react-router-dom";

export const ProjectRowComponent = ({ sortCondition, title, subTitle }) => {
  const { user, isLogin } = useUser();
  const [products, setProducts] = useState([]);
  const scrollContainerRef = useRef(null);
  const itemsPerPage = 10;

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/project/projects`, {
        params: {
          page: 1,
          sort: sortCondition,
          size: itemsPerPage,
        },
        headers: {
          ...(Cookies.get("accessToken") && {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          }),
        },
      });

      setProducts(response.data.dtoList || []);
    } catch (error) {
      console.error("프로젝트 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleLike = async (project) => {
    if (isLogin) {
      try {
        // 타입 및 값 확인

        const accessToken = Cookies.get("accessToken");
        const headers = {
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        };

        const url = `${SERVER_URL}/project/like`;

        if (project.liked) {
          const response = await axios.delete(url, {
            headers,
            params: { projectId: project.id }, // DELETE 요청 시 params 사용
          });
        } else {
          const response = await axios.post(url, null, {
            headers,
            params: { projectId: project.id }, // POST 요청 시 params 사용
          });
        }

        // UI 업데이트
        setProducts((prevProjects) =>
          prevProjects.map((prevProject) =>
            prevProject.id === project.id
              ? { ...prevProject, liked: !prevProject.liked }
              : prevProject
          )
        );
      } catch (error) {
        console.error("좋아요 요청 중 오류 발생:", error);
      }
    } else {
      alert("로그인 후 이용이 가능합니다.");
    }
  };

  const handleScroll = (direction) => {
    const scrollAmount = 745;
    if (direction === "left") {
      scrollContainerRef.current.scrollLeft -= scrollAmount;
    } else {
      scrollContainerRef.current.scrollLeft += scrollAmount;
    }
  };

  return (
    <Box
      sx={{
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        minWidth: "600px",
        width: "105%",
        marginTop: 5,
      }}
    >
      <Box
        sx={{
          margin: "0 auto",
          padding: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
          <p className="text">
            <span className="text-wrapper">[담ː따] 의 </span>
            <span className="span">{title}</span>
          </p>
          <Typography variant="body2" color="text.secondary">
            {subTitle}
          </Typography>
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "flex-start",
        }}
      >
        <IconButton
          onClick={() => handleScroll("left")}
          sx={{ marginRight: "10px" }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>

        <Box
          sx={{
            display: "flex",
            overflowX: "hidden",
            scrollBehavior: "smooth",
            width: "87.5%",
          }}
          ref={scrollContainerRef}
        >
          {products.map((product) => (
            <Box key={product.id}>
              <ProductCard
                key={product.id}
                product={product}
                handleLike={handleLike}
              />
            </Box>
          ))}
        </Box>

        <IconButton
          onClick={() => handleScroll("right")}
          sx={{ marginLeft: "10px" }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

///entire 추천에서 가져와서 써야함
// export const EntireProjectRowComponent = ({ search, category }) => {

//   // return (
//   //   <>
//   //     {/* 타이틀과 서브타이틀 부분 */}
//   //     <Box
//   //       sx={{
//   //         margin: "0 auto",

//   //         display: "flex",
//   //         flexDirection: "column",
//   //         flexWrap: "nowrap",
//   //         alignItems: "center",
//   //         justifyContent: "center",

//   //         padding: 0,
//   //         // height: 20,
//   //         width: "80%",
//   //         // minWidth: '600px',

//   //         marginTop: 1,
//   //       }}
//   //     >
//   //       <Box
//   //         sx={{
//   //           margin: "0 auto",
//   //           padding: 2,
//   //           display: "flex",
//   //           flexDirection: "column",
//   //           flexWrap: "nowrap",
//   //           justifyContent: "flex-start",
//   //           alignItems: "flex-start",
//   //           width: "100%",
//   //         }}
//   //       >
//   //         <Typography
//   //           variant="h5"
//   //           component="div"
//   //           sx={{ fontWeight: "bold", mb: 1 }}
//   //         >
//   //           <p className="text">
//   //             <span className="text-wrapper">[담ː따] 의 </span>
//   //             <span className="span">{title}</span>
//   //           </p>{" "}
//   //           <Typography variant="body2" color="text.secondary">
//   //             {subTitle}
//   //           </Typography>
//   //         </Typography>
//   //       </Box>

//   //       {/* 상품 카드 그리드 */}
//   //       <Box
//   //         sx={{
//   //           display: "flex",
//   //           flexDirection: "row",
//   //           justifyContent: "space-between",
//   //           alignItems: "center",
//   //           width: "100%",
//   //           height: "auto",
//   //         }}
//   //       >

//   //         {/* 왼쪽 화살표 */}
//   //         <IconButton
//   //           onClick={() => handleScroll("left")}
//   //           sx={{ marginRight: "10px" }}
//   //         >
//   //           <ArrowBackIosNewIcon />
//   //         </IconButton>

//   //         {/* 카드들을 감싸는 박스 */}
//   //         <Box
//   //           sx={{
//   //             display: "flex",
//   //             overflowX: "hidden", // 스크롤 감추기
//   //             scrollBehavior: "smooth", // 스크롤 부드럽게
//   //             maxWidth: "90%", // 한 줄로 제한
//   //             width: "90%",
//   //           }}
//   //           ref={scrollContainerRef}
//   //         >
//   //           {products.map((product) => (
//   //             <Box
//   //               key={product.id}
//   //             >
//   //               <ProductCard product={product} handleLike={handleLike} />
//   //             </Box>

//   //           ))}
//   //         </Box>

//   //         {/* 오른쪽 화살표 */}
//   //         <IconButton
//   //           onClick={() => handleScroll("right")}
//   //           sx={{ marginLeft: "10px" }}
//   //         >
//   //           <ArrowForwardIosIcon />
//   //         </IconButton>
//   //       </Box>
//   //     </Box>
//   //   </>
//   // );
// };
