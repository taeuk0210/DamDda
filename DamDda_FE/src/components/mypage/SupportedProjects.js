import React, { useState, useEffect } from "react";
import { SponsoredListComponent } from "components/common/SponsoredListComponent";
import "./css/SupportedProjects.module.css"; // CSS 파일 경로 수정
import axios from "axios";
import { useUser } from "UserContext";
import Cookies from "js-cookie";
import { SERVER_URL } from "constants/URLs";

export const SupportedProjects = () => {
  const { user } = useUser();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 백엔드에서 후원한 프로젝트 목록을 가져오는 함수 (주석 처리)
  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${SERVER_URL}/order/supportingprojects`,
        {
          headers: {
            ...(Cookies.get("accessToken") && {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            }),
          },
        }
      );

      setProjects(response.data);
      setLoading(false);
      console.log(response.data);
    } catch (err) {
      console.error("후원한 프로젝트 데이터를 불러오는 중 오류 발생:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  return (
    <div
      style={{
        display: "flex", // flexbox 사용
        justifyContent: "center", // 수평 중앙 정렬
        alignItems: "center", // 수직 중앙 정렬
        minHeight: "100vh", // 화면 전체 높이 유지
        padding: "20px", // 여백 추가 (선택 사항)
        width: "100%",
      }}
    >
      <SponsoredListComponent projects={projects} />
    </div>
  );
};
