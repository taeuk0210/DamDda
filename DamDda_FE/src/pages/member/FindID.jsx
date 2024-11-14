import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";

import {
  BlueButtonComponent,
  BlueBorderButtonComponent,
} from "components/common/ButtonComponent";
import { StandardInputBox } from "components/common/InputBoxComponent";
import { Layout } from "components/layout/DamDdaContainer"; // Layout 컴포넌트 import
import axios from "axios";
import { SERVER_URL } from "constants/URLs";

export const FindID = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [open, setOpen] = useState(false); // 모달 열기 상태
  const [userId, setUserId] = useState(""); // 서버에서 받은 유저 ID
  const navigate = useNavigate();

  // 입력 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 입력 값 디버깅
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNameError("");
    setEmailError("");

    // 입력 검증
    if (!formData.name) {
      setNameError("이름을 입력해주세요.");
      return;
    }
    if (!formData.email) {
      setEmailError("이메일을 입력해주세요.");
      return;
    }

    console.log(formData.name, formData.email);
    try {
      const response = await axios.get(`${SERVER_URL}/member/findid`, {
        params: { name: formData.name, email: formData.email },
        headers: {
          "Content-Type": "application/json",
        },
      });

      // 응답 로깅

      console.log("response: ", response);

      const idData = response.data;
      console.log("idData: ", idData);

      if (idData) {
        setUserId(idData);
        setOpen(true); // 모달 열기
      } else {
        alert("아이디를 찾을 수 없습니다. 다시 입력해주세요.");
      }
    } catch (error) {
      console.error("Axios 요청 중 오류 발생:", error); // 디버깅 강화
      if (error.response) {
        // 서버에서 응답을 받았으나 오류 상태 코드 반환
        console.error("서버 응답:", error.response.data);
        alert(`오류: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        // 요청은 전송되었으나 응답을 받지 못함
        console.error("요청 자체가 문제:", error.request);
        alert("네트워크 문제로 인해 서버에 연결할 수 없습니다.");
      } else {
        // 요청 설정 중 오류 발생
        console.error("설정 오류:", error.message);
        alert("요청 설정 중 문제가 발생했습니다.");
      }
    }
  };

  // 모달 닫기 핸들러
  const handleClose = () => {
    setOpen(false);
    navigate("/login"); // 로그인 페이지로 이동
  };

  return (
    <Layout>
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            flexDirection: "column",
          }}
        >
          <h2 style={{ fontWeight: "bold", marginBottom: "30px" }}>
            아이디 찾기
          </h2>

          <form
            onSubmit={handleSubmit}
            style={{
              width: "420px",
              padding: "50px",
              border: "1px solid lightgray",
              borderRadius: "10px",
              backgroundColor: "#fff",
            }}
          >
            {/* 이름 입력 */}
            <div style={{ position: "relative", marginBottom: "15px" }}>
              <StandardInputBox
                required
                fullWidth
                id="name"
                name="name"
                label="이름"
                placeholder="이름을 입력해주세요"
                variant="standard"
                value={formData.name}
                onChange={handleChange}
                error={Boolean(nameError)}
                helperText={nameError}
                margin="normal"
              />
            </div>

            {/* 이메일 입력 */}
            <div style={{ position: "relative", marginBottom: "20px" }}>
              <StandardInputBox
                required
                fullWidth
                id="email"
                name="email"
                label="이메일"
                placeholder="이메일을 입력해주세요"
                type="email"
                variant="standard"
                value={formData.email}
                onChange={handleChange}
                error={Boolean(emailError)}
                helperText={emailError}
                margin="normal"
              />
            </div>

            {/* 모달 창 */}
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>아이디 찾기 결과</DialogTitle>
              <DialogContent>아이디: {userId}</DialogContent>
              <DialogActions>
                <Button
                  onClick={() => navigate("/reset-password")}
                  color="primary"
                >
                  비밀번호 재설정
                </Button>
                <Button onClick={handleClose} color="primary">
                  닫기
                </Button>
              </DialogActions>
            </Dialog>

            {/* 버튼들 */}
            <div
              style={{
                marginTop: "30px",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <BlueButtonComponent
                text="아이디 찾기"
                type="submit" // 폼과 동기화
                sx={{ width: "145px", height: "50px" }}
              />
              <div style={{ margin: "0px 5px" }}></div>
              <BlueBorderButtonComponent
                text="로그인"
                onClick={() => navigate("/login")}
                sx={{ width: "145px", height: "50px" }}
              />
            </div>

            <div
              style={{ margin: "30px 0", borderBottom: "1px solid lightgray" }}
            />

            {/* 하단 링크 */}
            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <div>
                비밀번호를 잊어버리셨나요?{" "}
                <MuiLink component={Link} to="/reset-password" variant="body2">
                  비밀번호 재설정하기
                </MuiLink>
              </div>

              <div>
                가입을 원하시나요?{" "}
                <MuiLink component={Link} to="/join" variant="body2">
                  회원가입하러 가기
                </MuiLink>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};
