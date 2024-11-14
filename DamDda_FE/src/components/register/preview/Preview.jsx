import { DetailDescroption } from "components/detail/DetailDescription";
import { Notice } from "components/detail/Notices";
import { ProjectInfo } from "components/detail/ProjectInfo";
import { QnA } from "components/detail/QnA";
import { TabComponent } from "components/common/TabComponent";
import { ProjectTitle } from "components/detail/ProjectTitle";
import { ImageCarousel } from "components/common/ImageCarousel";
import { GiftCompositionComponent } from "components/common/Gift/GiftCompositionComponent";
import { useRef, useState } from "react";
import { Grid } from "@mui/system";
import { Grid2 } from "@mui/material";

export const Preview = (props) => {
  let { projectId, project } = props;
  const [liked, setLiked] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const sectionRefs = {
    descriptionRef: useRef(null),
    noticeRef: useRef(null),
    qnaRef: useRef(null),
  };

  const CarouselStyle = {};
  const labels = ["상 세 설 명", "공 지 사 항", "Q & A"];

  const handleScrollToSectionWithOffset = (index) => {
    setTabIndex(index);
    const sectionKeys = Object.keys(sectionRefs);
    const selectedSectionKey = sectionKeys[index];
    const selectedSectionRef = sectionRefs[selectedSectionKey];

    if (selectedSectionRef && selectedSectionRef.current) {
      const elementPosition =
        selectedSectionRef.current.getBoundingClientRect().top +
        window.pageYOffset;
      window.scrollTo({
        top: elementPosition - 150,
        behavior: "smooth",
      });
    }
  };
  const rate = 100 * Math.random();

  project = {
    ...project,
    liked: liked,
    liked_count: parseInt(Math.random() * 1000),
    fundsReceive: parseInt(project.targetFunding * rate),
    achievementRate: rate,
    daysLeft: Math.ceil(
      (new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24)
    ),
    supporterCnt: parseInt(Math.random() * 1000),
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginTop: "50px" }}>
        <ProjectTitle
          projectTitle={{
            category: project.category,
            nickname: project.nickName,
            title: project.title,
            description: project.description,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexFlow: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <ImageCarousel
              images={project.productImages}
              style={{
                width: "500px",
                height: "500px",
                flex: 1,
                display: "flex",
              }}
            />
          </Grid>

          <Grid item xs={6}>
            {project && (
              <ProjectInfo
                sx={{ flex: 1, display: "flex" }}
                projectInfo={project}
                handleSponsorClick={() => {}}
                handleHeartClick={() => setLiked(!liked)}
                handleCollabClick={() => {}}
              />
            )}
          </Grid>
        </Grid>
      </div>
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
          display: "flex",
          flexFlow: "row wrap",
          justifyContent: "space-around",
          alignItems: "flex-start",
          height: "atuo",
        }}
      >
        {/* <DetailDescroption /> */}
        <div
          //id="desc-component"
          style={{
            width: "800px",
            height: "atuo",
          }}
        >
          <DetailDescroption
            descriptionDetail={project.descriptionDetail}
            descriptionImages={project.descriptionImages}
          />
        </div>
        <div
          id="gift-component"
          style={{
            width: "35%",
            position: "sticky",
            top: "130px", // 상단 고정 위치
            maxHeight: "calc(100vh - 130px)", // 뷰포트 높이에 맞춘 최대 높이
            overflowY: "auto", // 내부 스크롤 활성화
          }}
        >
          <GiftCompositionComponent
            handleSponsorClick={() => {}}
            selectedPackages={[]}
            setSelectedPackages={() => {}}
            projectId={projectId}
          />
        </div>
      </div>

      <div ref={sectionRefs.noticeRef} style={{ margin: "100px 0px 50px 0px" }}>
        <TabComponent
          tabIndex={tabIndex}
          setTabIndex={(index) => handleScrollToSectionWithOffset(index)}
          labels={labels}
          sectionRefs={sectionRefs} // ref 전달
        />
      </div>
      <div style={{ padding: "20px", width: "90%", margin: "0 auto" }}>
        <Notice />
      </div>

      <div ref={sectionRefs.qnaRef} style={{ margin: "100px 0px 50px 0px" }}>
        <TabComponent
          tabIndex={tabIndex}
          setTabIndex={(index) => handleScrollToSectionWithOffset(index)}
          labels={labels}
          sectionRefs={sectionRefs} // ref 전달
        />
      </div>

      <div style={{ padding: "20px", width: "90%", margin: "0 auto" }}>
        <QnA />
      </div>
    </div>
  );
};
