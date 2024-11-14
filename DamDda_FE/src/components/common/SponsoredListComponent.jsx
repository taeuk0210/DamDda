import React from "react";
// import 'components/css/SponsoredListComponent.module.css'; // CSS 파일 import
import { SponsoredCard } from "components/common/SponsoredCard";
import { width } from "@mui/system";

// SponsoredListComponent: 후원 프로젝트 목록 렌더링
export const SponsoredListComponent = ({ projects }) => {
  // 전체 projects 배열 출력

  if (!projects || projects.length === 0) {
    return <div>후원한 프로젝트가 없습니다.</div>; // 데이터가 없을 때 처리
  }

  return (
    <div style={{ width: "1050px" }}>
      {projects.map((project, index) => {
        // 각 프로젝트 정보 출력
        // 인덱스 출력
        return (
          <div className="sponsored-card" key={index}>
            <SponsoredCard project={project} />
          </div>
        );
      })}
    </div>
  );
};
