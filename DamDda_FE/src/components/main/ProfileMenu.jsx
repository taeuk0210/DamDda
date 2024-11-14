import React from "react";
import { Box, Button, IconButton, Avatar, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { BlueBorderButtonComponent } from 'components/common/ButtonComponent';

export const ProfileMenu = ({ isOpen, handleProfileMenuOpen, user, isLogin, logout }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ position: "relative" }}>
      {isLogin ? (
        <IconButton onClick={handleProfileMenuOpen}>
          {/* 사용자 프로필 이미지, 백엔드로부터 user.profileImg 제공됨 */}
          <Avatar src={user.profileImg || "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"} />
        </IconButton>
      ) : (
        <BlueBorderButtonComponent 
          style={{
            padding: '16px 32px', // 버튼 크기 조정
            fontSize: '1.2rem', // 글자 크기 조정
          }}
          onClick={() => navigate("/login")}
        >
          로그인
        </BlueBorderButtonComponent>
      )}
      {isOpen && isLogin && (
        <Box sx={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", zIndex: 1000 }}>
          <Card sx={{ padding: 2, width: 240 }}>
            <CardMedia
              component="img"
              image="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
              alt="Profile"
              sx={{ borderRadius: "50%", width: 80, height: 80, margin: "auto", marginTop: 2 }}
            />
            <CardContent>
              <Typography gutterBottom variant="h6" component="div" textAlign="center" sx={{ fontWeight: "bold" }}>
                {user.nickname} 님
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2, justifyContent: "center", alignItems: "center" }}>
                <Button 
                  variant="outlined" 
                  sx={{ borderRadius: 20, width: "120px", fontWeight: "bold" }} 
                  onClick={() => navigate("/mypage")}
                >
                  마이페이지
                </Button>
                <Button
                  variant="outlined"
                  sx={{ borderRadius: 20, width: "200px", fontWeight: "bold" }}
                  onClick={() => navigate("/mypage", { state: { activeTab: "likeProject" } })}
                >
                  ❤️관심프로젝트
                </Button>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 800, cursor: "pointer" }}
                  onClick={() => {
                    logout();  // 로그아웃 로직 호출
                    navigate("/");  // 로그아웃 후 홈으로 이동
                  }}
                >
                  로그아웃
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

// 주석 처리된 백엔드 연결 부분
/*
  user.profileImg: 백엔드에서 제공된 사용자 프로필 이미지
  user.nickname: 백엔드에서 제공된 사용자 닉네임
  logout: 로그아웃 기능을 백엔드와 연결
*/
