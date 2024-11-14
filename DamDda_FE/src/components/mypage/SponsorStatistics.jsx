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

const DashboardSection = styled("div")({
  width: "100%",
  backgroundColor: "#f7f7f7",
  padding: "20px",
  borderRadius: "10px",
  marginTop: "40px",
  textAlign: "center",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
});

export const SponsorStatistics = ({ projectId }) => {
  const [projectData, setProjectData] = useState(null); // 프로젝트 정보 상태
  const [supportStat, setSupportStat] = useState(null); // 후원 통계 상태
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [achievementRate, setAchievementRate] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [supportersCount, setSupportersCount] = useState(0);
  const [fundingReceived, setFundingReceived] = useState(0);
  const [targetFunding, setTargetFunding] = useState(0);

  // 두 API를 병렬로 호출하여 데이터를 가져옴
  useEffect(() => {
    // const fetchChartData = async () => {
    //   try {
    //     // 프로젝트 상세 정보 api 호출
    //     const [response] = await Promise.all([
    //       axios({
    //         method: "GET",
    //         url: `${SERVER_URL}/project/daily/${projectId}`, // 템플릿 리터럴을 올바르게 적용

    //         headers: {
    //           Authorization: `Bearer ${Cookies.get("accessToken")}`, // 템플릿 리터럴을 올바르게 적용
    //         },
    //       }).then((response) => response),
    //     ]);

    //     console.log("일별 후원액 조회", response.data);
    //     console.log("mockChartData 목업데이터", mockChartData);
    //     // console.log("mockSupportStat 목업데이터", mockSupportStat);
    //     // 후원 통계 api 호출
    //     setSupportStat(mockSupportStat);

    //     setProjectData(response.data); // 프로젝트 데이터 저장

    //     setLoading(false); // 로딩 상태 완료
    //   } catch (error) {
    //     setLoading(false);
    //   }
    // };

    const fetchSummaryData = async () => {
      try {
        // 프로젝트 상세 정보 api 호출
        const [response] = await Promise.all([
          axios({
            method: "GET",
            url: `${SERVER_URL}/order/statistics/${projectId}`, // 템플릿 리터럴을 올바르게 적용
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`, // 템플릿 리터럴을 올바르게 적용
            },
          }).then((response) => response),
        ]);
        setAchievementRate(
          (response.data.currentFundingReceived /
            response.data.targetFundingGoal) *
            100
        ); // 달성률 (퍼센트로 표현)
        const currentTime = new Date();
        const endDate = new Date(response.data.projectEndDate);
        const timeDifference = endDate - currentTime;
        setDaysLeft(Math.floor(timeDifference / (1000 * 60 * 60 * 24))); // 남은 일수
        setSupportersCount(response.data.currentSupportersCount);
        setFundingReceived(response.data.currentFundingReceived);
        setTargetFunding(response.data.targetFundingGoal);
        setChartData(response.data.dailyFundings);
        console.log(
          "response.data.dailyFundings: ",
          response.data.dailyFundings
        );
        console.log(
          "currentFundingReceived",
          response.data.currentFundingReceived
        );
        console.log(response.data.targetFundingGoal);

        console.log("후원 프로젝트 정보 조회", response.data);
        // console.log("mockChartData 목업데이터", mockChartData);
        console.log("mockSupportStat 목업데이터", mockSupportStat);
        // 후원 통계 api 호출
        setSupportStat(mockSupportStat);

        setProjectData(response.data); // 프로젝트 데이터 저장

        setLoading(false); // 로딩 상태 완료
      } catch (error) {
        setLoading(false);
      }
    };

    // fetchChartData();
    fetchSummaryData();
  }, [projectId]);

  if (loading) {
    return <div>로딩중..</div>;
  }

  if (!projectData && !supportStat) {
    return <div>데이터를 가져오는 중 오류가 발생</div>;
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            marginBottom: "20px",
            fontWeight: "bold",
            //   marginRight: "-150px",
          }}
        >
          후원 요약
        </Typography>
        <DashboardSection
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "white",
            width: "1000px",
            marginTop: "20px",
          }}
        >
          <Typography>
            <span style={{ color: "red", fontSize: "18px" }}>총 후원금액</span>
            <br />
            <span style={{ color: "black", fontSize: "24px" }}>
              {/* {statistics.totalSupportAmount.toLocaleString()}원 */}
              {fundingReceived.toLocaleString()}원
            </span>
            <br />
          </Typography>
          <Typography>
            <span style={{ color: "red", fontSize: "18px" }}>달성률</span>
            <br />
            <span style={{ color: "black", fontSize: "24px" }}>
              {/* {(statistics.totalSupportAmount / statistics.targetFunding) *
                  100} %*/}
              {achievementRate.toFixed(0)}%
            </span>
            <br />
          </Typography>
          <Typography>
            <span style={{ color: "red", fontSize: "18px" }}>후원자 수</span>
            <br />
            <span style={{ color: "black", fontSize: "24px" }}>
              {/* {statistics.totalSupporters}명 */}
              {supportersCount}명
            </span>
            <br />
          </Typography>
          <Typography>
            <span style={{ color: "red", fontSize: "18px" }}>남은 기간</span>
            <br />
            <span style={{ color: "black", fontSize: "24px" }}>
              {/* {statistics.remainingDays}일 */}
              {daysLeft < 0 ? `마감 ${-1 * daysLeft}일 지남` : `${daysLeft}일`}
            </span>
            <br />
          </Typography>
        </DashboardSection>
        {/* 후원 차트 추가 부분 */}
        <Box mt={15} style={{ width: "1000px" }}>
          {/* 가짜 데이터 전달 */}
          <ProgressChart serverData={chartData} targetFunding={targetFunding} />
        </Box>
      </div>
    </>
  );
};
