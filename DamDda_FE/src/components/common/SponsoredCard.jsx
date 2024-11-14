import React, { useState } from "react";
import { StatusButton } from "./ButtonComponent"; // named export로 가져오기
import { PaymentInfoCard } from "../common/PaymentInfoCard";
import { width } from "@mui/system";
import { SERVER_URL } from "constants/URLs";
import { useNavigate } from "react-router-dom";

export const SponsoredCard = ({ project }) => {
  const [showDetails, setShowDetails] = useState(false); // 결제/배송 정보 표시 상태

  // 결제/배송 정보 표시 토글
  const toggleDetails = () => setShowDetails(!showDetails); // 토글

  const navigate = useNavigate();
  console.log(project);
  return (
    <>
      <div
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "row",
          // alignItems: 'center',
          borderRadius: "16px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: "white",
          justifyContent: "space-between",
          marginBottom: "15px",
        }}
      >
        {/* 왼쪽에 썸네일을 넣는 부분 */}
        <div style={{ flex: "0 0 150px", margin: "15px" }}>
          <div
            onClick={() =>
              navigate(
                `/detail?projectId=${project.supportingProject.project.id}`
              )
            }
            style={{
              width: "100%",
              paddingBottom: "100%",
              position: "relative",
            }}
          >
            <img
              src={`${SERVER_URL}/${project.supportingProject.project.thumbnailUrl}`}
              alt="프로젝트 썸네일"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>
        </div>

        {/* 중앙 텍스트 정보 */}
        <div style={{ flex: 1, marginRight: "5px", padding: "15px" }}>
          <h5
            style={{
              marginBottom: "5px",
              fontWeight: "bold",
              fontSize: "20px",
              marginLeft: "30px",
            }}
          >
            [{project.supportingProject.project.title}]
          </h5>
          <br></br>
          <div>
            {project.paymentPackageDTO.map((item, index) => (
              <div key={index} style={{ marginLeft: "30px" }}>
                <p style={{ marginBottom: "4px", color: "#666" }}>
                  이름: {item.name}
                </p>
                <p style={{ marginBottom: "4px", color: "#666" }}>
                  수량: {item.count}
                </p>
                <p style={{ marginBottom: "4px", color: "#666" }}>
                  금액: {parseInt(item.price).toLocaleString()}원
                </p>
                <hr style={{ width: "400px" }} />
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽 정보 (상단: 후원번호와 결제 날짜, 하단: 버튼) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-end",
            minWidth: "160px",
          }}
        >
          {/* 상단에 후원번호와 결제날짜 */}
          <div style={{ textAlign: "right", marginBottom: "80px" }}>
            <p
              style={{
                marginBottom: "8px",
                fontSize: "0.875rem",
                color: "#666",
              }}
            >
              후원번호: {project.delivery.deliveryId}
            </p>
            <p style={{ fontSize: "0.875rem", color: "#666" }}>
              결제 날짜:{" "}
              {new Date(project.supportingProject.supportedAt).toLocaleString()}
            </p>
          </div>

          {/* 하단에 진행 상태와 결제 정보 버튼 */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "flex-end",
              marginTop: "auto",
            }}
          >
            <StatusButton
              status={project.status}
              label={project.status === "진행중" ? "진행중" : "마감"}
            />
            <StatusButton
              status="결제/배송 정보"
              label="결제/배송 정보"
              onClick={toggleDetails}
            />
          </div>
        </div>
      </div>

      {/* 결제/배송 정보 표시 */}
      {showDetails && <PaymentInfoCard project={project} />}
    </>
  );
};
