import React, { useState, useRef, useEffect } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import ReactDOM from "react-dom";
import ErrorBoundary from "pages/error/ErrorBoundary"; // 방금 만든 ErrorBoundary 컴포넌트

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { MultiCategoryComponent } from "components/common/MultiCategoryComponent";
import { BlueButtonComponent } from "components/common/ButtonComponent";
import { RedButtonComponent } from "components/common/ButtonComponent";
import { BlueBorderButtonComponent } from "components/common/ButtonComponent";
import { RedBorderButtonComponent } from "components/common/ButtonComponent";
import { DropdownComponent } from "components/common/DropdownComponent";
import { FileDownloadComponent } from "components/common/FileDownloadComponent";
import { FileUploadComponent } from "components/common/FileUploadComponent";
import { GiftCompositionComponent } from "components/common/GiftCompositionComponent";
import { ImageCarousel } from "components/common/ImageCarousel";
// import { FileDownloadComponent } from "components/common/FileDownloadComponent";
// import { FileDownloadComponent } from "components/common/FileDownloadComponent";
import { ProjectRowComponent } from "components/common/ProjectRowComponent";
import { PaginationComponent } from "components/common/PaginationComponent";
import { SearchBoxComponent } from "components/common/SearchBoxComponent";
import { InputBox } from "components/common/InputBoxComponent";
import { InputLargeBox } from "components/common/InputBoxComponent";
import { InputLine } from "components/common/InputBoxComponent";
import { ShortcutBoxComponent } from "components/common/ShortcutBoxComponent";
import { SponsoredListComponent } from "components/common/SponsoredListComponent";
import { PaymentInfoCard } from "components/common/PaymentInfoCard";
import { GiftPage } from "components/common/Gift/GiftPage";
import { TabComponent } from "components/common/TabComponent";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import StarIcon from "@mui/icons-material/Star";
import "./App.css";
///////////////////////////////////
import { Main } from "pages/main/Main";
import { Entire } from "pages/entire/Entire";
import { UserProvider } from "./UserContext";
import { Login } from "pages/member/Login";
import { Join } from "pages/member/Join";
import { ProjectDetail } from "pages/detail/ProjectDetail";
import Register from "pages/register/Register";
import { FindID } from "pages/member/FindID";
import { ResetPassword } from "pages/member/ResetPassword";
import { Payment } from "pages/support/Payment";
import { PaymentSuccess } from "pages/support/PaymentSuccess";
import { Mypage } from "pages/mypage/Mypage";
import { TossReady } from "components/support/TossReady";
import ErrorPage from "pages/error/ErrorPage";

// import { ResetPassword } from  "pages/member/ResetPassword";
const theme = createTheme({
  typography: {
    fontFamily: "Pretendard-Regular, Arial, sans-serif", // 폰트 적용
  },
});

// ScrollToTop 컴포넌트 정의
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // 페이지 이동 시 스크롤을 맨 위로 이동
    // document.documentElement.style.scrollBehavior = "auto";
    // window.scrollTo(0, 0);
    // document.documentElement.style.scrollBehavior = "";
  }, [pathname]);

  return null;
}

function App() {
  //MultiCategoryComponent
  const handleyClick = (data) => {
    alert(`${data} 클릭됨!`);
  };

  //DropdownComponent
  const [selectedValue, setSelectedValue] = useState("option2");
  const handleDropdownChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const menuItems = [
    { value: "option1", text: "Option 1" },
    { value: "option2", text: "Option 2" },
    { value: "option3", text: "Option 3" },
  ];

  //FileDownloadComponent
  const handleFileDownload = (fileName) => {
    alert(`${fileName} 파일을 다운로드합니다.`);
    // 파일 다운로드 로직을 추가
    // 실제 파일 다운로드는 서버와 통신하여 처리
  };

  //FileUploadComponent
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    // 파일 목록 처리
  };

  const handleFileUpload = (files) => {
    // 업로드 로직 처리
  };

  //GiftCompositionComponent
  const rewardData = [
    {
      amount: 1000,
      title: "선물 없이 후원하기",
      description: "감사합니다!",
      selectedCount: 0,
      remainingCount: 50,
    },
    {
      amount: 50000,
      title: "[얼리버드] 스페셜 티셔츠",
      description: "한정판 티셔츠",
      selectedCount: 10,
      remainingCount: 5,
    },
    {
      amount: 100000,
      title: "프리미엄 후원 패키지",
      description: "티셔츠 + 머그컵 + 사인 포스터",
      selectedCount: 3,
      remainingCount: 2,
    },
  ];

  //ImageCarousel
  const [CarouselImages] = useState([
    "https://img.freepik.com/free-vector/polygonal-city-elements_23-2147496342.jpg?ga=GA1.1.167959845.1724899652&semt=ais_hybrid",
    "https://img.freepik.com/free-vector/road-infographic-template_23-2147531975.jpg?ga=GA1.1.167959845.1724899652&semt=ais_hybrid",
    "https://img.freepik.com/free-vector/flat-people-doing-outdoor-activities_23-2147869120.jpg?ga=GA1.1.167959845.1724899652&semt=ais_hybrid",
  ]);

  //pagenation
  const [currentPage, setCurrentPage] = useState(1);

  //projectcard
  const mockProducts = [
    {
      id: 1,
      title: "프로젝트 A",
      description: "프로젝트 A 설명입니다.",
      thumbnailUrl: "path/to/imageA.jpg",
      targetFunding: 1000000,
      fundsReceive: 500000,
      endDate: "2024-12-31T00:00:00Z",
      nickName: "진행자A",
      liked: false,
    },
    {
      id: 2,
      title: "프로젝트 B",
      description: "프로젝트 B 설명입니다.",
      thumbnailUrl: "path/to/imageB.jpg",
      targetFunding: 2000000,
      fundsReceive: 1200000,
      endDate: "2024-11-30T00:00:00Z",
      nickName: "진행자B",
      liked: true,
    },
  ];

  //PaymentInfoCard
  const projectData = {
    supportingProject: {
      project: { title: "프로젝트 제목", thumbnailUrl: "thumbnail.jpg" },
      user: { name: "홍길동", phoneNumber: "010-1234-5678" },
      payment: {
        paymentMethod: "카드",
        paymentStatus: "결제 완료",
        paymentId: 1,
      },
      delivery: {
        deliveryAddress: "서울특별시 강남구",
        deliveryDetailedAddress: "1동 101호",
        deliveryMessage: "부재시 문 앞에 두세요",
      },
      supportedAt: new Date().toISOString(),
    },
    supportingPackage: { packageName: "패키지 A", packagePrice: 50000 },
    delivery: { deliveryId: "123" },
    status: "진행중",
  };

  //Carousel
  const CarouselStyle = { maxWidth: "70%", width: "1920px", height: "auto" };

  //
  const services = [
    {
      title: "협업하기",
      description: "함께 협업하고 성공적인 프로젝트를 만들어보세요.",
      icon: <InsertDriveFileIcon style={{ fontSize: 50, color: "white" }} />,
      backgroundColor: "#ef8055",
    },
    {
      title: "프로젝트 등록하기",
      description: "새로운 프로젝트를 등록하고 펀딩을 시작하세요.",
      icon: <AddCircleOutlineIcon style={{ fontSize: 50, color: "white" }} />,
      backgroundColor: "#7a82ed",
    },
    {
      title: "인기 프로젝트 가기",
      description: "가장 인기 있는 프로젝트에 참여하고 후원하세요.",
      icon: <StarIcon style={{ fontSize: 50, color: "white" }} />,
      backgroundColor: "#b5b5b5",
    },
  ];

  //SponsoredProject
  const projects = [
    {
      supportingProject: {
        project: { title: "Project A", thumbnailUrl: "/path/to/thumbnail.jpg" },
        supportedAt: "2023-01-01T00:00:00Z",
      },
      supportingPackage: { packageName: "Package A", packagePrice: 50000 },
      delivery: { deliveryId: "123" },
      status: "진행중",
    },
    {
      supportingProject: {
        project: { title: "Project A", thumbnailUrl: "/path/to/thumbnail.jpg" },
        supportedAt: "2023-01-01T00:00:00Z",
      },
      supportingPackage: { packageName: "Package A", packagePrice: 50000 },
      delivery: { deliveryId: "123" },
      status: "진행중",
    },
    // 다른 프로젝트 추가 가능
  ];

  //Tab
  const [tabIndex, setTabIndex] = useState(0);

  // 각 섹션에 대한 ref 정의
  const sectionRefs = {
    "후원 통계": useRef(null),
    "후원자 조회": useRef(null),
  };

  const labels = ["후원 통계", "후원자 조회"]; // 탭 레이블을 배열로 정의

  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <div style={{ fontFamily: "Pretendard-Regular" }}>
          <Router>
            <ScrollToTop /> {/* 여기에 ScrollToTop 추가 */}
            <ErrorBoundary>
              <Routes>
                <Route
                  path="/BlueButtonComponent"
                  element={
                    <BlueButtonComponent
                      text="버튼 테스트"
                      onClick={() => alert("버튼이 클릭되었습니다!")}
                      //style={buttonStyle} // 스타일 객체 전달
                    />
                  }
                />
                <Route
                  path="/BlueBorderButtonComponent"
                  element={
                    <BlueBorderButtonComponent
                      text="버튼 테스트"
                      onClick={() => alert("버튼이 클릭되었습니다!")}
                      //style={buttonStyle} // 스타일 객체 전달
                    />
                  }
                />
                <Route
                  path="/RedButtonComponent"
                  element={
                    <RedButtonComponent
                      text="버튼 테스트"
                      onClick={() => alert("버튼이 클릭되었습니다!")}
                      //style={buttonStyle} // 스타일 객체 전달
                    />
                  }
                />
                <Route
                  path="/RedBorderButtonComponent"
                  element={
                    <RedBorderButtonComponent
                      text="버튼 테스트"
                      onClick={() => alert("버튼이 클릭되었습니다!")}
                      //style={buttonStyle} // 스타일 객체 전달
                    />
                  }
                />

                <Route
                  path="/category"
                  element={
                    <MultiCategoryComponent
                      setCategory={(value) => handleyClick(value)}
                    />
                  }
                />

                <Route
                  path="/dropdown"
                  element={
                    <DropdownComponent
                      inputLabel="Select an option"
                      menuItems={menuItems}
                      selectValue={selectedValue}
                      onChange={handleDropdownChange}
                    />
                  }
                />

                <Route
                  path="/download"
                  element={
                    <FileDownloadComponent
                      handleDownload={handleFileDownload}
                      fileName="example.pdf"
                    />
                  }
                />

                <Route
                  path="/upload"
                  element={
                    <FileUploadComponent
                      handleChange={handleFileChange}
                      handleUpload={handleFileUpload}
                    />
                  }
                />

                <Route
                  path="/gifts"
                  element={<GiftCompositionComponent rewardData={rewardData} />}
                />

                <Route
                  path="/carousel"
                  element={
                    <ImageCarousel
                      images={CarouselImages}
                      style={CarouselStyle}
                    />
                  }
                />

                <Route
                  path="/pagination"
                  element={
                    <PaginationComponent
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                    />
                  }
                />

                <Route
                  path="/searchBoxComponent"
                  element={<SearchBoxComponent />}
                />

                <Route path="/inputBox" element={<InputBox />} />
                <Route path="/inputLine" element={<InputLine />} />
                <Route path="/inputLargeBox" element={<InputLargeBox />} />

                <Route
                  path="/shortcutBoxComponent"
                  element={<ShortcutBoxComponent services={services} />}
                />

                <Route
                  path="/tabComponent"
                  element={
                    <TabComponent
                      tabIndex={tabIndex}
                      setTabIndex={setTabIndex}
                      labels={labels}
                      sectionRefs={sectionRefs} // ref 전달
                    />
                  }
                />

                <Route
                  path="/sponsoredListComponent"
                  element={<SponsoredListComponent projects={projects} />}
                />
                {/* PaymentInfoCard가 표시되는 경로 */}
                <Route
                  path="/projectRowComponent"
                  element={
                    <ProjectRowComponent
                      title={"타이틀"}
                      sortCondition={"정렬기준"}
                      subTitle={"서브타이틀"}
                    />
                  }
                />

                <Route path="/gift" element={<GiftPage />} />
                {/* ////////////////////////////// */}
                <Route path="/" element={<Main />} />
                <Route path="/login" element={<Login />} />
                <Route path="/join" element={<Join />} />
                <Route path="/entire" element={<Entire />} />
                <Route path="/detail" element={<ProjectDetail />} />
                <Route path="/register" element={<Register />} />
                <Route path="/find-id" element={<FindID />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/mypage" element={<Mypage />} />
                <Route path="/TossReady" element={<TossReady />} />

                <Route path="/error" element={<ErrorPage />} />
                {/* /////////////////////////////지영//////////////////////////////////// */}
                {/* +                    <Route path="/order" element={<OrderPage />} />
                    <Route path="/user/myorders/:userId" element={<MyOrders />} />
                    <Route path="/yourpage" element={<YourPage />} />
                    <Route path="/TossReady" element={<TossReady />} /> */}

                {/* /////////////////////////////남희/////////////////////////////////// */}

                {/* 
              <Route path="/reset-password" element={<ResetPassword />} />
              
              <Route path="/detail" element={<Detail />} />
              <Route path="/register" element={<Register />} />
              <Route path="/error" element={<ErrorPage />} />
              <Route path="/projectDetail" element={<ProjectDetail />} /> */}
                {/* /////////////////////////////혜원/////////////////////////////////// */}
                {/* <Route path="/mypage" element={<MyPage />} /> */}
                {/* /////////////////////////////주현/////////////////////////////////// */}
              </Routes>
            </ErrorBoundary>
          </Router>
        </div>
      </ThemeProvider>
    </UserProvider>
  );
}
ReactDOM.render(<App />, document.getElementById("root"));

export default App;
