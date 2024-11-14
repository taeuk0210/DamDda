import React from "react";
import { Line } from "react-chartjs-2";
import { Box, Typography } from "@mui/material";
import "chart.js/auto";
import { Chart } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation"; // 플러그인 가져오기

// 플러그인 등록
Chart.register(annotationPlugin);

// 서버에서 받아온 데이터를 누적 후원액으로 변환
const convertDataToCumulative = (serverData) => {
  const cumulativeData = [];
  let total = 0;

  // const chartData =
  //   serverData &&
  //   Object.entries(serverData).reduce((acc, [date, value], index) => {
  //     // console.log("data, value, index : ", date, value, index);
  //     // const numericValue = !isNaN(value) ? Number(value) : 0; // 숫자로 변환 가능한지 확인 후 변환

  //     // const previousTotal =
  //     //   acc.length > 0 && acc[index - 2] ? acc[index - 2][1] : Number(0);

  //     // // 타입 확인을 위해 콘솔에 찍음
  //     // console.log("previousTotal type: ", typeof previousTotal);
  //     // console.log("numericValue type: ", typeof numericValue);
  //     // const cumulativeValue = Number(previousTotal) + numericValue;
  //     acc.push([date, value]);
  //     return acc;
  //   });
  const chartData =
    serverData &&
    Object.entries(serverData).reduce((acc, [date, value], index) => {
      acc.push([date, value]);
      return acc;
    }, []);
  console.log("chartData:chartData:", chartData);
  if (Array.isArray(chartData)) {
    chartData.forEach(([date, amount]) => {
      total += amount;
      cumulativeData.push({ date: date, amount: total });
    });
  } else {
    console.error("chartData 배열 형식이 아닙니다.");
    return [];
  }
  console.log("cumulativeData", cumulativeData);

  return cumulativeData;
};

export const ProgressChart = ({ serverData, targetFunding }) => {
  console.log("charData : ", serverData);

  // const cumulativeData = dailyData.reduce((acc, current, index) => {
  //   const [date, value] = current;
  //   const previousTotal = index > 0 ? acc[index - 1][1] : 0;
  //   const cumulativeValue = previousTotal + value;
  //   acc.push([date + "T00:00:00", cumulativeValue]);
  //   return acc;
  // }, []);
  // const convertedData = Object.entries(serverData).reduce(
  //   (acc, [date, value], index) => {
  //     const previousTotal = index > 0 ? acc[index - 1][1] : 0;
  //     const cumulativeValue = previousTotal + value;
  //     acc.push([date + "T00:00:00", cumulativeValue]);
  //     return acc;
  //   },
  //   []
  // );

  // console.log(convertedData);

  const dailyData = convertDataToCumulative(serverData);

  // targetFunding 값이 안전하게 설정되도록 보장
  const safeTargetFunding = targetFunding || 0;

  // Chart.js의 데이터 설정
  const data = {
    labels: dailyData.map((data) => data.date),
    datasets: [
      {
        label: "누적 후원액",
        data: dailyData.map((data) => data.amount),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
    ],
  };

  // Chart.js의 옵션 설정
  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value.toLocaleString()} 원`, // y축의 숫자를 금액으로 표시
        },
      },
      x: {
        type: "category",
        ticks: {
          callback: (val, index) => dailyData[index].date, // x축의 날짜를 표시
        },
      },
    },
    plugins: {
      annotation: {
        annotations: {
          targetLine: {
            type: "line",
            scaleID: "y",
            value: safeTargetFunding,
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              content: `목표액: ${safeTargetFunding.toLocaleString()} 원`,
              enabled: true,
              position: "end",
              backgroundColor: "rgba(75, 192, 192, 1)",
              color: "#fff",
              font: {
                family: "Arial",
                size: 12,
                weight: "bold",
              },
            },
          },
        },
      },
    },
  };

  return (
    <Box
      sx={{
        padding: "5px",
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
        일일 누적 후원액
      </Typography>
      <Line data={data} options={options} plugins={[annotationPlugin]} />
    </Box>
  );
};
