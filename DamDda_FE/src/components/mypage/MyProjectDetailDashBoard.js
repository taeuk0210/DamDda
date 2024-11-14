import React, { useState, useEffect } from "react";
import {
  Typography,
  IconButton,
  Box,
  Tab,
  Tabs,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ProgressChart } from "components/mypage/ProgressChart";

import axios from "axios";
import Cookies from "js-cookie";
import { SERVER_URL } from "constants/URLs";

import { useUser } from "UserContext";

// 후원 통계
const mockSupportStat = {
  totalAmount: 80771500,
  percentage: 161.54,
  supporters: 708,
  remainingDays: 0,
};

const mockChartData = [
  ["2024-10-08T00:00:00", 103000],
  ["2024-10-09T00:00:00", 103000],
  ["2024-10-22T00:00:00", 103000],
  ["2024-11-01T00:00:00", 103000],
  ["2024-11-02T00:00:00", 103000],
  ["2024-11-05T00:00:00", 103000],
  ["2024-11-09T00:00:00", 103000],
  ["2024-11-10T00:00:00", 206000],
  ["2024-11-16T00:00:00", 103000],
];

const mockSupporterData = [
  {
    deliveryId: "123456",
    delivery: {
      deliveryName: "홍길동",
      deliveryPhoneNumber: "010-1234-5678",
      deliveryAddress: "경기도 광명시",
      deliveryDetailedAddress: "oo동",
      deliveryMessage: "배송 전 연락 주세요.",
    },
    supportedAt: "2024-09-07T11:30:00",
    item_name: "눌림 플레이트 2세트 + 미니 보냉백 1개",
    supportingProject: {
      supportingProjectId: "SP123456",
      supportedAt: "2024-09-07T11:30:00",
    },
    supportingPackage: {
      packageName: "기본 패키지",
    },
  },
  {
    deliveryId: "123457",
    delivery: {
      deliveryName: "김철수",
      deliveryPhoneNumber: "010-9876-5432",
      deliveryAddress: "서울특별시 강남구",
      deliveryDetailedAddress: "xx동",
      deliveryMessage: "배송 전에 전화 부탁드립니다.",
    },
    supportedAt: "2024-09-07T14:30:00",
    item_name: "세트 상품 1개",
    supportingProject: {
      supportingProjectId: "SP123457",
      supportedAt: "2024-09-07T14:30:00",
    },
    supportingPackage: {
      packageName: "프리미엄 패키지",
    },
  },
  {
    deliveryId: "123458",
    delivery: {
      deliveryName: "이영희",
      deliveryPhoneNumber: "010-1234-8765",
      deliveryAddress: "부산광역시 해운대구",
      deliveryDetailedAddress: "yy동",
      deliveryMessage: "시간 맞춰서 부탁해요.",
    },
    supportedAt: "2024-09-08T10:00:00",
    item_name: "텀블러 1개",
    supportingProject: {
      supportingProjectId: "SP123458",
      supportedAt: "2024-09-08T10:00:00",
    },
    supportingPackage: {
      packageName: "스타터 패키지",
    },
  },
];

const DetailContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "40px",
  textAlign: "center",
});

const DashboardSection = styled("div")({
  width: "100%",
  backgroundColor: "#f7f7f7",
  padding: "20px",
  borderRadius: "10px",
  marginTop: "40px",
  textAlign: "center",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
});

function CustomTableRow(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {row.supportingProject.supportingProjectId}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {row.delivery.deliveryName}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {new Date(row.supportingProject.supportedAt).toLocaleString()}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                margin: 3,
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <Typography variant="body1">
                <strong style={{ fontSize: "18px", padding: "25px" }}>
                  선물 정보
                </strong>
                {row.item_name}
              </Typography>
              <Typography variant="body1">
                <strong style={{ fontSize: "18px", padding: "25px" }}>
                  연락처
                </strong>
                {row.delivery.deliveryPhoneNumber}
              </Typography>
              <Typography variant="body1">
                <strong style={{ fontSize: "18px", padding: "25px" }}>
                  배송지 정보
                </strong>
                {row.delivery.deliveryAddress}{" "}
                {row.delivery.deliveryDetailedAddress}
              </Typography>
              <Typography variant="body1">
                <strong style={{ fontSize: "18px", padding: "25px" }}>
                  배송 요청 사항
                </strong>
                {row.delivery.deliveryMessage}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

// 후원자 정보 테이블 컴포넌트
function SupporterTable() {
  const [orders, setOrders] = useState(mockSupporterData); // 모든 주문 정보를 저장할 상태
  // const [orders, setOrders] = useState([]); // 모든 주문 정보를 저장할 상태
  const [error, setError] = useState(null); // 에러 상태 관리
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  // 주문 정보를 가져오는 함수
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/order/all`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      // 데이터 확인
      setOrders(response.data); // 가져온 주문 정보를 상태에 저장
      setLoading(false); // 로딩 완료
    } catch (err) {
      console.error(err); // 오류 확인
      setError("주문 정보를 가져오는 중 오류가 발생했습니다.");
      setLoading(false); // 로딩 완료
    }
  };

  // 컴포넌트가 마운트될 때 주문 정보 가져오기
  useEffect(() => {
    fetchOrders();
  }, []);
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
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
              주문자 이름
            </TableCell>
            <TableCell
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              후원 날짜
            </TableCell>

            {/* <TableCell>선물 정보</TableCell>
            <TableCell>연락처</TableCell>
            <TableCell>배송지 정보</TableCell>
            <TableCell>배송 요청 사항</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order, index) => (
            <CustomTableRow key={index} row={order}>
              <TableCell>
                {order.supportingProject.supportingProjectId}
              </TableCell>
              <TableCell>{order.delivery.deliveryName}</TableCell>
              <TableCell>
                {new Date(order.supportingProject.supportedAt).toLocaleString()}
              </TableCell>
              <TableCell>{order.supportingPackage.packageName}</TableCell>
              <TableCell>{order.delivery.deliveryPhoneNumber}</TableCell>
              <TableCell>{order.delivery.deliveryAddress}</TableCell>
              <TableCell>{order.delivery.deliveryMessage}</TableCell>
            </CustomTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export const MyProjectDetailDashBoard = ({ projectId }) => {
  const [projectData, setProjectData] = useState(null); // 프로젝트 정보 상태
  const [supportStat, setSupportStat] = useState(null); // 후원 통계 상태
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const { user } = useUser();
  const [chartData, setChartData] = useState(null);
  const targetFunding = useState(""); // 목표 금액 설정

  // 두 API를 병렬로 호출하여 데이터를 가져옴
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 프로젝트 상세 정보 api 호출
        const [projectResponse] = await Promise.all([
          axios({
            method: "GET",
            url: `${SERVER_URL}/project/myproject/${projectId}`, // 템플릿 리터럴을 올바르게 적용

            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`, // 템플릿 리터럴을 올바르게 적용
            },
          }).then((response) => response),
        ]);

        // 후원 통계 api 호출
        setSupportStat(mockSupportStat);

        setProjectData(projectResponse.data); // 프로젝트 데이터 저장

        setLoading(false); // 로딩 상태 완료
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  if (loading) {
    return <div>로딩중..</div>;
  }

  if (!projectData && !supportStat) {
    return <div>데이터를 가져오는 중 오류가 발생</div>;
  }

  // 탭 핸들러
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <DetailContainer>
      {/* Tabs Section */}
      {/* <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                aria-label="후원통계 및 후원자 조회 탭"
                sx={{
                    marginTop: '60px',
                    marginBottom: '20px',
                    '& .MuiTab-root': {
                        fontSize: '20px',
                    },
                }}
            >
                <Tab label="후원 통계" />
                <Tab label="후원자 조회" />
            </Tabs> */}
      <br />

      {/* 후원 통계 */}
      {tabIndex === 0 && (
        <>
          <Typography
            variant="h5"
            sx={{
              marginBottom: "20px",
              fontWeight: "bold",
              //   marginRight: "-150px",
            }}
          >
            후원 통계
          </Typography>
          <DashboardSection
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px",
              borderRadius: "10px",
              backgroundColor: "white",
              width: "1000px",
              marginTop: "20px",
            }}
          >
            <Typography>
              <span style={{ color: "red", fontSize: "18px" }}>
                총 후원금액
              </span>
              <br />
              <span style={{ color: "black", fontSize: "24px" }}>
                {/* {statistics.totalSupportAmount.toLocaleString()}원 */}
                {supportStat.totalAmount.toLocaleString()}원
              </span>
              <br />
            </Typography>
            <Typography>
              <span style={{ color: "red", fontSize: "18px" }}>달성률</span>
              <br />
              <span style={{ color: "black", fontSize: "24px" }}>
                {/* {(statistics.totalSupportAmount / statistics.targetFunding) *
                  100} %*/}
                {supportStat.percentage.toFixed(2)}%
              </span>
              <br />
            </Typography>

            <Typography>
              <span style={{ color: "red", fontSize: "18px" }}>후원자 수</span>
              <br />
              <span style={{ color: "black", fontSize: "24px" }}>
                {/* {statistics.totalSupporters}명 */}
                {supportStat.supporters}명
              </span>
              <br />
            </Typography>

            <Typography>
              <span style={{ color: "red", fontSize: "18px" }}>남은 기간</span>
              <br />
              <span style={{ color: "black", fontSize: "24px" }}>
                {/* {statistics.remainingDays}일 */}
                {supportStat.remainingDays}일
              </span>
              <br />
            </Typography>
          </DashboardSection>
          {/* 후원 차트 추가 부분 */}
          <Box mt={15}>
            {/* 가짜 데이터 전달 */}
            <ProgressChart
              serverData={chartData || mockChartData}
              targetFunding={targetFunding}
            />
          </Box>
        </>
      )}

      {/* 후원자 조회 정보 */}
      {tabIndex === 1 && <SupporterTable />}
    </DetailContainer>
  );
};
