import React, { useState, useEffect, useRef } from "react";
import { styled } from "@mui/system";
import axios from "axios";
import Cookies from "js-cookie";
import { SERVER_URL } from "constants/URLs";
import { ProjectInfo } from "components/detail/ProjectInfo";
import { TabComponent } from "components/common/TabComponent";
import { ProjectTitle } from "components/detail/ProjectTitle";
import { ImageCarousel } from "components/common/ImageCarousel";
import { MyProjectDetailDashBoard } from "components/mypage/MyProjectDetailDashBoard";
import { SponsorStatistics } from "components/mypage/SponsorStatistics";
import { SponsorTable } from "components/mypage/SponsorTable";
import { Tooltip, Button, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// 후원 통계
const mockSupportStat = {
  totalAmount: 80771500,
  percentage: 161.54,
  supporters: 708,
  remainingDays: 0,
};

const ThumbnailContainer = styled("div")({
  position: "relative",
  width: "400px",
  height: "400px",
  backgroundColor: "#f0f0f0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "8px",
  overflow: "hidden",
  marginRight: "30px",
});

const ThumbnailImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: "8px",
});

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

const InfoSection = styled("div")({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  width: "100%",
  marginTop: "20px",
});

const ProgressSection = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  marginLeft: "20px",
  marginTop: "19px",
});

export const MyProjectDetails = ({ projectId, setClickMyproject }) => {
  const [projectData, setProjectData] = useState(null); // 프로젝트 정보 상태
  const [supportStat, setSupportStat] = useState(null); // 후원 통계 상태
  const [loading, setLoading] = useState(true);

  // 두 API를 병렬로 호출하여 데이터를 가져옴
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 프로젝트 상세 정보 api 호출
        const [projectResponse] = await Promise.all([
          axios({
            method: "GET",
            url: `${SERVER_URL}/project/myproject/${projectId}`, // 템플릿 리터럴을 올바르게 적용
            // params: {
            //   memberId: user.key,
            // },
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
  const [projectInfo, setProjectInfo] = useState();
  const CarouselStyle = { width: "500px", height: "500px" };

  //////////Tab 관련 시작//////////////////////////////////
  const [tabIndex, setTabIndex] = useState(0);

  // 각 섹션에 대한 ref 정의
  const sectionRefs = {
    statisticalRef: useRef(null),
    noticeRef: useRef(null),
    qnaRef: useRef(null),
  };

  const labels = ["후원 통계", "후원자 조회"]; // 탭 레이블을 배열로 정의

  //탭 이동
  const handleScrollToSectionWithOffset = (index) => {
    setTabIndex(index);
    const sectionKeys = Object.keys(sectionRefs);
    const selectedSectionKey = sectionKeys[index];
    const selectedSectionRef = sectionRefs[selectedSectionKey];

    if (selectedSectionRef && selectedSectionRef.current) {
      const elementPosition =
        selectedSectionRef.current.getBoundingClientRect().top +
        window.pageYOffset;

      // 원하는 위치로 스크롤, offset을 적용해서 100px만큼 내려오게 함
      window.scrollTo({
        top: elementPosition - 150, // 100px만큼 상단에서 떨어지게 설정
        behavior: "smooth", // 부드러운 스크롤 이동
      });
    }
  };

  // 각 탭에 맞는 내용을 렌더링하는 함수
  const renderTabContent = () => {
    switch (tabIndex) {
      case 0:
        return <SponsorStatistics projectId={projectId} />;
      case 1:
        return (
          <div
            style={{
              maxWidth: "1000px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <SponsorTable projectId={projectId} />
          </div>
        );

      default:
        return <div>다시 선택해주세요.</div>;
    }
  };

  //////////Tab 관련 끝//////////////////////////////////
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      // 첫 렌더링일 경우, 그냥 렌더링만 하고 패스
      isFirstRender.current = false; // 이후부터는 첫 렌더링이 아님
      return; // 첫 렌더링 시에는 실행되지 않도록 바로 종료
    }

    console.log(projectData);
    const currentTime = new Date();
    // const endDate = new Date();
    const endDate = new Date(projectData.endDate);
    const timeDifference = Math.max(0, endDate - currentTime);

    setProjectInfo({
      fundsReceive: projectData.fundsReceive, // 모인 금액
      achievementRate: Math.min(
        (projectData.fundsReceive / projectData.targetFunding) * 100,
        100
      ), // 달성률 (퍼센트로 표현)
      daysLeft: Math.floor(timeDifference / (1000 * 60 * 60 * 24)), // 남은 일수
      supporterCnt: projectData.supporterCnt, // 후원자 수
      targetFunding: projectData.targetFunding, // 목표 금액
      startDate: projectData.startDate, // 펀딩 시작일
      endDate: projectData.endDate, // 펀딩 종료일
      liked: projectData.liked, // 사용자가 좋아요를 눌렀는지 여부
      liked_count: projectData.likerCnt, // 좋아요를 누른 사람의 수
    });
  }, [projectData]);

  if (loading) {
    return <div>로딩중..</div>;
  }

  if (!projectData && !supportStat) {
    return <div>데이터를 가져오는 중 오류가 발생</div>;
  }
  console.log("projectData : ", projectData);

  // 남은 기간이 0 이하일 경우 0으로 표시
  const remainingDays = Math.max(
    Math.ceil(
      (new Date(projectData.endDate) - new Date()) / (1000 * 3600 * 24)
    ),
    0
  );
  const progress = (projectData.fundsReceive / projectData.targetFunding) * 100;

  const getApprovalStatus = (approval) => {
    switch (approval) {
      case 1:
        return "승인완료";
      case 0:
        return "승인대기";
      case 2:
        return "승인거절";
      default:
        return "미정";
    }
  };
  console.log("data : ", projectData);

  return (
    <div style={{ width: "100%", margin: "10px auto" }}>
      <div
        style={{
          // marginTop: "50px",
          marginLeft: "100px",
          display: "flex",
          justifyContent: "flex-start", // 버튼을 오른쪽으로 정렬
          alignItems: "center", // 수직 중앙 정렬 (필요시)
        }}
      >
        <IconButton
          onClick={() => setClickMyproject(0)}
          //style={{ position: "absolute", top: "330px", left: "700px" }}
        >
          <ArrowBackIcon fontSize="large" />
        </IconButton>
      </div>

      <div
        style={{
          // marginTop: "50px",
          display: "flex",
          justifyContent: "center", // 버튼을 오른쪽으로 정렬
          alignItems: "center", // 수직 중앙 정렬 (필요시)
        }}
      >
        <Tooltip
          title={
            <span style={{ fontSize: "16px" }}>
              {projectData.rejectMessage}
            </span>
          } // 툴팁 글씨 크기 조정
          placement="top" // 툴팁을 버튼 위에 표시
        >
          <Button
            sx={{
              //   backgroundColor: params.row.approval === "거절" ? "red" : "#4caf50",
              backgroundColor:
                projectData.approval === 1
                  ? "#C8E6C9"
                  : projectData.approval === 2
                    ? "#FFCDD2"
                    : "#E0E0E0", // 파스텔 톤 배경색
              color:
                projectData.approval === 1
                  ? "#2E7D32"
                  : projectData.approval === 2
                    ? "#D32F2F"
                    : "#000000", // 글씨 색
              border:
                projectData.approval === 1
                  ? "2px solid #C8E6C9"
                  : projectData.approval === 2
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
            {projectData.approval === 0
              ? "승인대기"
              : projectData.approval === 1
                ? "승인"
                : "거절"}
          </Button>
        </Tooltip>
      </div>
      {/* 타이틀 */}
      <div style={{ marginTop: "0px" }}>
        <ProjectTitle
          projectTitle={{
            category: projectData.category,
            nickname: projectData.nickName,
            title: projectData.title,
            description: projectData.description,
          }}
        />
      </div>
      {/* 캐러셀 및 진행률 */}

      <div
        style={{
          display: "flex",
          flexFlow: "row wrap",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <ImageCarousel
          images={projectData.productImages}
          style={CarouselStyle}
        />
        {projectInfo && (
          <ProjectInfo
            projectInfo={projectInfo}
            handleSponsorClick={() =>
              alert("운영 페이지에서 클릭 시 후원하기가 진행됩니다.")
            }
            handleHeartClick={() =>
              alert("운영 페이지에서 클릭 시 좋아요가 표시됩니다.")
            }
            handleCollabClick={() =>
              alert(
                "운영 페이지에서 클릭 시 협업하기가 진행됩니다. 단, 본인 프로젝트에는 협업신청이 불가능합니다."
              )
            }
          />
        )}
      </div>

      {/* 후원통계 */}
      <div
        ref={sectionRefs.descriptionRef}
        style={{ margin: "100px 0px 50px 0px" }}
      >
        <TabComponent
          tabIndex={tabIndex}
          setTabIndex={(index) => handleScrollToSectionWithOffset(index)}
          labels={labels}
          sectionRefs={sectionRefs} // ref 전달
        />
      </div>
      <div
        style={{
          width: "100%",
          height: "auto",
          backgroundColor: "white",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {renderTabContent()} {/* 탭에 맞는 내용 렌더링 */}
      </div>
    </div>

    // <DetailContainer>
    //   {/* 뒤로 가기 버튼 */}
    //   <IconButton
    //     onClick={() => setClickMyproject(0)}
    //     style={{ position: "absolute", top: "330px", left: "700px" }}
    //   >
    //     <ArrowBackIcon fontSize="large" />
    //   </IconButton>

    //   {/* <Typography
    //     variant="h4"
    //     sx={{ fontWeight: "bold", marginBottom: "20px" }}
    //   >
    //     프로젝트 진행률 확인
    //   </Typography> */}

    //   <div style={{ padding: "20px" }}>
    //     <div style={{ marginBottom: "20px" }}>
    //       <Typography variant="category">{category}</Typography>
    //       <br />
    //       <Typography variant="organizer">{organizer_id}</Typography>
    //       <Typography variant="h6">{title}</Typography>
    //       <Typography variant="body2">{description}</Typography>
    //     </div>
    //   </div>

    //   <InfoSection>
    //     {/* 이미지 섹션 */}
    //     <ThumbnailContainer>
    //       {productImages ? (
    //         <ThumbnailImage src={productImages[0]} alt="Project Thumbnail" />
    //       ) : (
    //         <Typography variant="body2" color="textSecondary">
    //           이미지가 없습니다.
    //         </Typography>
    //       )}
    //     </ThumbnailContainer>

    //     {/* 관리자 승인 상태에 따른 StatusButton */}
    //     <Box>
    //       <StatusButton
    //         status={getApprovalStatus(approval)}
    //         label={getApprovalStatus(approval)}
    //         showRejectReason={approval === 2} // 이 페이지에서만 Tooltip이 작동하도록 설정
    //         rejectMessage={rejectMessage} // 거절 사유 전달
    //         sx={{
    //           marginTop: "-50px",
    //           marginRight: "-1150px",
    //           // backgroundColor: projectData.approval === 2 ? "red" : "#4caf50", // 거절일 때는 버튼 색을 다르게(일단 주석 해제 하지 말아주세요)
    //           borderRadius: "50px",
    //           padding: "10px 20px",
    //           zIndex: 2, // Tooltip이 정상적으로 표시되도록 zIndex 추가
    //         }}
    //       />
    //     </Box>

    //     {/* 후원 정보 섹션 */}
    //     <ProgressSection>
    //       {/* 후원금액(진행률) 부분 */}
    //       <Typography variant="h6" style={{ marginTop: "20px" }}>
    //         후원금액
    //       </Typography>

    //       {/* 금액 표시 */}
    //       <Typography variant="h4" fontWeight="bold">
    //         {fundsReceive.toLocaleString()}원
    //       </Typography>

    //       {/* 진행률 바와 % */}
    //       <Box position="relative" width="600px" marginTop="10px">
    //         <LinearProgress
    //           variant="determinate"
    //           value={progress}
    //           style={{ height: "10px", borderRadius: "5px" }}
    //         />

    //         {/* % 표시를 바의 우측 상단에 배치 */}
    //         <Typography
    //           variant="body2"
    //           style={{
    //             position: "absolute",
    //             right: 0,
    //             top: "-20px", // 바의 위쪽에 위치하도록 설정
    //             fontSize: "16px", // 글씨 작게 설정
    //             color: "gray",
    //           }}
    //         >
    //           {progress.toFixed(2)}%
    //         </Typography>
    //       </Box>

    //       <Typography variant="h6" style={{ marginTop: "20px" }}>
    //         남은 기간 <br />
    //       </Typography>

    //       {/* 남은 기간 표시   */}
    //       <Typography variant="h4" fontWeight="bold">
    //         {remainingDays}일
    //       </Typography>

    //       <Typography variant="h6" style={{ marginTop: "20px" }}>
    //         후원자 수
    //       </Typography>

    //       {/* 후원자 수 표시 */}
    //       <Typography variant="h4" fontWeight="bold">
    //         {supporterCnt}명
    //       </Typography>

    //       {/* 회색 선 */}
    //       <Divider style={{ margin: "20px 0", width: "600px" }} />

    //       {/* 목표금액 */}
    //       <Box
    //         display="flex"
    //         justifyContent="space-between"
    //         alignItems="center"
    //       >
    //         <Typography style={{ fontSize: "14px" }}>목표금액</Typography>
    //         <Typography style={{ fontSize: "14px", marginLeft: "50px" }}>
    //           {targetFunding}원
    //         </Typography>
    //       </Box>

    //       {/* 펀딩기간 */}
    //       <Box
    //         display="flex"
    //         justifyContent="space-between"
    //         alignItems="center"
    //       >
    //         <Typography style={{ fontSize: "14px" }}>펀딩기간</Typography>
    //         <Typography style={{ fontSize: "14px", marginLeft: "50px" }}>
    //           {startDate}~ {endDate}
    //         </Typography>
    //       </Box>
    //     </ProgressSection>
    //   </InfoSection>

    //   <MyProjectDetailDashBoard projectId={projectId} />
    // </DetailContainer>
  );
};
