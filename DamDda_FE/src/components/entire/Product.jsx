import React from "react";
import {
  Box,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios"; // axios를 사용하여 REST API 호출
import { useState, useEffect } from "react";
import { useUser } from "UserContext";
import Cookies from "js-cookie";
import { SERVER_URL } from "constants/URLs";
import { ProductCard } from "components/common/ProjectCard";
import { ProjectRowComponent } from "components/common/ProjectRowComponent";

// Product recommendations section
export const ProductRecommendations = ({ search, cartegory }) => {
  // const { user } = useUser();

  const { user } = useUser();
  // if(!isLogin){
  //
  //   //setUser(prevUser => ({ ...prevUser, key: 0 }));
  // }

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지

  const [products, setProducts] = useState([]); // 서버에서 가져온 프로젝트 데이터
  const [totalProductNum, setTotalProductNum] = useState(0); // 서버에서 가져온 프로젝트 데이터
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수

  const [recommendedProducts, setRecommendedProducts] = useState([]); // 서버에서 가져온 프로젝트 데이터

  const [progress, setProgress] = useState("all"); // progress 상태 관리

  const [sortCondition, setSortCondition] = useState("all");

  const itemsPerPage = 40; // 페이지당 항목 수
  const recommendedItemPerPage = 5; //에디터 추천도 동일하게 있어야 할 듯

  // 페이지네이션 요청을 보내는 함수
  const fetchProducts = async (
    page,
    progress,
    sortCondition,
    cartegory,
    search
  ) => {
    try {
      const response = await axios.get(` ${SERVER_URL}/project/projects`, {
        headers: {
          ...(Cookies.get("accessToken") && {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          }),
        },

        params: {
          search: search,
          category: cartegory,
          sort: sortCondition,
          page: page,
          size: itemsPerPage,
          progress: progress, // 진행 상태 필터 적용
        },
      });

      if (response.data.dtoList !== null) {
        setProducts(response.data.dtoList); // 서버에서 받은 프로젝트 리스트
      } else {
        setProducts([]); // 서버에서 받은 프로젝트 리스트
      }
      setTotalPages(Math.ceil(response.data.total / itemsPerPage)); // 전체 페이지 수 업데이트
      setTotalProductNum(response.data.total);
    } catch (error) {
      console.error("프로젝트 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  // const fetchRecommendedProducts = async (page, progress) => {
  //   try {
  //     const response = await axios.get(` ${SERVER_URL}/api/projects/projects`, {
  //       headers: {
  //         ...(Cookies.get("accessToken") && {
  //           Authorization: `Bearer ${Cookies.get("accessToken")}`,
  //         }),
  //       },

  //       params: {
  //         page: page,
  //         sort: "recommend",
  //         // memberId: user.key,
  //         size: recommendedItemPerPage,
  //         progress: progress, // 진행 상태 필터 적용
  //       },
  //     });

  //     if (response.data.dtoList !== null) {
  //       setRecommendedProducts(response.data.dtoList); // 서버에서 받은 프로젝트 리스트
  //     } else {
  //       setRecommendedProducts([]); // 서버에서 받은 프로젝트 리스트
  //     }
  //   } catch (error) {
  //     console.error("추천 프로젝트 데이터를 가져오는 중 오류 발생:", error);
  //   }
  // };

  // 처음 마운트되었을 때 및 페이지 변경 시 데이터 가져오기
  useEffect(() => {
    fetchProducts(currentPage, progress, sortCondition, cartegory, search);
    // fetchRecommendedProducts(
    //   currentPage,
    //   progress,
    //   sortCondition,
    //   cartegory,
    //   search
    // );
  }, [currentPage, progress, sortCondition, cartegory, search]);

  // 클릭 핸들러
  const handleClick = (value) => {
    setProgress(value); // 클릭한 버튼에 따라 상태 변경
    setCurrentPage(1); // 새로운 필터로 처음 페이지부터 시작
  };

  const halfIndex = Math.ceil(products.length / 2); // 절반 인덱스 계산
  const firstHalf = products.slice(0, 20); // 첫 번째 절반
  const secondHalf = products.slice(20); // 두 번째 절반

  // 페이지 번호 배열 생성
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // 처음 페이지로 이동
  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  // 이전 페이지로 이동
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 다음 페이지로 이동
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 끝 페이지로 이동
  const handleEndPage = () => {
    setCurrentPage(totalPages);
  };

  const handleSortChange = (e) => {
    setSortCondition(e.target.value);
  };

  // 좋아요 요청을 처리하는 함수
  const handleLike = async (project) => {
    try {
      if (project.liked) {
        // liked가 true이면 DELETE 요청
        const response = await axios.delete(`${SERVER_URL}/project/like`, {
          headers: {
            ...(Cookies.get("accessToken") && {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            }),
          },
          params: {
            // memberId: user.key,
            projectId: project.id,
          },
        });
      } else {
        // liked가 false이면 POST 요청
        const response = await axios.post(`${SERVER_URL}/project/like`, null, {
          headers: {
            ...(Cookies.get("accessToken") && {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            }),
          },
          params: {
            // memberId: user.key,
            projectId: project.id,
          },
        });
      }

      // fetchProducts(currentPage, progress);
      // fetchRecommendedProducts(currentPage, progress)

      // 이후에 필요한 처리 (예: UI 업데이트)
      setProducts((prevProjects) =>
        prevProjects.map((prevProject) =>
          prevProject.id === project.id
            ? { ...prevProject, liked: !prevProject.liked }
            : prevProject
        )
      );
      // 이후에 필요한 처리 (예: UI 업데이트)
      setRecommendedProducts((prevProjects) =>
        prevProjects.map((prevProject) =>
          prevProject.id === project.id
            ? { ...prevProject, liked: !prevProject.liked }
            : prevProject
        )
      );
    } catch (error) {
      console.error("좋아요 요청 중 오류 발생:", error);
    }
  };

  return (
    <>
      <Box
        sx={{
          margin: "0 auto",
          padding: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "1800px",
          maxWidth: "100%",
        }}
      >
        {/* Title section similar to the example image */}

        {/* 상품 카드 그리드 */}
        <Box
          sx={{
            margin: "0 auto",
            padding: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "1600px",
            maxWidth: "100%",
          }}
        >
          {/* 중간 텍스트 */}
          <Box
            sx={{
              paddingLeft: 2, // 왼쪽으로 살짝 이동 (2는 16px)
              textAlign: "left",
              fontSize: "0.875rem", // 글씨 크기 조정 (1rem = 16px -> 0.875rem = 14px)
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between", // 요소들을 좌우로 배치
                alignItems: "center", // 수직 가운데 정렬
                width: "100%", // 컨테이너 너비를 100%로 설정
                marginBottom: 2, // 아래쪽 여백
              }}
            >
              {/* 좌측 타이틀 */}
              <Box>
                <h2 style={{ fontSize: "1.7rem", marginBottom: 20 }}>
                  {cartegory} 프로젝트
                </h2>
                <h4 style={{ fontSize: "1.1rem", margin: 5, marginBottom: 20 }}>
                  {totalProductNum}개의 프로젝트가 있습니다.
                </h4>
              </Box>

              {/* 우측 드롭다운 (정렬 기준) */}
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="sort-select-label">정렬 기준</InputLabel>
                <Select
                  labelId="sort-select-label"
                  id="sort-select"
                  value={sortCondition} // 현재 선택된 정렬 조건
                  label="정렬 기준"
                  onChange={handleSortChange} // 선택 시 호출
                >
                  <MenuItem value="all">----------</MenuItem>
                  <MenuItem value="fundsReceive">달성률순</MenuItem>
                  <MenuItem value="endDate">마감 임박순</MenuItem>
                  <MenuItem value="viewCnt">최다 조회순</MenuItem>
                  <MenuItem value="createdAt">등록순</MenuItem>
                  <MenuItem value="targetFunding">최다 후원금액순</MenuItem>
                  <MenuItem value="supporterCnt">최대 후원자순</MenuItem>
                  <MenuItem value="likeCnt">좋아요순</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box
              sx={{
                marginBottom: 3, // 아래쪽 여백
              }}
            >
              {/* 전체 프로젝트 버튼 */}
              <Button
                onClick={() => handleClick("all")}
                variant={progress === "all" ? "contained" : "outlined"} // 상태에 따라 variant 변경
                // color="secondary"
                size="small"
                sx={{
                  // backgroundColor: progress === "all" ? "#5a87f7" : "transparent", // 배경색도 동적으로
                  borderRadius: "12px",
                  fontSize: "0.75rem",
                  marginRight: "20px",
                }}
              >
                전체 프로젝트
              </Button>

              {/* 진행중인 프로젝트 버튼 */}
              <Button
                onClick={() => handleClick("ongoing")}
                variant={progress === "ongoing" ? "contained" : "outlined"} // 상태에 따라 variant 변경
                // color="secondary"
                size="small"
                sx={{
                  // backgroundColor: progress === "progress" ? "#5a87f7" : "transparent", // 배경색도 동적으로
                  borderRadius: "12px",
                  fontSize: "0.75rem",
                  marginRight: "20px",
                }}
              >
                진행중인 프로젝트
              </Button>

              {/* 종료된 프로젝트 버튼 */}
              <Button
                onClick={() => handleClick("completed")}
                variant={progress === "completed" ? "contained" : "outlined"} // 상태에 따라 variant 변경
                // color="secondary"
                size="small"
                sx={{
                  // backgroundColor: progress === "completed" ? "#5a87f7" : "transparent", // 배경색도 동적으로
                  borderRadius: "12px",
                  fontSize: "0.75rem",
                }}
              >
                종료된 프로젝트
              </Button>
            </Box>

            {/* 글씨 크기 줄이기 */}
          </Box>
          <Box
            sx={{
              // display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "auto",
            }}
          >
            <Grid container justifyContent="flex-start" sx={{ flexGrow: 0 }}>
              {firstHalf.map((product) => (
                <Grid
                  item
                  key={product.id}
                  // display="flex"
                  // wrap="wrap"
                  // justifyContent="flex-start"
                  margin="10px 18px"
                >
                  <ProductCard product={product} handleLike={handleLike} />
                </Grid>
              ))}
            </Grid>

            <ProjectRowComponent
              sortCondition={"recommend"}
              title={"사용자 추천 프로젝트"}
              subTitle={"나에게 딱 맞는 프로젝트."}
            />

            {/* 두 번째 카드 그룹 */}
            <Grid container justifyContent="flex-start" sx={{ flexGrow: 0 }}>
              {secondHalf.map((product) => (
                <Grid
                  item
                  key={product.id}
                  // display="flex"
                  // wrap="wrap"
                  // justifyContent="space-around"
                  margin="10px 18px"
                >
                  <ProductCard product={product} handleLike={handleLike} />
                </Grid>
              ))}
            </Grid>

            {/* 페이지네이션 버튼 */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 2,
              }}
            >
              <Button onClick={handleFirstPage} disabled={currentPage === 1}>
                처음으로
              </Button>

              <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                이전
              </Button>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 0,
                }}
              >
                {pageNumbers.map((pageNumber) => (
                  <Button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)} // 페이지 변경
                    variant={
                      currentPage === pageNumber ? "contained" : "outlined"
                    } // 현재 페이지 스타일
                    sx={{
                      mx: 1.0,
                      minWidth: 40, // 최소 너비
                      minHeight: 40, // 최소 높이
                      fontSize: "0.8rem", // 폰트 크기 조절
                    }} // 좌우 간격
                  >
                    {pageNumber}
                  </Button>
                ))}
              </Box>

              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                다음
              </Button>

              <Button
                onClick={handleEndPage}
                disabled={currentPage === totalPages}
              >
                끝으로
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};
