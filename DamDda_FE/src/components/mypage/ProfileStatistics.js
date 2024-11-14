import React, { useState, useEffect } from "react";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBTypography,
} from "mdb-react-ui-kit";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Modal from "./EditModal"; // 비밀번호 모달 컴포넌트
import axios from "axios"; // API 호출을 위해 axios를 import
import Cookies from "js-cookie";
import { SERVER_URL } from "constants/URLs";
import { useUser } from "UserContext";
import { BlackInputLine, InputLine } from "components/common/InputBoxComponent";
import { LoginBlueButtonComponent } from "components/common/ButtonComponent";

// *************
export default function ProfileStatistics({
  profile,
  setProfile,
  setIsEditing,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false); // 비밀번호 모달 상태
  const [passwordError, setPasswordError] = useState(""); // 비밀번호 에러 메시지
  const [password, setPassword] = useState(""); // 초기 비밀번호
  const [passwordDisplay, setPasswordDisplay] = useState(""); // 비밀번호 표시 상태
  const { user } = useUser();

  const fetchProfileData = async () => {
    try {
      // const response = await axios.get(`${SERVER_URL}/members/profile?loginId=${user.id}`, {
      const response = await axios.get(
        `${SERVER_URL}/member/profile?loginId=${user.id}`,
        {
          headers: {
            ...(Cookies.get("accessToken") && {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            }),
          },
          withCredentials: true,
        }
      );

      // 로컬 스토리지에 데이터가 없을 때 초기 비밀번호 설정
      const initialProfileData = {
        loginId: response.data.loginId,
        name: response.data.name,
        email: response.data.email,
        nickname: response.data.nickname,
        phoneNumber: response.data.phoneNumber,
        password: response.data.password,
        address: response.data.address,
        imageUrl: response.data.imageUrl,
      };
      setProfile(initialProfileData);
      setPassword(initialProfileData.password); // 비밀번호 설정
      setPasswordDisplay("*".repeat(initialProfileData.password.length)); // 비밀번호를 별표로 표시
    } catch (error) {
      console.error("프로필 데이터를 불러오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchProfileData(); // 프로필 데이터 로드
  }, []);

  // 프로필 수정 버튼 클릭 시 모달 열기
  const handleProfileEdit = () => {
    setIsModalOpen(true); // 모달 열기
  };

  const UserAvatar = ({ profile, defaultImageUrl, ...props }) => {
    return (
      <Avatar
        sx={{ width: 100, height: 100, marginTop: "20px" }}
        src={profile.imageUrl || defaultImageUrl}
        {...props}
      />
    );
  };
  if (!profile) {
    return <div>로딩 중...</div>;
  }

  const handleSubmit = async (inputPassword) => {
    // e.preventDefault();

    const formatLogin = {
      loginId: user.id,
      password: inputPassword,
    };

    console.log(formatLogin);
    try {
      let valid = true;

      // 모든 필드가 입력되었을 때만 검증 진행
      if (valid) {
        const response = await axios.post(
          `${SERVER_URL}/member/login`,
          formatLogin,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        const nickname = response.data["X-Nickname"];

        if (nickname === user.nickname) {
          setIsEditing(true); // 프로필 수정 페이지로 이동
          setPasswordError(""); // 에러 메시지 초기화
          setIsModalOpen(false); // 모달 닫기
        } else {
          setPasswordError("비밀번호가 틀렸습니다. 다시 입력해주세요.");
        }
      }
    } catch (error) {
      setPasswordError("비밀번호가 틀렸습니다. 다시 입력해주세요.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "500px",
        minWidth: "500px",
      }}
    >
      <div
        style={{
          width: "70%",
          display: "flex",
          justifyContent: "center",
          paddingBottom: "50px",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* 프로필 이미지 */}
        <div
          className="mt-3 mb-4"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <UserAvatar
            profile={profile}
            sx={{ width: 100, height: 100, margin: "20px 0" }}
          />
          <h4>{profile.nickname}</h4>
        </div>

        {/* 사용자 정보 입력 폼 */}
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 2, width: "50%" },
            marginTop: 3,
            marginLeft: "10px",
          }}
          noValidate
          autoComplete="off" // 자동 완성 끄기
        >
          <BlackInputLine
            label="아이디"
            value={profile.loginId}
            slotInputProps={{
              readOnly: true,
            }}
          />
          <BlackInputLine
            label="이름"
            value={profile.name}
            slotInputProps={{
              readOnly: true,
            }}
          />
          <BlackInputLine
            label="이메일"
            value={profile.email}
            slotInputProps={{
              readOnly: true,
            }}
          />
          <BlackInputLine
            label="닉네임"
            value={profile.nickname}
            slotInputProps={{
              readOnly: true,
            }}
          />

          <BlackInputLine
            label="휴대폰 번호"
            value={profile.phoneNumber}
            slotInputProps={{
              readOnly: true,
            }}
          />
          <BlackInputLine
            label="배송지"
            value={profile.address}
            slotInputProps={{
              readOnly: true,
            }}
          />
        </Box>
        {/* 프로필 수정 버튼 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "30px",
          }}
        >
          <LoginBlueButtonComponent
            onClick={handleProfileEdit}
            text={"프로필 수정"}
          ></LoginBlueButtonComponent>
        </div>
      </div>

      {/* 비밀번호 입력 모달 */}
      <Modal
        open={isModalOpen} // 모달이 열려 있는지 여부
        onClose={() => setIsModalOpen(false)} // 모달 닫기
        onSubmit={handleSubmit} // 비밀번호 확인 로직
        // onSubmit={handlePasswordSubmit} // 비밀번호 확인 로직
        currentPassword={password}
        errorMessage={passwordError} // 비밀번호 오류 메시지
        setError={setPasswordError}
        error={passwordError}
        instruction="암호 입력 후 회원정보 수정페이지로 이동할 수 있습니다."
      />
    </div>
  );
}
