import { useEffect, useState } from "react";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { SERVER_URL } from "constants/URLs";

const generateRandomString = () => window.btoa(Math.random()).slice(0, 20);
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

export const TossReady = () => {
  const [widgets, setWidgets] = useState(null);
  const [ready, setReady] = useState(false); // 준비 상태 추가
  const location = useLocation();
  const navigate = useNavigate();
  const { createdOrderId, createdOrderData } = location.state || {}; // orderId와 추가 정보 가져오기

  // SDK를 초기화하고 위젯을 생성함
  useEffect(() => {
    async function fetchPaymentWidgets() {
      const tossPayments = await loadTossPayments(clientKey);
      const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });
      setWidgets(widgets);
    }

    fetchPaymentWidgets();
  }, []);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (!widgets || !createdOrderData) {
        return; // 위젯이나 데이터가 준비되지 않았을 때 중단
      }

      try {
        // 결제 금액 설정
        await widgets.setAmount({
          currency: "KRW",
          value: Number(createdOrderData?.totalAmount) || 0, // 숫자 변환 및 기본값
        });

        // 결제 방법 위젯 렌더링
        await widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT",
        });

        // 결제 동의 위젯 렌더링
        await widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        });

        setReady(true); // 결제 위젯 준비 완료
      } catch (error) {
        console.error("결제 위젯 렌더링 중 오류 발생:", error);
      }
    }

    renderPaymentWidgets();
  }, [widgets, createdOrderData]);

  //결제 관리
  const handlePayment = async () => {
    if (!ready) {
      alert("결제 시스템이 아직 준비되지 않았습니다.");
      return;
    }

    try {
      await widgets.requestPayment({
        orderId: "DAMDDA-ORDER-" + createdOrderId.toString(), // 서버에서 받은 주문 ID 사용
        orderName: createdOrderData.projectTitle || "펀딩 결제", // 프로젝트 제목
        customerName: createdOrderData.name || "김토스", // 사용자 이름
        customerEmail: createdOrderData.email || "customer123@gmail.com", // 사용자 이메일
        successUrl: `${SERVER_URL}/payment/toss/success`, // 성공 시 서버로 요청
        failUrl: `${SERVER_URL}/payment/toss/fail`, // 실패 시 서버로 요청
      });

      // 결제 결과 확인을 위해 successUrl에 리다이렉트된 후 결제 상태를 가져옴
      const response = await axios.get(
        `${SERVER_URL}/payment/toss/success/paymentKey`,
        {
          params: {
            orderId: createdOrderId.toString(),
          },
          headers: {
            ...(Cookies.get("accessToken") && {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            }),
          },
        }
      );

      // 결제 상태 확인
      const { status } = response.data;
      if (status === "DONE") {
        navigate("/payment/success"); // 결제 성공 시 성공 페이지로 이동
      } else {
        // navigate('/payment/fail');  // 결제 실패 시 실패 페이지로 이동
      }
    } catch (error) {
      console.error("결제 중 오류 발생:", error);
      // navigate('/payment/fail');  // 에러 발생 시 실패 페이지로 이동
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "10px",
        overflow: "auto",
        width: "100%",
      }}
    >
      <div style={{ maxWidth: "540px", width: "100%" }}>
        <div id="payment-method" style={{ width: "100%" }} />
        <div id="agreement" style={{ width: "100%" }} />
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <button
            style={{
              padding: "11px 22px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: ready ? "#3282f6" : "#f2f4f6",
              color: ready ? "#f9fcff" : "#4e5968",
              fontWeight: "600",
              fontSize: "17px",
              cursor: ready ? "pointer" : "not-allowed",
              width: "100%",
              marginTop: "20px",
              textAlign: "center",
            }}
            onClick={handlePayment}
            disabled={!ready}
          >
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
};
