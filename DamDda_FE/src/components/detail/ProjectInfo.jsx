import React, { useState, useEffect } from "react";
import { LinearProgress, Divider } from "@mui/material";
// import "../../styles/style.css";
// import "./Detail.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ProjectInfoBox } from "./MoreComponent";
import {
  BlueBorderButtonComponent,
  BlueButtonComponent,
} from "components/common/ButtonComponent";

export const ProjectInfo = ({
  projectInfo,
  handleSponsorClick,
  handleCollabClick,
  handleHeartClick,
}) => {
  // 날짜 형식을 변환하는 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // return date.toISOString().slice(0, 10); // YYYY-MM-DD 형식으로 변환
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    // return dateString;
  };

  useEffect(() => {}, [projectInfo]);

  //const [isHearted, setIsHearted] = useState(projectInfo.liked); // 사용자가 좋아요를 눌렀는지

  return (
    <>
      <div style={{ width: "400px" }}>
        <div style={{ width: "100%" }} className="container">
          {/* 후원금액 */}
          <ProjectInfoBox
            title={"후원 금액"}
            value={projectInfo.fundsReceive.toLocaleString()}
            unit={"원"}
            statistics={projectInfo.achievementRate?.toFixed(0) + "%"}
          />
          {/* 진행바 */}
          <LinearProgress
            variant="determinate"
            value={projectInfo.achievementRate}
            className="progress-bar"
          />
          {/* 남은 기간 */}
          <ProjectInfoBox
            title={"남은 기간"}
            value={
              projectInfo.daysLeft < 0
                ? "종료된 펀딩입니다."
                : projectInfo.daysLeft
            }
            unit={projectInfo.daysLeft < 0 ? "" : "일"}
            statistics={null}
          />
          {/* 후원자 수 */}
          <ProjectInfoBox
            title={"후원자"}
            value={projectInfo.supporterCnt}
            unit={"명"}
            statistics={null}
          />
          {/* 구분선 */}
          <Divider className="divider" />
          <div style={{ margin: "10px 0px" }}>
            {/* 목표금액 */}
            <div className="info-text">
              목표금액: {projectInfo.targetFunding.toLocaleString()}원
            </div>
            {/* 펀딩기간 */}
            <div className="info-text">
              펀딩 기간: {formatDate(projectInfo.startDate)} ~{" "}
              {formatDate(projectInfo.endDate)}
            </div>
            {/* 예상전달일 */}
            <div className="info-text">
              예상 전달일: 프로젝트 종료일로부터 30일 이내
            </div>
          </div>
          {/* 구분선 */}
          <Divider className="divider" />
          <div>
            <div style={{ margin: "10px 0px" }}>
              <BlueButtonComponent
                text="이 프로젝트에 후원하기"
                className="contained-button"
                onClick={handleSponsorClick}
              />
            </div>
            <div
              className="secondary-buttons"
              style={{
                margin: "0px",
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                padding: "0px",
                height: "50px",
              }}
            >
              <div style={{ width: "180px" }}>
                <BlueBorderButtonComponent
                  text={
                    (projectInfo.liked ? "♥ " : "♡ ") +
                    projectInfo.liked_count +
                    "명"
                  }
                  onClick={() => handleHeartClick(projectInfo.liked)}
                  className="heart-button"
                />
              </div>
              <div style={{ width: "180px" }}>
                <BlueBorderButtonComponent
                  text="협업하기"
                  variant="outlined"
                  onClick={handleCollabClick}
                  className="heart-button"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
