import React, { useState, useRef, useEffect } from "react"; // React
import { DetailDescroption } from "components/detail/DetailDescription";
import { Notice } from "components/detail/Notices";
import { ProjectInfo } from "components/detail/ProjectInfo";
import { QnA } from "./QnA";
import { TabComponent } from "components/common/TabComponent";
import { CollabModal } from "components/detail/CollabModal";
import { ProjectTitle } from "./ProjectTitle";
import { ImageCarousel } from "components/common/ImageCarousel";
import { GiftCompositionComponent } from "components/common/Gift/GiftCompositionComponent";
import { SERVER_URL } from "constants/URLs";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "UserContext";

////////////////////////////////////////////////////////

export const DetailPage = () => {
  //더미데이터

  //ImageCarousel
  const [Images] = useState([
    "files/carousels/20be6610-109a-498a-ad80-d3e64cc0c0e3_1.png",
    "files/carousels/e7f9e8da-5d74-44b5-901d-e5e7b2771b8b_2.png",
    "files/carousels/542de336-8048-4e56-97e8-6e868f14cb0c_3.png",
    "files/carousels/184b85b6-bf13-4d04-85b5-16182c7d60de_4.png",
    "files/carousels/b6b6d663-7e1b-410d-85a6-402836fa75b7_5.png",
    "https://img.freepik.com/free-vector/polygonal-city-elements_23-2147496342.jpg?ga=GA1.1.167959845.1724899652&semt=ais_hybrid",
    "https://img.freepik.com/free-vector/road-infographic-template_23-2147531975.jpg?ga=GA1.1.167959845.1724899652&semt=ais_hybrid",
    "https://img.freepik.com/free-vector/flat-people-doing-outdoor-activities_23-2147869120.jpg?ga=GA1.1.167959845.1724899652&semt=ais_hybrid",
  ]);

  const dummyProjectInfo = {
    fundsReceive: 11327000, // 모인 금액
    achievementRate: 2265.0, // 달성률 (퍼센트로 표현)
    daysLeft: 10, // 남은 일수
    supporterCnt: 320, // 후원자 수
    targetFunding: 5000000, // 목표 금액
    startDate: "2023-09-01", // 펀딩 시작일
    endDate: "2023-10-01", // 펀딩 종료일
    liked: true, // 사용자가 좋아요(하트)를 눌렀는지 여부
    liked_count: 120, // 좋아요를 누른 사람의 수
  };

  const { user, isLogin } = useUser();

  ///////////////////////////데이터 요청 시작/////////////////////////////
  const navigate = useNavigate();

  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const [projectId, setProjectId] = useState(query.get("projectId") || "");
  const [modalVisible, setModalVisible] = useState(false); // 모달 상태 추가

  const initialProjectDetail = {
    id: projectId, // 프로젝트 ID
    title: "프로젝트 명", // 프로젝트 명
    description: "프로젝트 설명", // 프로젝트 설명
    descriptionDetail: "프로젝트 상세설명", // 프로젝트 상세설명
    fundsReceive: 0, // 받은 후원금
    targetFunding: 0, // 목표액
    nickName: "닉네임", // 프로젝트 진행자 닉네임
    startDate: null, // 프로젝트 시작일
    endDate: null, // 프로젝트 마감일
    supporterCnt: 0, // 후원자 수
    likeCnt: 0, // 좋아요 수
    category: "전체", // 카테고리
    thumbnailUrl: "", // 썸네일 URL
    productImages: [], // 제품 이미지 리스트
    descriptionImages: [], // 설명 이미지 리스트
    tags: [], // 태그 리스트
    Liked: false, // 좋아요 여부 (기본값: false)
  };

  // const initialProjectInfo = {
  //   fundsReceive: 11327000, // 모인 금액
  //   achievementRate: 226.5, // 달성률 (퍼센트로 표현)
  //   daysLeft: 10, // 남은 일수
  //   supporterCnt: 320, // 후원자 수
  //   targetFunding: 5000000, // 목표 금액
  //   startDate: "2023-09-01", // 펀딩 시작일
  //   endDate: "2023-10-01", // 펀딩 종료일
  //   liked: true, // 사용자가 좋아요를 눌렀는지 여부
  //   liked_count: 120, // 좋아요를 누른 사람의 수
  // };

  const [projectDetail, setProjectDetail] = useState(initialProjectDetail);
  const [projectInfo, setProjectInfo] = useState();
  // const [likedCount, setLikedCount] = useState();
  // const [isHearted, setIsHearted] = useState();
  const [selectedPackages, setSelectedPackages] = useState([]);
  console.log("projectDetailprojectDetailprojectDetail : ", projectDetail);

  // 프로젝트 정보 요청을 보내는 함수
  const fetchProducts = () => {
    axios
      .get(`${SERVER_URL}/project/${projectId}`, {
        headers: {
          ...(Cookies.get("accessToken") && {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          }),
        },
      })
      .then((response) => {
        // 프로젝트 데이터를 콘솔에 출력
        if (response.data !== null) {
          setProjectDetail(response.data);
          // setIsHearted(response.data.liked);
          // setLikedCount(response.data.likeCnt);
        } else {
          setProjectDetail({});
        }
      })
      .catch((error) => {
        console.error("프로젝트 데이터를 가져오는 중 오류 발생:", error);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const currentTime = new Date();
    const endDate = new Date(projectDetail.endDate);
    const timeDifference = endDate - currentTime;

    setProjectInfo({
      fundsReceive: projectDetail.fundsReceive, // 모인 금액
      achievementRate:
        (projectDetail.fundsReceive / projectDetail.targetFunding) * 100, // 달성률 (퍼센트로 표현)
      daysLeft: Math.round(timeDifference / (1000 * 60 * 60 * 24)), // 남은 일수
      supporterCnt: projectDetail.supporterCnt, // 후원자 수
      targetFunding: projectDetail.targetFunding, // 목표 금액
      startDate: projectDetail.startDate, // 펀딩 시작일
      endDate: projectDetail.endDate, // 펀딩 종료일
      liked: projectDetail.liked, // 사용자가 좋아요를 눌렀는지 여부
      liked_count: projectDetail.likeCnt, // 좋아요를 누른 사람의 수
    });
    if (
      projectInfo &&
      projectInfo.daysLeft !== null &&
      Math.round(timeDifference / (1000 * 60 * 60 * 24)) < 0
    ) {
      setModalVisible(true);
    }
  }, [projectDetail]);
  ///////////////////////////프로젝트 정보 요청 끝/////////////////////////////

  //////////////////주문 요청 시작/////////////////////////////////////
  const handleSponsorClick = () => {
    console.log("selectedPackages: ", selectedPackages);
    if (isLogin) {
      if (Array.isArray(selectedPackages) && selectedPackages.length > 0) {
        const confirmation = window.confirm("이 프로젝트를 후원하시겠습니까?");
        if (confirmation) {
          handleNavigateToPayment();
        }
      } else {
        alert("선물구성을 선택하세요.");
      }
    } else {
      alert("로그인 후 이용이 가능합니다.");
    }
  };

  // 주문하는 코드
  const handleNavigateToPayment = () => {
    const orderInfo = {
      projectTitle: projectDetail.title, // 프로젝트 이름 (실제 값으로 설정 가능)
      selectedPackages: selectedPackages.map((pkg) => ({
        id: pkg.packageId,
        packageName: pkg.packageName, // 선택된 선물 구성의 이름
        selectedOption: pkg.selectOption, // 선택된 옵션
        price: pkg.packagePrice, // 가격
        count: pkg.selectedCount, // 수량
        RewardList: pkg.RewardList,
      })),
      totalAmount: selectedPackages.reduce(
        (acc, pkg) =>
          acc + Number(pkg.packagePrice) * Number(pkg.selectedCount), // pkg.price와 pkg.count를 숫자로 변환
        0
      ), // 총 금액 계산
      projectId: projectId, // projectId 추가
      memberId: user.key, // jwt로 바꿔야함
    };
    // 데이터 전달 전에 확인

    // navigate 함수로 orderInfo 데이터를 전달하여 payment 페이지로 이동
    navigate("/payment", { state: orderInfo });
  };

  //////////////////주문 요청 끝/////////////////////////////////////

  //////////캐러셀//////////////////////////////
  const CarouselStyle = { width: "500px", height: "500px" };

  //////////Tab 관련 시작//////////////////////////////////
  const [tabIndex, setTabIndex] = useState(0);

  // 각 섹션에 대한 ref 정의
  const sectionRefs = {
    descriptionRef: useRef(null),
    noticeRef: useRef(null),
    qnaRef: useRef(null),
  };

  const labels = ["상 세 설 명", "공 지 사 항", "Q & A"]; // 탭 레이블을 배열로 정의

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

  //////////Tab 관련 끝//////////////////////////////////

  //////협업하기/////////////////////////////////////////////////
  const [modalOpen, setModalOpen] = useState(false);
  const [collabDetails, setCollabDetails] = useState({
    title: projectDetail.title,
    name: "",
    phone: "",
    email: "",
    message: "",
    files: [],
  });

  const [errors, setErrors] = useState({
    title: false,
    name: false,
    phone: false,
    email: false,
    message: false,
  });

  const handleCollabClick = (isHearted) => {
    if (isLogin) {
      //handleCollabSubmit();
      if (projectDetail.nickName === user.nickname) {
        alert("본인 프로젝트에는 협업신청이 불가능합니다.");
      } else {
        setModalOpen(true);
      }
    } else {
      alert("로그인 후 이용이 가능합니다.");
    }
  };

  // const handleCollabSubmit = async () => {
  //   const newErrors = {
  //     title: !collabDetails.title,
  //     name: !collabDetails.name,
  //     phone: !collabDetails.phone,
  //     email: !collabDetails.email,
  //     message: !collabDetails.message,
  //   };

  //   setErrors(newErrors);

  //   const formData = new FormData();

  //   /*오늘 날짜*/
  //   const date = new Date();
  //   const year = date.getFullYear();
  //   const month = ("0" + (date.getMonth() + 1)).slice(-2);
  //   const day = ("0" + date.getDate()).slice(-2);
  //   const today = `${year}-${month}-${day}`;

  //   const jsonData = {
  //     email: collabDetails.email,
  //     phoneNumber: collabDetails.phone,
  //     content: collabDetails.message,
  //     // user_id: user.id,
  //     collaborationDTO: {
  //       title: collabDetails.title,
  //       CollaborateDate: today,
  //       name: collabDetails.name,
  //     },
  //   };

  //   formData.append("jsonData", JSON.stringify(jsonData));
  //   collabDetails.files.forEach((file, index) => {
  //     formData.append("collabDocList", file);
  //   });

  //
  //   if (
  //     !newErrors.title &&
  //     !newErrors.message &&
  //     !newErrors.name &&
  //     !newErrors.phone &&
  //     !newErrors.email
  //   ) {
  //     try {
  //
  //       const response = await axios.post(
  //         `collab/register/${projectId}`,
  //         formData,
  //         {
  //           withCredentials: true,
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //             ...(Cookies.get("accessToken") && {
  //               Authorization: `Bearer ${Cookies.get("accessToken")}`,
  //             }),
  //           },
  //         }
  //       );
  //
  //       alert("협업 요청이 전송되었습니다.");
  //       //handleModalClose();
  //     } catch (error) {
  //
  //     }
  //   }
  // };

  const handleModalClose = () => {
    const confirmation = window.confirm("창을 닫으시겠습니까?");
    if (confirmation) {
      setModalOpen(false);
      setCollabDetails({
        name: "",
        phone: "",
        email: "",
        message: "",
        files: [],
      });
      setErrors({
        title: false,
        name: false,
        phone: false,
        email: false,
        message: false,
      });
    }
  };

  //////좋아요 요청 시작////////////////////////////////////////////////
  const handleHeartClick = async () => {
    const isLike = projectDetail.liked;

    if (isLogin) {
      axios({
        method: isLike ? "DELETE" : "POST",
        url: `${SERVER_URL}/project/like`,
        params: {
          projectId: projectDetail.id,
        },
        headers: {
          ...(Cookies.get("accessToken") && {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          }),
        },
      })
        .then((response) => {
          if (response.status === 200) {
            console.log(
              `좋아요 ${isLike ? "취소" : "추가"} 성공:`,
              response.data
            );

            // 상태 업데이트 - 불변성 유지
            setProjectDetail((prevState) => ({
              ...prevState,
              liked: !prevState.liked, // liked 상태를 반전시킴
              likeCnt: isLike ? prevState.likeCnt - 1 : prevState.likeCnt + 1,
            }));
          }
        })
        .catch((e) => {
          console.error(e);
        });
    } else {
      alert("로그인 후 이용이 가능합니다.");
    }
  };
  //////좋아요 요청 끝////////////////////////////////////////////////

  return (
    <div style={{ width: "100%", margin: "0px auto" }}>
      <div style={{ marginTop: "150px" }}>
        <ProjectTitle
          projectTitle={{
            category: projectDetail.category,
            nickname: projectDetail.nickName,
            title: projectDetail.title,
            description: projectDetail.description,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexFlow: "row wrap",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <ImageCarousel
          images={projectDetail.productImages}
          style={{ width: "500px", height: "500px" }}
        />
        {projectInfo && (
          <ProjectInfo
            projectInfo={projectInfo}
            handleSponsorClick={handleSponsorClick}
            handleHeartClick={handleHeartClick}
            handleCollabClick={handleCollabClick}
          />
        )}
      </div>

      <div
        ref={sectionRefs.descriptionRef}
        style={{ margin: "100px 0px 50px 0px" }}
      >
        <TabComponent
          tabIndex={0}
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
            descriptionDetail={projectDetail.description}
            descriptionImages={projectDetail.descriptionImages.flatMap(
              (image) => Array(1).fill(image) //--------------------------------------> 이미지 한번만 나오게 해야함!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            )}
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
            handleSponsorClick={handleSponsorClick}
            selectedPackages={selectedPackages}
            setSelectedPackages={setSelectedPackages}
            projectId={projectDetail.id}
          />
        </div>
      </div>

      {modalOpen && (
        <CollabModal
          onClose={handleModalClose}
          setCollabDetails={setCollabDetails}
          collabDetails={collabDetails}
          errors={errors}
          setErrors={setErrors}
          projectId={projectDetail.id}
        />
      )}

      <div ref={sectionRefs.noticeRef} style={{ margin: "100px 0px 50px 0px" }}>
        <TabComponent
          tabIndex={1}
          setTabIndex={(index) => handleScrollToSectionWithOffset(index)}
          labels={labels}
          sectionRefs={sectionRefs} // ref 전달
        />
      </div>
      <div style={{ padding: "20px", width: "90%", margin: "0 auto" }}>
        <Notice
          nickName={projectDetail.nickName}
          projectId={projectDetail.id}
        />
      </div>

      <div ref={sectionRefs.qnaRef} style={{ margin: "100px 0px 50px 0px" }}>
        <TabComponent
          tabIndex={2}
          setTabIndex={(index) => handleScrollToSectionWithOffset(index)}
          labels={labels}
          sectionRefs={sectionRefs} // ref 전달
        />
      </div>

      <div style={{ padding: "20px", width: "90%", margin: "0 auto" }}>
        <QnA nickName={projectDetail.nickName} projectId={projectDetail.id} />
      </div>

      {modalVisible && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // 투명한 회색
            zIndex: 10,
          }}
        />
      )}
      {modalVisible && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            zIndex: 20,
            textAlign: "center",
          }}
        >
          <h2>종료된 펀딩입니다.</h2>
        </div>
      )}
    </div>
  );
};
