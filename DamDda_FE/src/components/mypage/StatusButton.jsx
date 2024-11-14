import React from "react";
import { Button, Tooltip } from "@mui/material";

const StatusButton = ({
  status,
  label,
  showRejectReason,
  rejectMessage,
  onClick,
  sx,
}) => {
  const getButtonProps = () => {
    switch (status) {
      case "진행중":
        return {
          color: "white",
          borderColor: "#4caf50",
          backgroundColor: "#4caf50",
        };
      case "마감":
        return {
          color: "white",
          borderColor: "#f44336",
          backgroundColor: "#f44336",
        };
      case "승인완료":
        return {
          color: "black",
          borderColor: "#4caf50",
          backgroundColor: "#4caf50",
        };
      case "승인대기":
        return {
          color: "black",
          borderColor: "#ff9800",
          backgroundColor: "#ff9800",
        };
      case "승인거절":
        return {
          color: "black",
          borderColor: "#f44336",
          backgroundColor: "#f44336",
        };
      case "미정":
        return {
          color: "black",
          borderColor: "yellow",
          backgroundColor: "yellow",
        };
      case "결제 취소":
        return {
          color: "white",
          borderColor: "#d32f2f",
          backgroundColor: "#d32f2f",
          disableHover: true,
        }; // 결제 취소에 대해 hover 비활성화
      case "결제/배송 정보":
        return {
          color: "#1e88e5",
          borderColor: "#1e88e5",
          backgroundColor: "transparent",
          hoverBackgroundColor: "#e3f2fd",
          width: "140px",
        };
      case "회원탈퇴":
        return {
          color: "white",
          backgroundColor: "#1976d2",
          borderColor: "#2196f3",
        };
      default:
        return {
          color: "#757575",
          borderColor: "#757575",
          backgroundColor: "transparent",
        };
    }
  };

  const {
    color,
    borderColor,
    backgroundColor,
    width,
    hoverBackgroundColor,
    disableHover,
  } = getButtonProps();

  return (
    <Tooltip
      title={showRejectReason && rejectMessage ? rejectMessage : ""}
      arrow
      placement="top"
    >
      <Button
        variant="outlined"
        onClick={onClick} // 여기에 onClick 추가
        sx={{
          "--variant-borderWidth": "2px",
          borderRadius: 20,
          width: width || "100px",
          height: "40px",
          fontSize: "14px",
          color,
          borderColor,
          backgroundColor,
          ...sx,
          "&:hover": {
            backgroundColor: disableHover
              ? backgroundColor
              : hoverBackgroundColor || backgroundColor, // 결제 취소일 때 hover 시 색 변경 안 함
            borderColor,
            color,
          },
        }}
      >
        {label}
      </Button>
    </Tooltip>
  );
};

export default StatusButton;
