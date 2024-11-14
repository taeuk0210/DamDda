import React, { useState } from "react";
import { Link as MuiLink } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "UserContext";
import {
  BlueButtonComponent,
  LoginBlueButtonComponent,
  BlueBorderButtonComponent,
} from "components/common/ButtonComponent";
import {
  StandardInputBox,
  PasswordInputBox,
} from "components/common/InputBoxComponent";
import { Layout } from "components/layout/DamDdaContainer"; // Layout 컴포넌트 import
import axios from "axios";
import { SERVER_URL } from "constants/URLs";
import Cookies from "js-cookie";

export const Login = () => {
  const [formData, setFormData] = useState({ id: "", password: "" });
  const [idError, setIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const { login } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setLoginError("");
  };

  const fetchUserInfo = async (accessToken) => {
    const response = await axios.get(`${SERVER_URL}/member/userinfo`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const contextInfo = {
      id: response.data.id,
      key: response.data.key,
      profile: response.data.imageUrl,
      nickname: response.data.nickname,
    };
    login(contextInfo);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e); // 로그인 함수 호출
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formatLogin = {
      loginId: formData.id,
      password: formData.password,
    };

    try {
      let valid = true;

      // 유효성 검사
      if (!formData.id) {
        setIdError("아이디를 입력해주세요.");
        valid = false;
      } else {
        setIdError("");
      }

      if (!formData.password) {
        setPasswordError("비밀번호를 입력해주세요.");
        valid = false;
      } else {
        setPasswordError("");
      }

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

        const accessToken = response.headers["authorization"].split(" ")[1];
        if (accessToken) {
          Cookies.set("accessToken", accessToken);
        }
        fetchUserInfo(accessToken);
        navigate("/", { state: { id: formData.id } });
      }
    } catch (error) {
      setLoginError("로그인 정보가 틀렸습니다. 다시 입력해주세요.");
    }
  };

  const handleJoinClick = () => {
    navigate("/join"); // 회원가입 페이지로 이동
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
          <h2 style={{ fontWeight: "bold", marginBottom: "30px" }}>로그인</h2>
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
            <div style={{ position: "relative", marginBottom: "15px" }}>
              <StandardInputBox
                required
                fullWidth
                title="아이디"
                id="id"
                name="id"
                variant="standard"
                value={formData.id}
                onChange={handleChange}
                onKeyDown={handleKeyDown} // 여기에 추가
                error={Boolean(idError)}
                helperText={idError}
                margin="normal"
              />
            </div>

            <div style={{ position: "relative", marginBottom: "20px" }}>
              <PasswordInputBox
                title="비밀번호"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={Boolean(passwordError)}
                errorMessage={passwordError}
                onKeyDown={handleKeyDown} // 여기에 추가
                id="password"
                required={true}
              />
            </div>

            {loginError && (
              <div
                style={{ color: "red", marginTop: "5px", marginLeft: "5px" }}
              >
                {loginError}
              </div>
            )}

            <div
              style={{
                marginTop: "30px",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <LoginBlueButtonComponent
                text="로그인"
                type="submit" // 로그인 버튼을 submit으로 설정
                onKeyDown={handleKeyDown}
                sx={{ width: "150px", height: "50px" }} // 수정
              />

              <div style={{ margin: "0px 5px" }}></div>
              <BlueBorderButtonComponent
                text="회원가입"
                type="button"
                onClick={handleJoinClick}
                sx={{ margin: "20px", width: "250px", height: "50px" }}
              />
            </div>

            <div
              style={{ margin: "30px 0", borderBottom: "1px solid lightgray" }}
            />

            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <div>
                아이디를 잊어버리셨나요?{" "}
                <MuiLink component={Link} to="/find-id" variant="body2">
                  아이디 찾기
                </MuiLink>
              </div>

              <div>
                비밀번호를 잊어버리셨나요?{" "}
                <MuiLink component={Link} to="/reset-password" variant="body2">
                  비밀번호 재설정하기
                </MuiLink>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};
