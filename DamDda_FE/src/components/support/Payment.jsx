import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // useNavigate와 useLocation 훅을 import
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import kakaopay from "assets/kakao.png"; // 로고 파일
import tosspay from "assets/toss.png"; // 로고 파일
import naverpay from "assets/naver.png"; // 로고 파일
import Cookies from "js-cookie";
import { SERVER_URL } from "constants/URLs";
import "./css/Payment.css";
import axios from "axios";
import {
  StyledBlueButtonComponent,
  BlueButtonComponent,
} from "components/common/ButtonComponent";
import { StandardInputBox } from "components/common/InputBoxComponent";

export function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation(); // 이전 페이지에서 전달된 데이터 접근
  const [orderInfo, setOrderInfo] = useState(location.state || {});

  // const [paymentMethod, setPaymentMethod] = useState(""); // 결제 수단 상태
  const [showCustomMessageInput, setShowCustomMessageInput] = useState(false); // 배송 메시지 입력 필드 상태
  const [customMessage, setCustomMessage] = useState(""); // 사용자 입력 배송 메시지

  //체크 박스 초기 상태
  const [checkboxes, setCheckboxes] = useState({
    allChecked: false, // 전체 동의 체크박스
    termsChecked: false, // 구매조건, 결제 진행 체크박스
    privacyChecked: false, // 개인정보 제 3자 제공 체크박스
  });

  // 전체 동의 체크박스 상태 변화 처리
  const handleAllChecked = (e) => {
    const isChecked = e.target.checked;
    setCheckboxes({
      allChecked: isChecked,
      termsChecked: isChecked,
      privacyChecked: isChecked,
    });
  };

  // 개별 체크박스 상태 변화 처리
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckboxes({
      ...checkboxes,
      [name]: checked,
      allChecked:
        checkboxes.termsChecked && checkboxes.privacyChecked && checked,
    });
  };

  // 임의로 정해놓은 값
  // const userId = 1;
  // const projectId = 2;

  useEffect(() => {
    console.log("OrderInfo updated: ", orderInfo);
  }, [orderInfo]);

  // 우편번호 api
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Order가 변경될때
  const handleOrderChange = (e) => {
    setOrderInfo({
      ...orderInfo,
      [e.target.name]: e.target.value,
    });
  };

  // 결제 수단 변경 처리
  // const handlePaymentChange = (e) => {
  //   setPaymentMethod(e.target.value); // 선택한 결제 수단 반영
  // };

  //메세지가 바뀔때
  const handleDeliveryMessageChange = (e) => {
    const selectedValue = e.target.value;

    // "직접 입력"이 선택되었을 때는 customMessage를 사용
    if (selectedValue === "직접 입력") {
      setShowCustomMessageInput(true);
      setOrderInfo({
        ...orderInfo,
        request: customMessage || "직접 입력", // "직접 입력" 상태 유지
      });
    } else {
      // 다른 메시지를 선택할 때는 customMessage를 초기화
      setShowCustomMessageInput(false);
      setCustomMessage(""); // 직접 입력 창 비활성화 시 메시지 초기화
      setOrderInfo({
        ...orderInfo,
        request: selectedValue || "문앞에 놓아주세요", // 선택하지 않으면 기본값 설정
      });
    }
  };

  // 페이지 로드 시 기본 메시지 설정 (선택하지 않았을 때 기본값을 DB로 전송)
  useEffect(() => {
    if (!orderInfo.request) {
      setOrderInfo((prevState) => ({
        ...prevState,
        request: "문앞에 놓아주세요", // 초기값 설정
      }));
    }
  }, []);

  // 직접 입력 메세지가 바뀔 때
  const handleCustomMessageChange = (e) => {
    const inputMessage = e.target.value;

    setCustomMessage(inputMessage); // 사용자 정의 메시지 반영
    setOrderInfo({
      ...orderInfo,
      request: inputMessage, // 사용자 정의 입력 시 request를 입력값으로 설정
    });
  };

  // 주문 정보 제출 및 결제 처리
  const handleSubmit = async () => {
    // 필수 입력 필드가 비어있으면 알림 띄우기
    if (
      !orderInfo.name ||
      !orderInfo.phoneNumber ||
      !orderInfo.email ||
      !orderInfo.postalCode ||
      !orderInfo.address 

    ) {
      alert("모든 정보를 기입해주세요.");
      return;
    }

    // 체크박스가 모두 선택되지 않으면 알림 띄우기
    if (!checkboxes.termsChecked || !checkboxes.privacyChecked) {
      alert("모든 체크박스를 선택해주세요.");
      return;
    }



    const deliveryMessage = orderInfo.customMessage || orderInfo.request; 
    orderInfo.selectedPackages.map((pkg) => console.log(pkg));
    console.log("order Info : ", orderInfo);
    const orderData = {
      delivery: {
        deliveryName: orderInfo.name,
        deliveryPhoneNumber: orderInfo.phoneNumber,
        deliveryEmail: orderInfo.email,
        deliveryAddress: orderInfo.address,
        deliveryDetailedAddress: orderInfo.detailAddress,
        deliveryPostCode: orderInfo.postalCode, // 우편번호를 문자열로 변환
        deliveryMessage: deliveryMessage, // 최종 메시지
      },
      payment: {
        paymentMethod: "toss pay",
        paymentStatus: "결제 대기 중", // 초기 상태
      },
      supportingProject: {
        user: {
          id: orderInfo.memberId, // 사용자 ID
        },
        project: {
          id: orderInfo.projectId, // 프로젝트 ID
        },
        supportedAt: new Date(), // 후원 날짜
      },
      supportingProject: {
        user: {
          id: orderInfo.memberId, // 사용자 ID
        },
        project: {
          id: orderInfo.projectId, // 프로젝트 ID
        },
        supportedAt: new Date(), // 후원 날짜
      },
      paymentPackageDTO: orderInfo.selectedPackages.map((pkg) => ({
        id: pkg.id,
        name: pkg.packageName,
        price: pkg.price,
        count: pkg.count,
        rewardList: pkg.selectedOption.map((sp) => ({
          rewardName: sp.rewardName,
          selectOption: sp.selectOption,
        })),
      })),
    };


    try {
      // 주문 정보 생성 POST 요청 (결제 대기중 상태로 먼저 저장)
      console.log("Order Data!:", orderData); // 서버로 전송 전에 데이터 확인
      const response = await axios.post(
        `${SERVER_URL}/order/create`,
        orderData,
        {
          headers: {
            ...(Cookies.get("accessToken") && {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            }),
          },
        }
      );
      console.log("주문생성 완료 :", response);

      // 서버에서 반환된 orderId 가져오기
      const createdOrderId = response.data.orderId; // response.data에서 orderId 값만 추출
      console.log("주문 ID:", createdOrderId);

      // 결제 수단에 따른 처리
 
        // TossPay 결제 페이지로 리디렉션
        navigate("/TossReady", {
          state: {
            createdOrderId: createdOrderId,
            createdOrderData: orderInfo,
          },
        });
      
     
    } catch (error) {
      console.error("There was an error creating the order:", error);
    }
  };

  const sample6_execDaumPostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        let addr = ""; // Address
        let extraAddr = ""; // Extra information

        if (data.userSelectedType === "R") {
          addr = data.roadAddress;
        } else {
          addr = data.jibunAddress;
        }

        if (data.userSelectedType === "R") {
          if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname;
          }
          if (data.buildingName !== "" && data.apartment === "Y") {
            extraAddr +=
              extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
          }
          if (extraAddr !== "") {
            extraAddr = " (" + extraAddr + ")";
          }
        }
        // 우편번호와 주소 정보를 업데이트
        console.log("우편번호:", data.zonecode); // 콘솔에 우편번호 출력
        console.log("주소:", addr); // 콘솔에 주소 출력

        // 우편번호와 주소 정보를 업데이트
        setOrderInfo({
          ...orderInfo,
          postalCode: data.zonecode,
          address: addr,
          extraAddress: extraAddr,
        });
      },
    }).open();
  };

  return (
    <>
      <div className="container">
        <div className="big-container">
          <div className="container">
            <div className="title">결제 페이지</div>
            <div className="order-summary">
              <p className="package-header">
                프로젝트 이름: {orderInfo.projectTitle}
              </p>
              {orderInfo.selectedPackages &&
                orderInfo.selectedPackages.map((pkg, index) => {
                  return (
                    <div key={index}>
                      <p className="package-header">선물: {pkg.packageName}</p>
                      <p className="price-info">
                        가격:{" "}
                        {pkg.price
                          ? pkg.price.toLocaleString()
                          : "가격 정보 없음"}{" "}
                        원
                      </p>
                      <p>수량: {pkg.count} 개</p>

                      {pkg.selectedOption &&
                        pkg.selectedOption.map((option, optIndex) => (
                          <div key={optIndex} className="selected-option">
                            리워드 이름: {option.rewardName} / 선택 옵션:{" "}
                            {option.selectOption}
                          </div>
                        ))}
                    </div>
                  );
                })}
            </div>

            <div className="title">주문자 정보 수정</div>
            <div className="form-section">
              <StandardInputBox
                type="text"
                name="name"
                placeholder="마이페이지에 등록된 이름"
                value={orderInfo.name}
                onChange={handleOrderChange}
                className="input"
              />
              <StandardInputBox
                type="text"
                name="phoneNumber"
                placeholder="마이페이지에 등록된 전화번호"
                value={orderInfo.phoneNumber}
                onChange={handleOrderChange}
                className="input"
              />
              <StandardInputBox
                type="email"
                name="email"
                placeholder="마이페이지에 등록된 이메일"
                value={orderInfo.email}
                onChange={handleOrderChange}
                className="input"
              />
            </div>

            <div className="title"> 배송지 정보</div>
            <div className="form-section">
              <div className="address-group">
                <StandardInputBox
                  type="text"
                  id="sample6_postcode"
                  name="postalCode"
                  placeholder="우편번호"
                  value={orderInfo.postalCode}
                  readOnly
                  className="input"
                />
                <StyledBlueButtonComponent
                  type="button"
                  text=" 우편번호 찾기"
                  onClick={sample6_execDaumPostcode}
                />
              </div>
              <StandardInputBox
                type="text"
                id="sample6_address"
                name="address"
                placeholder="주소"
                value={orderInfo.address}
                readOnly
                className="input"
              />
              <StandardInputBox
                type="text"
                id="sample6_detailAddress"
                name="detailAddress"
                placeholder="상세 주소"
                value={orderInfo.detailAddress}
                onChange={handleOrderChange}
                className="input"
              />

              <div className="delivery-message-container">
                <h1>배송 메시지</h1>
                <select
                  value={orderInfo.request}
                  onChange={handleDeliveryMessageChange}
                  className="delivery-select"
                >
                  <option value="문앞에 놓아주세요">문앞에 놓아주세요</option>
                  <option value="경비실에 맡겨주세요">
                    경비실에 맡겨주세요
                  </option>
                  <option value="직접 받을 거예요">직접 받을 거예요</option>
                  <option value="직접 입력">직접 입력</option>
                </select>
              </div>

              {showCustomMessageInput && (
                <div>
                  <textarea
                    className="custom-textarea" // 추가된 className
                    value={customMessage}
                    onChange={handleCustomMessageChange}
                    maxLength={100}
                    placeholder="직접 입력 (최대 100자)"
                  />
                </div>
              )}
            </div>

            
          </div>

          <div className="small-container">
            <div className="payment-summary">
              <div className="payment-summary-title">최종 펀딩 금액</div>
              <div className="payment-summary-amount">
                <p>상품 금액: {orderInfo.totalAmount.toLocaleString()} 원</p>{" "}
                {/* 상품 금액은 수량 곱하기 */}
                <p>배송비: 3,000 원</p>
                <p>
                  최종 금액: {(orderInfo.totalAmount + 3000).toLocaleString()}{" "}
                  원
                </p>{" "}
                {/* 최종 금액 */}
              </div>

              {/* 체크박스 그룹 */}
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={checkboxes.allChecked}
                    onChange={handleAllChecked}
                  />
                  전체 동의
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="termsChecked"
                    checked={checkboxes.termsChecked}
                    onChange={handleCheckboxChange}
                  />
                  구매조건, 결제 진행 및 결제 서비스 동의
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="privacyChecked"
                    checked={checkboxes.privacyChecked}
                    onChange={handleCheckboxChange}
                  />
                  개인정보 제 3자 제공 동의
                </label>
              </div>
              <BlueButtonComponent
                onClick={handleSubmit}
                text="간편 결제 하기"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
