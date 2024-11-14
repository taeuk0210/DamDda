import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FormControl,
  Typography,
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
  align-items: flex-end; /* 수직 정렬 */
  gap: 10px; /* 필드와 버튼 사이 간격 */
  width: 100%;
`;

export const Join = () => {
  //////////데이터 시작//////////////////
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    password: "",
    passwordConfirm: "",
    name: "",
    nickname: "",
    email: "",
    phoneNumber: "",
    //address: "",
    //detailed_address: "",
    //postcode: "",
  });

  const [errors, setErrors] = useState({
    id: { text: "", color: "gray" },
    password: { text: "", color: "gray" },
    passwordConfirm: { text: "", color: "gray" },
    name: { text: "", color: "gray" },
    nickname: { text: "", color: "gray" },
    email: { text: "", color: "gray" },
    phoneNumber: { text: "", color: "gray" },
    //address: { text: "", color: "gray" },
    //detailed_address: { text: "", color: "gray" },
    //postcode:{ text: "", color: "gray" },
  });
  //////////데이터 끝//////////////////

  /////함수 시작////////////////////////////

  const setErrorMessage = (item, text, color) => {
    setErrors((prevErrors) => ({
      ...prevErrors, // 기존 상태를 복사
      [item]: { text: text, color: color }, // item을 동적으로 키로 사용
    }));
  };

  const handleCancel = () => {
    navigate("/login");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setErrorMessage(name, "", "gray");
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  //아이디 유효성 체크
  const checkIdDuplicate = async (event) => {
    event.preventDefault();
    console.log(formData);

    const { id } = formData;

    if (id.length < 4) {
      setErrorMessage("id", "아이디는 4자 이상이어야 합니다.", "red");
      return;
    }

    try {
      const response = await axios.get(
        ` ${SERVER_URL}/member/check/id?loginId=${formData.id}`
      );
      // 응답값에 따른 메시지 설정
      if (response.data === "available") {
        setErrorMessage("id", "사용 가능한 아이디입니다.", "green");
      } else {
        setErrorMessage("id", "이미 사용중인 아이디입니다.", "red");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(
        "id",
        "아이디 확인 중 오류가 발생했습니다. 다시 시도해주세요.",
        "red"
      );
    }
  };

  // 닉네임 유효성 체크 함수
  const checkNicknameDuplicate = async (event) => {
    event.preventDefault();
    console.log(formData);

    const { nickname } = formData;

    if (nickname.length < 2) {
      setErrorMessage("nickname", "닉네임은 2자 이상이어야 합니다.", "red");
      return;
    }

    try {
      const response = await axios.get(
        `${SERVER_URL}/member/check/nickname?nickname=${nickname}`
      );
      console.log(response.data, "****"); // 서버 응답값 확인

      const isAvailable = response.data === "available"; // 서버 응답 확인
      if (response.data === "available") {
        setErrorMessage("nickname", "사용 가능한 닉네임입니다.", "green");
      } else {
        setErrorMessage("nickname", "이미 사용중인 닉네임입니다.", "red");
      }
    } catch (err) {
      setErrorMessage(
        "nickname",
        "닉네임 확인 중 오류가 발생했습니다. 다시 시도해주세요.",
        "red"
      );
    }
  };

  const submitValidation = () => {
    let submitCheck = true;
    if (!checked) {
      alert("이용약관에 동의해주세요.");
      submitCheck = false;
      // return;
    }
    if (errors.id.text !== "사용 가능한 아이디입니다.") {
      setErrorMessage("id", "아이디 중복확인을 해주세요.", "red");
      submitCheck = false;
    }
    if (errors.nickname.text !== "사용 가능한 닉네임입니다.") {
      setErrorMessage("nickname", "닉네임 중복확인을 해주세요.", "red");
      submitCheck = false;
    }
    if (formData.id.length < 4) {
      setErrorMessage("id", "아이디는 4자 이상이어야 합니다.", "red");
      submitCheck = false;
    }
    if (!/^.{8,16}$/.test(formData.password)) {
      setErrorMessage(
        "password",
        "비밀번호는 8-16자리 이상 입력해주세요!",
        "red"
      );
      submitCheck = false;
    } else {
      setErrorMessage("password", "", "gray");
    }
    if (formData.password !== formData.passwordConfirm) {
      setErrorMessage(
        "passwordConfirm",
        "비밀번호가 일치하지 않습니다.",
        "red"
      );
      submitCheck = false;
    } else {
      setErrorMessage("passwordConfirm", "", "gray");
    }
    if (!/^[가-힣a-zA-Z]+$/.test(formData.name) || formData.name.length < 1) {
      setErrorMessage("name", "올바른 이름을 입력해주세요.", "red");
      submitCheck = false;
    } else {
      setErrorMessage("name", "", "gray");
    }
    if (
      formData.nickname.length < 1 ||
      !/^[a-zA-Z0-9가-힣]+$/.test(formData.nickname)
    ) {
      setErrorMessage(
        "nickname",
        "닉네임은 1자 이상이어야 하며, 특수문자 및 띄어쓰기를 포함할 수 없습니다.",
        "red"
      );
      submitCheck = false;
    }
    if (
      !/^[A-Za-z0-9._-]+@[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)*(.[a-zA-Z]{1,})$/.test(
        formData.email
      )
    ) {
      setErrorMessage("email", "올바른 이메일 형식이 아닙니다.", "red");
      submitCheck = false;
    } else {
      setErrorMessage("email", "", "gray");
    }
    if (!/^([0-9]{2,4})-([0-9]{3,4})-([0-9]{4})$/.test(formData.phoneNumber)) {
      setErrorMessage(
        "phoneNumber",
        "올바른 연락처를 입력해주세요. ex)000-000-0000",
        "red"
      );
      submitCheck = false;
    } else {
      setErrorMessage("phoneNumber", "", "gray");
    }
    return submitCheck;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //const validation = submitValidation();

    // 에러가 없는 경우에만 폼 제출
    if (submitValidation()) {
      const formattedJoin = {
        loginId: formData.id,
        password: formData.password,
        nickname: formData.nickname,
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: "-", //formData.address,
        detailedAddress: "-", //formData.detailedAddress,
        postCode: 0, //formData.postcode,
      };
      try {
        const response = await axios.post(
          `${SERVER_URL}/member`,
          formattedJoin,
          {
            withCredentials: true,
          }
        );
        console.log(response, "성공");
        navigate("/login");
      } catch (err) {
        console.log(err);
        alert("회원가입에 실패하였습니다. 다시 한 번 확인해 주세요.");
      }
    } else {
      //alert("")
      // 에러 메시지를 사용자에게 표시
      // const errorMessages = Object.entries(currentErrors)
      //   .filter(([_, value]) => value !== "")
      //   .map(([field, message]) => `${message}`)
      //   .join("\n");
      // alert(`\n\n${errorMessages}`);
    }
  };

  /////함수 끝////////////////////////////

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

              <FormRow>
                <StandardInputBox
                  title="아이디"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                />
                <StyledBlueButtonComponent
                  onClick={checkIdDuplicate}
                  text={"중복확인"}
                />
              </FormRow>
              {errors.id.text && (
                <Typography color={errors.id.color}>
                  {errors.id.text}
                </Typography>
              )}

              {/* 비밀번호와 비밀번호 확인 입력 */}
              <PasswordInputBox
                title="비밀번호"
                name="password"
                placeholder="비밀번호를 입력해주세요"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password.text && (
                <Typography color={errors.password.color}>
                  {errors.password.text}
                </Typography>
              )}
              <PasswordInputBox
                title="비밀번호 확인"
                name="passwordConfirm"
                placeholder="비밀번호 확인"
                value={formData.passwordConfirm}
                onChange={handleChange}
              />
              {errors.passwordConfirm.text && (
                <Typography color={errors.passwordConfirm.color}>
                  {errors.passwordConfirm.text}
                </Typography>
              )}
              <FormRow>
                <StandardInputBox
                  title="이름"
                  name="name" // name 필드에 맞게 설정
                  value={formData.name} // formData의 name 필드와 매핑
                  onChange={handleChange}
                  placeholder="이름을 입력해주세요"
                />
              </FormRow>
              {errors.name.text && (
                <Typography color={errors.name.color}>
                  {errors.name.text}
                </Typography>
              )}
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
                />
                <StyledBlueButtonComponent
                  onClick={checkNicknameDuplicate}
                  text={"중복확인"}
                />
              </FormRow>
              {errors.nickname.text && (
                <Typography color={errors.nickname.color}>
                  {errors.nickname.text}
                </Typography>
              )}
              <StandardInputBox
                title="이메일"
                name="email"
                value={formData.email}
                placeholder="0000@naver.com"
                onChange={handleChange}
              />
              {errors.email.text && (
                <Typography color={errors.email.color}>
                  {errors.email.text}
                </Typography>
              )}

              <StandardInputBox
                title="연락처"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="010-1234-5678"
              />
              {errors.phoneNumber.text && (
                <Typography color={errors.phoneNumber.color}>
                  {errors.phoneNumber.text}
                </Typography>
              )}
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
                <BlueButtonComponent text="회원가입" type="submit" />
                <BlueBorderButtonComponent text="취소" onClick={handleCancel} />
              </div>
            </FormControl>
          </form>
        </FormContainer>
      </Layout>
    </>
  );
};
