import React, { useState, useEffect, memo } from "react";
import {
  Typography,
  IconButton,
  Box,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import axios from "axios";
import Cookies from "js-cookie";
import { SERVER_URL } from "constants/URLs";
import { BlueBorderButtonComponent } from "components/common/ButtonComponent";

// Custom Table Row Component
const CustomTableRow = memo(({ row }) => {
  const [open, setOpen] = useState(false);

  console.log("Rendering CustomTableRow:", row); // Row 데이터 확인

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { border: "unset" } }}>
        <TableCell style={{ width: "50px" }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              setOpen(!open);
              console.log("Row toggled:", open); // Row 토글 상태 확인
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {row["후원번호"] || "N/A"}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {row["이름"] || "N/A"}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {row["후원일시"] ? new Date(row["후원일시"]).toLocaleString() : "N/A"}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                margin: 1,
                display: "flex",
                flexDirection: "column",
                gap: 3,
                margin: "20px",
              }}
            >
              <Typography variant="body1">
                <strong style={{ fontSize: "18px" }}>패키지 이름 : </strong>
                {row["패키지 이름"] || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong style={{ fontSize: "18px" }}>패키지 가격 : </strong>
                {row["패키지 가격"] || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong style={{ fontSize: "18px" }}>패키지 개수 : </strong>
                {row["패키지 개수"] || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong style={{ fontSize: "18px" }}>
                  패키지 옵션 정보 :{" "}
                </strong>
                {row["패키지 옵션 정보"] || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong style={{ fontSize: "18px" }}>전화번호 : </strong>
                {row["전화번호"] || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong style={{ fontSize: "18px" }}>주소 : </strong>
                {row["주소"] || "N/A"} / {row["상세주소"] || "N/A"} /{" "}
                {row["우편번호"] || "N/A"}
              </Typography>

              <Typography variant="body1">
                <strong style={{ fontSize: "18px" }}>배송 요청 사항 : </strong>
                {row["배송 메시지"] || "N/A"}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
});

// Sponsor Table Component
export const SponsorTable = ({ projectId }) => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("SponsorTable rendered with projectId:", projectId); // 초기 렌더링 확인

  const fetchOrders = async () => {
    console.log(`Fetching orders for projectId: ${projectId}`); // API 호출 시작
    try {
      const response = await axios.get(
        `${SERVER_URL}/order/${projectId}/supporters`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      console.log("Orders fetched:", response.data); // API 응답 데이터 확인
      setOrders(response.data);
    } catch (err) {
      console.error("Error fetching orders:", err); // 오류 발생 시 로그
      setError("주문 정보를 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false); // 로딩 상태 변경
    }
  };

  const downloadFile = async (projectId) => {
    console.log("Downloading file for project:", projectId); // 다운로드 시작
    try {
      const response = await axios.get(
        `${SERVER_URL}/order/${projectId}/supporters/excel`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      const presignedUrl = response.data;
      console.log("Presigned URL received:", presignedUrl); // URL 확인

      const link = document.createElement("a");
      link.href = presignedUrl;
      link.setAttribute("download", "supporters_list.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Excel download failed:", error); // 오류 발생 시 로그
      alert("엑셀 파일 다운로드에 실패했습니다.");
    }
  };

  useEffect(() => {
    console.log("useEffect triggered. Fetching orders..."); // useEffect 확인
    fetchOrders();
  }, []);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Box
        style={{ display: "flex", justifyContent: "flex-end", width: "160px" }}
      >
        <BlueBorderButtonComponent
          text="엑셀 다운로드"
          onClick={() => downloadFile(projectId)}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow sx={{ "& > *": { border: "none" } }}>
              <TableCell />
              <TableCell
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                후원번호
              </TableCell>
              <TableCell
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                이름
              </TableCell>
              <TableCell
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                후원일시
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, index) => (
              <CustomTableRow key={index} row={order} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
