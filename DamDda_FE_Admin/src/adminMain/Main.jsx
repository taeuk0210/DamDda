import Login from "adminMain/Login";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { TabContext, TabList, TabPanel } from "@mui/lab";
// import TabContext from "@mui/material/Tab";
// import TabList from "@mui/material/Tab";
// import TabPanel from "@mui/material/Tab";
import ProjectPage from "projectPage/ProjectPage";
import UserPage from "userPage/UserPage";
import { useState, useEffect } from "react";
import ImagePage from "mainPage/ImagePage";
import Logout from "adminMain/Logout";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import AdminProvider, { useAdmin } from "utils/AdminContext";
import "adminMain/Main.css";

const Main = () => {
  const { isLogin, setLogin } = useAdmin();

  const location = useLocation();
  const navigate = useNavigate();

  // 현재 경로에 따라 탭을 동기화
  const getValueFromPath = (pathname) => {
    switch (pathname) {
      case "/":
        return "1";
      case "/images":
        return "2";
      case "/users":
        return "3";
      default:
        return "1"; // 기본 탭
    }
  };

  const [tab, setTab] = useState(getValueFromPath(location.pathname));

  const changeTab = (event, newValue) => {
    setTab(newValue);
    switch (newValue) {
      case "1":
        navigate("/");
        break;
      case "2":
        navigate("/images");
        break;
      case "3":
        navigate("/users");
        break;
      default:
        navigate("/");
    }
  };

  useEffect(() => {
    setTab(getValueFromPath(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    if (sessionStorage.getItem("accessToken") !== null) {
      setLogin(true);
    }
  });

  if (!isLogin) {
    return (
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={tab}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={changeTab} aria-label="lab API tabs example">
              <Tab label="프로젝트 검토" value="1" />
              <Tab label="메인페이지 관리" value="2" />
              <Tab label="회원조회" value="3" />
            </TabList>
          </Box>
        </TabContext>
        <Login />
      </Box>
    );
  } else {
    return (
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={tab}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <TabList onChange={changeTab} aria-label="lab API tabs example">
              <Tab label="프로젝트 검토" value="1" />
              <Tab label="메인페이지 관리" value="2" />
              <Tab label="회원조회" value="3" />
            </TabList>
            <Box>
              <Logout />
            </Box>
          </Box>

          <Routes>
            <Route
              path="/"
              element={
                <TabPanel value="1">
                  <ProjectPage />
                </TabPanel>
              }
            />
            <Route
              path="/images"
              element={
                <TabPanel value="2">
                  <ImagePage />
                </TabPanel>
              }
            />
            <Route
              path="/users"
              element={
                <TabPanel value="3">
                  <UserPage />
                </TabPanel>
              }
            />
          </Routes>
        </TabContext>
      </Box>
    );
  }
};

export default function RootApp() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Main />} />
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  );
}
