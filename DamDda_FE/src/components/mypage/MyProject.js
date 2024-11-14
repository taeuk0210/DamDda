import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  LinearProgress,
} from "@mui/material";
import { ProductCard } from "components/common/ProjectCard";
// import StatusButton from './StatusButton';
import axios from "axios"; // 나중에 백엔드 연결 시 주석 해제
import { useUser } from "UserContext";
import Cookies from "js-cookie";
import { SERVER_URL } from "constants/URLs";

// Myproject 컴포넌트
export const Myproject = ({ setClickMyproject }) => {
  const { user } = useUser();
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [projectList, setProjectList] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0); // 서버에서 가져온 프로젝트 데이터
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수

  const itemsPerPage = 10; // 페이지당 항목 수

  const fetchProducts = async (page) => {
    try {
      const response = await axios.get(`${SERVER_URL}/project/myproject`, {
        params: {
          page: page,
          size: itemsPerPage,
        },
        headers: {
          ...(Cookies.get("accessToken") && {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          }),
        },
      });

      if (response.data.dtoList !== null) {
        setProjectList(response.data.dtoList); // 서버에서 받은 프로젝트 리스트
      } else {
        setProjectList([]); // 서버에서 받은 프로젝트 리스트
      }
      setTotalPages(Math.ceil(response.data.total / itemsPerPage)); // 전체 페이지 수 업데이트
      setTotalProducts(response.data.total);
    } catch (error) {
      console.error("프로젝트 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  // 처음 마운트되었을 때 및 페이지 변경 시 데이터 가져오기
  useEffect(() => {
    fetchProducts(currentPage);
  }, []);

  const displayedProducts = projectList;

  // 페이지 번호 배열 생성
  const generatePageNumbers = (currentPage, totalPages) => {
    // 현재 페이지가 속한 10 단위의 시작 페이지와 끝 페이지 계산
    const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
    const endPage = Math.min(startPage + 9, totalPages); // 마지막 페이지가 totalPages를 넘지 않게

    // startPage부터 endPage까지 페이지 번호 배열 생성
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };
  const pageNumbers = generatePageNumbers(currentPage, totalPages);

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

  return (
    <Box
      sx={{
        margin: "0 auto",
        padding: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: "100%",
        width: "1600px",
      }}
    >
      <Grid
        container
        width="100%"
        justifyContent="flex-start"
        alignItems="center"
        spacing={4}
        sx={{ flexGrow: 1 }}
      >
        {displayedProducts.map((product) => (
          <Grid
            item
            key={product.id}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2.4}
            display="flex"
            justifyContent="center"
          >
            <div
              onClick={(event) => {
                setClickMyproject(product.id); // 부모 요소에서만 처리
              }}
            >
              <div
                style={{
                  // margin:"10px 1px",
                  display: "flex",
                  justifyContent: "flex-start", // 버튼을 오른쪽으로 정렬
                  alignItems: "center", // 수직 중앙 정렬 (필요시)
                }}
              >
                <Button
                  sx={{
                    //   backgroundColor: params.row.approval === "거절" ? "red" : "#4caf50",
                    backgroundColor:
                      product.approval === 1
                        ? "#C8E6C9"
                        : product.approval === 2
                          ? "#FFCDD2"
                          : "#E0E0E0", // 파스텔 톤 배경색
                    color:
                      product.approval === 1
                        ? "#2E7D32"
                        : product.approval === 2
                          ? "#D32F2F"
                          : "#000000", // 글씨 색
                    border:
                      product.approval === 1
                        ? "2px solid #C8E6C9"
                        : product.approval === 2
                          ? "2px solid #FFCDD2"
                          : "2px solid #E0E0E0", // 테두리 배경색과 동일
                    borderRadius: "50px",
                    width: "70px",
                    padding: "2px 10px", // 버튼 내부 패딩 줄임
                    fontSize: "12px", // 텍스트 크기 줄임
                    minWidth: "50px", // 버튼의 최소 너비를 줄임
                    height: "30px", // 버튼 높이를 줄임
                  }}
                >
                  {product.approval === 0
                    ? "승인대기"
                    : product.approval === 1
                      ? "승인"
                      : "거절"}
                </Button>
              </div>
              <div
                style={{ pointerEvents: "none" }} // 클릭 이벤트 차단
              >
                <ProductCard product={product} />
              </div>
            </div>
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
              variant={currentPage === pageNumber ? "contained" : "outlined"}
              sx={{
                mx: 1.0,
                minWidth: 40,
                minHeight: 40,
                fontSize: "0.8rem",
              }}
            >
              {pageNumber}
            </Button>
          ))}
        </Box>

        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
          다음
        </Button>

        <Button onClick={handleEndPage} disabled={currentPage === totalPages}>
          끝으로
        </Button>
      </Box>
    </Box>
  );
};
