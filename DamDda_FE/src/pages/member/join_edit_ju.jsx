import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FormControl,
  FormHelperText,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import styled from "styled-components";
import { Layout } from "components/layout/DamDdaContainer";
import { SERVER_URL } from "constants/URLs";
import {
  StandardInputBox,
  PasswordInputBox,
} from "components/common/InputBoxComponent";
import {
  StyledBlueButtonComponent,
  BlueButtonComponent,
  BlueBorderButtonComponent,
} from "components/common/ButtonComponent";

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 110vh;
  flex-direction: column;
  z-index: 10;
  position: relative;
  margin-top: 140px;
  border-radius: 20px;
`;
const FormRow = styled.div`
  display: flex;
  align-items: center; /* 수직 정렬 */
  gap: 10px; /* 필드와 버튼 사이 간격 */
  width: 100%;
`;

export const Join = () => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    password_confirm: "",
    name: "",
    nickname: "",
    email: "",
    phone_number: "",
    address: "",
    detailed_address: "",
    postcode: "",
  });
  const [statusMessages, setStatusMessages] = useState({
    id: "",
    nickname: "",
    register: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => navigate(-1);

  const checkIdDuplicate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${SERVER_URL}/member/check/id?loginId=${formData.id}`
      );
      const available = response.data === "available";
      setStatusMessages((prev) => ({
        ...prev,
        id: available
          ? "사용 가능한 아이디입니다."
          : "이미 사용 중인 아이디입니다.",
      }));
      setErrors({ id: available ? "" : "이미 사용 중인 아이디입니다." });
    } catch (err) {
      setErrors({ id: "아이디 확인 중 오류가 발생했습니다." });
    }
  };

  const checkNicknameDuplicate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${SERVER_URL}/member/check/nickname?nickname=${formData.nickname}`
      );
      const available = response.data === "available";
      setStatusMessages((prev) => ({
        ...prev,
        nickname: available
          ? "사용 가능한 닉네임입니다."
          : "이미 사용 중인 닉네임입니다.",
      }));
      setErrors({ nickname: available ? "" : "이미 사용 중인 닉네임입니다." });
    } catch (err) {
      setErrors({ nickname: "닉네임 확인 중 오류가 발생했습니다." });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${SERVER_URL}/member`, formData, {
        withCredentials: true,
      });

      navigate("/login");
    } catch (err) {
      setStatusMessages((prev) => ({
        ...prev,
        register: "회원가입에 실패했습니다. 다시 시도해 주세요.",
      }));
    }
  };

  return (
    <>
      <Layout>
        <FormContainer>
          <h2 style={{ fontWeight: "bold", marginBottom: "30px" }}>회원가입</h2>
          <form
            onSubmit={handleSubmit}
            style={{
              width: "720px",
              padding: "70px",
              border: "1px solid lightgray",
              borderRadius: "10px",
              backgroundColor: "#fff",
            }}
          >
            <FormControl
              component="fieldset"
              sx={{
                gap: 3,
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              {/* 아이디 입력 필드와 중복 확인 버튼 */}
              <FormRow
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-end",
                }}
              >
                <StandardInputBox
                  title="아이디"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  error={Boolean(errors.id)}
                  errorMessage={errors.id}
                />
                <StyledBlueButtonComponent
                  text={"중복 확인"}
                  onClick={checkIdDuplicate}
                ></StyledBlueButtonComponent>
              </FormRow>

              {/* 비밀번호와 비밀번호 확인 입력 */}
              <PasswordInputBox
                title="비밀번호"
                name="password"
                placeholder="비밀번호를 입력해주세요"
                value={formData.password}
                onChange={handleChange}
                error={Boolean(errors.password)}
                errorMessage={errors.password}
              />
              <PasswordInputBox
                title="비밀번호 확인"
                name="password_confirm"
                placeholder="비밀번호 확인"
                value={formData.password_confirm}
                onChange={handleChange}
                error={Boolean(errors.password_confirm)}
                errorMessage={errors.password_confirm}
              />

              {/* 닉네임 입력 필드와 중복 확인 버튼 */}
              <FormRow
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-end",
                }}
              >
                <StandardInputBox
                  title="닉네임"
                  name="nickname"
                  placeholder="ex) 홍길동"
                  value={formData.nickname}
                  onChange={handleChange}
                  error={Boolean(errors.nickname)}
                  errorMessage={errors.nickname}
                />
                <StyledBlueButtonComponent
                  text={"중복 확인"}
                  onClick={checkNicknameDuplicate}
                ></StyledBlueButtonComponent>
              </FormRow>

              <StandardInputBox
                title="이메일"
                name="email"
                value={formData.email}
                placeholder="0000@naver.com"
                onChange={handleChange}
                error={Boolean(errors.email)}
                errorMessage={errors.email}
              />

              <StandardInputBox
                title="연락처"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="010-1234-5678"
                error={Boolean(errors.phone_number)}
                errorMessage={errors.phone_number}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={() => setChecked(!checked)}
                  />
                }
                label="이용약관에 동의합니다."
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <BlueBorderButtonComponent text="취소" onClick={handleCancel} />
                <BlueButtonComponent text="회원가입" type="submit" />
              </div>
            </FormControl>
          </form>
        </FormContainer>
      </Layout>
    </>
  );
};
