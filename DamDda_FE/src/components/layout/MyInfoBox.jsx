import { useUser } from "UserContext";
import { useNavigate } from "react-router-dom";
import * as React from "react";

// Material-UI 컴포넌트들 import
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { UserAvatar } from "./Header";

export function MyInfoBox() {
  const { logout, isLogin, user } = useUser();
  const imageUrl = user.profile;
  const navigate = useNavigate(); //새로운 프로젝트 눌렀을 때 이동하는 네비게이트

  return (
    <Box
      sx={{
        position: "absolute",
        top: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        backgroundColor: "white",
        borderRadius: "15px",
        width: 240,
        padding: 2,
      }}
    >
      <Card sx={{ width: "100%", borderRadius: "15px", p: 2 }}>
        {/* <CardMedia
          component="img"
          image={imageUrl}
          alt="Profile image"
          sx={{
            borderRadius: "50%",
            width: "80px",
            height: "80px",
            margin: "auto",
            marginTop: 2,
          }}
        /> */}
        <UserAvatar
          sx={{
            borderRadius: "50%",
            width: "80px",
            height: "80px",
            margin: "auto",
            marginTop: 2,
          }}
          profile={{ imageUrl: imageUrl }}
          // defaultImageUrl="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            textAlign="center"
            sx={{ fontWeight: "bold" }}
          >
            {user.nickname} 님
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              mt: 2,
            }}
          >
            <Button
              variant="outlined"
              sx={{
                borderRadius: 20,

                width: "120px",

                fontWeight: "bold",
              }}
              onClick={() =>
                navigate(`/mypage?initIndex=${0}`, {
                  state: { forceReload: Date.now() },
                })
              }
            >
              마이페이지
            </Button>

            <Button
              variant="outlined"
              sx={{
                borderRadius: 20,

                width: "120px",

                fontWeight: "bold",
              }}
              onClick={
                () =>
                  //   `/entire?category=${'전체'}&search=${searchText}`
                  navigate(`/mypage?initIndex=${3}`, {
                    state: { forceReload: Date.now() },
                  })
                //     , {
                //   state: { activeTab: "likeProject" },
                // })
              }
            >
              ❤️관심프로젝트
            </Button>

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{
                fontWeight: 800,
                marginTop: 2,
                cursor: "pointer",
              }}
              onClick={() => {
                logout();
                navigate("/", { state: { forceReload: Date.now() } });
              }}
            >
              로그아웃
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
