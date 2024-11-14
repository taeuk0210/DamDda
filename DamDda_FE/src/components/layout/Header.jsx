import React, { useState, useRef, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link, useNavigate } from "react-router-dom";
import logo from "assets/logo.png";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import axios from "axios"; // axios를 사용하여 REST API 호출
import Cookies from "js-cookie";
import { SERVER_URL } from "../../constants/URLs";

import { BlueButtonComponent } from "components/common/ButtonComponent";
import { BlueBorderButtonComponent } from "components/common/ButtonComponent";

import { SearchBoxComponent } from "components/common/SearchBoxComponent";
import { ProfileMenu } from "components/main/ProfileMenu";
import { ProjectList } from "components/main/ProjectList";
import { useUser } from "UserContext";
import { MyInfoBox } from "./MyInfoBox";
import { WriteProjectBox } from "./WriteProjectBox";
import { width } from "@mui/system";
export const UserAvatar = ({ profile, defaultImageUrl, ...props }) => {
  return <Avatar src={profile.imageUrl || defaultImageUrl} {...props} />;
};
export function Header() {
  const [projects, setProjects] = useState([]);

  const [showProjects, setShowProjects] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false); // 프로필 카드 표시 여부
  // const [profileOpen, setProfileOpen] = useState(false);
  const { logout, isLogin, user, setUser } = useUser();


  const navigate = useNavigate();
  console.log(user.profile);
  const profile = { imageUrl: user.profile };

  const boxRef = useRef(null); // 박스를 참조하는 ref

  // 박스 외부 클릭 감지 로직
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setShowProjects(false);
        setShowProfileCard(false);
        //alert("박스 외부 클릭됨!"); // 외부를 클릭했을 때 알럿 띄우기
      }
    };

    // 문서에 클릭 이벤트 추가
    document.addEventListener("mousedown", handleClickOutside);

    // 컴포넌트가 언마운트될 때 이벤트 제거
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [boxRef]);

  const handleOpenUserMenu = () => {
    setShowProfileCard(!showProfileCard); // 클릭 시 프로필 카드 표시 토글
    if (!showProfileCard) {
      setShowProjects(false); // 프로젝트 등록 토글을 닫음
    }
  };

  //프로필

  const handleShowProjects = () => {
    if (isLogin) {
      fetchWritingProject();
      setShowProjects(!showProjects); // 버튼을 누를 때마다 프로젝트 리스트 표시 여부 토글
      if (!showProjects) {
        setShowProfileCard(false); // 프로필 카드를 닫음
      }
    } else {
      alert("로그인 후 사용 가능합니다.");
    }
  };

  const handleProfileMenuOpen = () => {
    setShowProfileCard(!showProfileCard);
    setShowProjects(false);
  };

  // 프로젝트 등록

  const fetchWritingProject = async () => {
    const writings = await axios({
      method: "GET",
      url: `${SERVER_URL}/project/write`,
      params: {
        // memberId: user.key,
      },
      headers: {
        ...(Cookies.get("accessToken") && {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        }),
      },
    })
      .then((response) => {
        setProjects(response.data);
      })
      .catch((e) => console.error(e));
    return writings;
  };

  useEffect(() => {
    //fetchWritingProject();
  }, []);

  const navigateRegister = async () => {
    const formData = new FormData();
    formData.append(
      "projectDetailDTO",
      new Blob(
        [
          JSON.stringify({
            title: "작성중인 프로젝트",
            description: null,
            descriptionDetail: null,
            fundsReceive: null,
            targetFunding: null,
            nickName: null,
            startDate: null,
            endDate: null,
            supporterCnt: null,
            likeCnt: null,
            category: null,
            tags: [],
          }),
        ],
        { type: "application/json" }
      )
    );
    const projectId = await axios({
      method: "POST",
      url: ` ${SERVER_URL}/project/register`,
      headers: {
        "Content-Type": "multipart/form-data",
        ...(Cookies.get("accessToken") && {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        }),
      },
      data: formData,
      params: {
        // memberId: user.key,
        submit: "저장",
      },
    })
      .then((response) => response.data)
      .catch((e) => console.error(e));

    navigate(`/register?projectId=${projectId}`);
  };

  const navigateModifier = (id) => navigate(`/register?projectId=${id}`);

  const handleDeleteProject = async (id) => {
    // 프로젝트 삭제 기능
    if (
      window.confirm(
        `작성중인 프로젝트를 정말 삭제하시겠습니까?\n프로젝트 이름 : "${projects.filter((p) => p.id === id)[0].title}"`
      )
    ) {
      const responseCode = await axios({
        method: "DELETE",
        url: ` ${SERVER_URL}/project/${id}`,
        headers: {
          ...(Cookies.get("accessToken") && {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          }),
        },
      })
        .then((response) => response.status)
        .catch((e) => console.error(e));

      if (responseCode === 200) {
        setProjects(projects.filter((project) => project.id !== id));
        window.location.reload();
      }
    }
  };

  return (
    <AppBar position="fixed" sx={{ bgcolor: "#fafafa", boxShadow: "none" }}>
      <Container maxWidth="1520px" sx={{ width: "75%", margin: "0 auto" }}>
        <Toolbar
          disableGutter
          sx={{
            display: "flex",
            justifyContent: "space-between",
            height: "120px",
          }}
        >
          <Link to="/">
            <img
              src={logo}
              alt="logo"
              style={{ width: '175px', height: '65px', marginLeft: '100px' }} />
          </Link>

          <Box
            sx={{
              display: "flex", // Flexbox 레이아웃 활성화
              justifyContent: "flex-end", // 콘텐츠를 오른쪽에 배치
              width: {
                xs: "200px",
                sm: "250px",
                md: "350px",
                lg: "500px",
              },
            }}
          >
            <SearchBoxComponent />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Box
              ref={showProjects ? boxRef : null}
              sx={{ position: "relative", width: "130px" }}
            >
              <BlueButtonComponent
                text="프로젝트 등록"
                onClick={handleShowProjects}
                // style={{
                //   padding: "16px 32px", // 버튼 크기 조정
                //   fontSize: "1.2rem", // 글자 크기 조정
                // }}
              />
              {showProjects && (
                <WriteProjectBox
                  // sx={{
                  //   backgroundColor: "#7a82ed",
                  //   color: "white",
                  //   fontWeight: "bold",
                  //   borderRadius: "10px",
                  //   padding: "8px 16px",
                  //   "&:hover": {
                  //     backgroundColor: "#33C2E2",
                  //   },
                  // }}
                  projects={projects}
                  navigateRegister={navigateRegister}
                  navigateModifier={(projectId) => navigateModifier(projectId)}
                  handleDeleteProject={(projectId) =>
                    handleDeleteProject(projectId)
                  }
                />
              )}
            </Box>

            <Box
              ref={showProfileCard ? boxRef : null}
              sx={{ position: "relative" }}
            >
              {user.id ? (
                // 로그인 후 프로필 카드
                <Tooltip title="Open settings">
                  <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
                    <UserAvatar
                      profile={profile}
                      // defaultImageUrl="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
                    />
                  </IconButton>
                </Tooltip>
              ) : (
                // 로그인 전에는 로그인 버튼
                <BlueBorderButtonComponent
                  text={"로그인"}
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/login")} // 로그인 페이지로 이동
                  sx={{
                    backgroundColor: "#7a82ed",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: "10px",
                    padding: "8px 16px",
                    "&:hover": {
                      backgroundColor: "#33C2E2",
                    },
                  }}
                ></BlueBorderButtonComponent>
              )}
              {showProfileCard && user.id && <MyInfoBox></MyInfoBox>}
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
