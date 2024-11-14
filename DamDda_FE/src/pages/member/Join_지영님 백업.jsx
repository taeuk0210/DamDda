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
import { South } from "@mui/icons-material";

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
  const [checked, setChecked] = useState(false);
  // 메시지 상태 설정
  const [statusMessages, setStatusMessages] = useState({
    id: "",
    nickname: "",
    register: "",
  });

  const [errors, setErrors] = useState({});
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

  const navigate = useNavigate();
  const [available, setAvailable] = useState(null); // 초기 값은 null로 설정
  const [nicknameAvailable, setNicknameAvailable] = useState(null); // 닉네임 사용 가능 여부 추가
  // available 상태 변경 시 메시지 업데이트
  useEffect(() => {
    console.log("available 상태 변경됨:", available); // 상태 변경 확인용 로그

    if (available === null) return; // 초기 상태면 아무 작업도 하지 않음

    const message = available
      ? "사용 가능한 아이디입니다."
      : "이미 사용 중인 아이디입니다.";

    console.log("메시지 업데이트:", message); // 메시지 로그

    // 상태를 객체 형태로 유지하여 업데이트
    setStatusMessages((prev) => ({ ...prev, id: message }));
    setFormData((prev) => ({ ...prev })); // 강제로 리렌더링 유도

    setErrors((prev) => ({ ...prev, id: available ? "" : message }));
  }, [available]);

  // available 상태 변경 시 메시지 업데이트 (닉네임 포함)
  useEffect(() => {
    console.log("닉네임 상태 변경됨:", nicknameAvailable); // 상태 변경 확인용 로그

    if (nicknameAvailable === null) return; // 초기 상태면 아무 작업도 하지 않음

    const message = nicknameAvailable
      ? "사용 가능한 닉네임입니다."
      : "이미 사용 중인 닉네임입니다.";
    console.log("닉네임 메시지 업데이트:", message); // 메시지 로그

    setStatusMessages((prev) => ({ ...prev, nickname: message }));
    setFormData((prev) => ({ ...prev })); // 강제로 리렌더링 유도
    setErrors((prev) => ({
      ...prev,
      nickname: nicknameAvailable ? "" : message,
    }));
  }, [nicknameAvailable]); // 닉네임 상태 변경 시 실행

  /////////////////////////////////////////////

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAgree = (event) => {
    setChecked(event.target.checked);
  };

  const handleCancel = () => {
    navigate("/login");
  };

  //아이디 유효성 체크
  const checkIdDuplicate = async (event) => {
    event.preventDefault();
    console.log(formData);

    const { id } = formData;

    if (id.length < 4) {
      setStatusMessages((prev) => ({
        ...prev,
        id: "아이디는 4자 이상이어야 합니다.",
      }));
      setErrors({ id: "아이디는 4자 이상이어야 합니다." });
      return;
    }

    try {
      const response = await axios.get(
        ` ${SERVER_URL}/member/check/id?loginId=${formData.id}`
      );
      console.log(response.data, "****"); // 서버 응답값을 명확히 확인

      // 응답값에 따른 메시지 설정
      const isAvailable = response.data === "available"; // 서버 응답 확인
      setAvailable(isAvailable);
    } catch (err) {
      console.error(err);
      setStatusMessages((prev) => ({
        ...prev,
        id: "아이디 확인 중 오류가 발생했습니다. 다시 시도해주세요.",
      }));
      setErrors({ id: "아이디 확인 중 오류가 발생했습니다." });
    }
  };
  // 닉네임 유효성 체크 함수
  const checkNicknameDuplicate = async (event) => {
    event.preventDefault();
    console.log(formData);

    const { nickname } = formData;

    if (nickname.length < 2) {
      setStatusMessages((prev) => ({
        ...prev,
        nickname: "닉네임은 2자 이상이어야 합니다.",
      }));
      setErrors({ nickname: "닉네임은 2자 이상이어야 합니다." });
      return;
    }

    try {
      const response = await axios.get(
        `${SERVER_URL}/check/nickname?nickname=${nickname}`
      );
      console.log(response.data, "****"); // 서버 응답값 확인

      const isAvailable = response.data === "available"; // 서버 응답 확인
      setNicknameAvailable(isAvailable); // 상태 업데이트
    } catch (err) {
      console.error(err);
      setStatusMessages((prev) => ({
        ...prev,
        nickname: "닉네임 확인 중 오류가 발생했습니다. 다시 시도해주세요.",
      }));
      setErrors({ nickname: "닉네임 확인 중 오류가 발생했습니다." });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      id,
      password,
      password_confirm,
      name,
      nickname,
      email,
      phone_number,
      address,
      detailed_address,
    } = formData;

    const currentErrors = {
      id: id.length < 4 ? "아이디는 4자 이상이어야 합니다." : "",
      password: !/^.{8,16}$/.test(password)
        ? "비밀번호는 8-16자리 이상 입력해주세요!"
        : "",
      password_confirm:
        password !== password_confirm ? "비밀번호가 일치하지 않습니다." : "",
      name:
        /^[가-힣a-zA-Z]+$/.test(name) && name.length >= 1
          ? ""
          : "올바른 이름을 입력해주세요.",
      nickname:
        nickname.length >= 1 && /^[a-zA-Z0-9가-힣]+$/.test(nickname)
          ? ""
          : "닉네임은 1자 이상이어야 하며, 특수문자 및 띄어쓰기를 포함할 수 없습니다.",
      email:
        /^[A-Za-z0-9._-]+@[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)*(.[a-zA-Z]{1,})$/.test(
          email
        )
          ? ""
          : "올바른 이메일 형식이 아닙니다.",
      phone_number: /^([0-9]{2,4})-([0-9]{3,4})-([0-9]{4})$/.test(phone_number)
        ? ""
        : "올바른 연락처를 입력해주세요.",
      address: address.length >= 0 ? "" : "주소를 입력해주세요.",
      detailed_address:
        address && detailed_address.length < 1
          ? "상세주소를 입력해주세요."
          : "",
    };

    // 아이디와 닉네임 중복 확인
    if (!statusMessages.id.includes("사용 가능한 아이디입니다.")) {
      if (window.confirm("닉네임 중복 확인이 필요합니다. ")) {
        return;
      }
    }
    if (!statusMessages.nickname.includes("사용 가능한 닉네임입니다.")) {
      if (window.confirm("닉네임 중복 확인이 필요합니다. ")) {
        return;
      }
    }

    // statusMessages에서 중복 확인 결과 가져오기
    if (
      statusMessages.id &&
      !statusMessages.id.includes("사용 가능한 아이디입니다.")
    ) {
      currentErrors.id = statusMessages.id;
    }
    if (
      statusMessages.nickname &&
      !statusMessages.nickname.includes("사용 가능한 닉네임입니다.")
    ) {
      currentErrors.nickname = statusMessages.nickname;
    }

    setErrors(currentErrors);

    // 에러가 없는 경우에만 폼 제출
    if (!Object.values(currentErrors).some((error) => error)) {
      console.log("폼 제출 가능: 에러 없음");
      onhandlePost(formData);
    } else {
      console.log("폼 제출 불가: 다음 에러가 있습니다", currentErrors);
      // 에러 메시지를 사용자에게 표시
      const errorMessages = Object.entries(currentErrors)
        .filter(([_, value]) => value !== "")
        .map(([field, message]) => `${message}`)
        .join("\n");
      alert(`\n\n${errorMessages}`);
    }
  };

  const onhandlePost = async (data) => {
    const formattedJoin = {
      loginId: data.id,
      password: data.password,
      nickname: data.nickname,
      name: data.name,
      email: data.email,
      phoneNumber: data.phone_number,
      address: data.address,
      detailedAddress: data.detailed_address,
      postCode: data.postcode,
    };

    try {
      const response = await axios.post(`${SERVER_URL}/member`, formattedJoin, {
        withCredentials: true,
      });

      console.log(response + "성공");
      navigate("/login");
    } catch (err) {
      console.log(err);
      setStatusMessages((prev) => ({
        ...prev,
        register: "회원가입에 실패하였습니다. 다시 한 번 확인해 주세요.",
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
                  errorMessage={statusMessages.id} // 여기에서 메시지가 표시되는지 확인
                />
                <StyledBlueButtonComponent
                  onClick={checkIdDuplicate}
                  text={"중복확인"}
                />
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
              <FormRow>
                <StandardInputBox
                  title="이름"
                  name="name" // name 필드에 맞게 설정
                  value={formData.name} // formData의 name 필드와 매핑
                  onChange={handleChange}
                  placeholder="이름을 입력해주세요"
                  error={Boolean(errors.name)} // 오류가 name에 맞게 확인되도록 설정
                  errorMessage={errors.name} // 오류 메시지 전달
                />
              </FormRow>

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
                  errorMessage={statusMessages.nickname} // 메시지 표시 확인
                />
                <StyledBlueButtonComponent
                  onClick={checkNicknameDuplicate}
                  text={"중복확인"}
                />
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
                name="phone_nu 확ㅇmber"
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
