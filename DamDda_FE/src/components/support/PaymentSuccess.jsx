import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import styles from "components/support/css/PaymentSuccess.module.css"; // CSS Modules import
import { useNavigate } from "react-router-dom"; // useNavigate를 import
import Cookies from "js-cookie";
import { SERVER_URL } from "constants/URLs";
import cart from "assets/cart.png";

// 결제 상태를 관리하는 전역 객체
const paymentStatus = {
  completed: false,
  inProgress: false,
};

export const PaymentSuccessPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId"); // URL 쿼리에서 orderId 가져옴
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleNavigateToMyPage = () => {
    navigate("/mypage"); // 마이페이지 경로로 이동
  };

  const handleNavigateToProjects = () => {
    navigate("/entire"); // 후원한 프로젝트 경로로 이동
  };

  const [orderData, setOrderData] = useState([]); // 주문 데이터를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [error, setError] = useState(null); // 에러 상태 관리
  const accessToken = Cookies.get("accessToken");
  console.log("PaymentSuccessPage 렌더링: ", { orderId, accessToken }); // 초기 로그

  const handlePaymentCompletion = async (orderId) => {
    if (paymentStatus.completed || paymentStatus.inProgress) {
      console.log("결제 완료 처리가 이미 진행 중이거나 완료되었습니다.");
      return;
    }
    paymentStatus.inProgress = true;

    try {
      const updatedPaymentStatus = {
        paymentStatus: "결제 완료",
      };

      const response = await axios.put(
        `${SERVER_URL}/order/${orderId}/status`,
        updatedPaymentStatus,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      paymentStatus.completed = true;
    } catch (error) {
      console.error("결제 상태 변경 중 오류 발생:", error);
    } finally {
      paymentStatus.inProgress = false;
    }
  };

  const fetchOrderData = useCallback(async () => {
    if (loading) {
      try {
        const response = await axios.get(
          `${SERVER_URL}/order/details/${orderId}`,
          {
            headers: {
              ...(accessToken && {
                Authorization: `Bearer ${accessToken}`,
              }),
            },
          }
        );

        if (response.data.payment?.paymentStatus !== "결제 완료") {
          await handlePaymentCompletion(orderId);
          // 결제 완료 후 주문 데이터를 다시 가져옵니다.
          const updatedResponse = await axios.get(
            `${SERVER_URL}/order/details/${orderId}`,
            {
              headers: {
                ...(accessToken && {
                  Authorization: `Bearer ${accessToken}`,
                }),
              },
            }
          );
          setOrderData(updatedResponse.data);
        } else {
          setOrderData(response.data);
        }
      } catch (err) {
        console.error("주문 데이터 요청 오류:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  }, [orderId, accessToken, handlePaymentCompletion]);

  useEffect(() => {
    console.log("useEffect 호출됨. 주문 정보 가져오기 시도.");
    fetchOrderData();
  }, [fetchOrderData]);

  if (loading) {
    console.log("로딩 중...");
    return <p>로딩 중...</p>; // 로딩 중일 때 표시할 내용
  }

  if (error) {
    console.error("에러 발생:", error);
    return <p>에러 발생: {error}</p>; // 에러 발생 시 표시할 내용
  }

  return (
    <>
      <div className="container">
        <div className={styles["success-container"]}>
          <div className={styles["success-header"]}>
            <img
              src={cart}
              alt="Cart Icon"
              className={styles["success-image"]}
            />
            <h1>주문이 완료되었습니다!</h1>
            <p>선물은 정상 접수 완료되었으며 배송을 시작합니다!</p>
            <div className={styles["success-buttons"]}>
              <button
                className={styles["my-orders-btn"]}
                onClick={handleNavigateToMyPage} // 버튼 클릭 시 마이페이지로 이동
              >
                마이페이지
              </button>
              <button
                className={styles["other-projects-btn"]}
                onClick={handleNavigateToProjects} // 버튼 클릭 시 후원한 프로젝트로 이동
              >
                프로젝트 둘러보기
              </button>
            </div>
          </div>

          <div className={styles["order-summary-section"]}>
            <div className={styles["order-title"]}>주문 상품</div>
            <table>
              <thead>
                <tr>
                  <th>상품명</th>
                  <th>주문 일자</th>
                  <th>수량</th>
                  <th>결제 금액</th>
                </tr>
              </thead>
              <tbody>
                {orderData.paymentPackageDTO && orderData.supportingProject ? (
                  orderData.paymentPackageDTO.map((packageItem, index) => (
                    <tr key={index}>
                      <td>{packageItem.name}</td> {/* 상품명 */}
                      <td>
                        {new Date(
                          orderData.supportingProject.supportedAt
                        ).toLocaleDateString()}
                      </td>{" "}
                      {/* 주문 일자 */}
                      <td>{packageItem.count}</td> {/* 수량 */}
                      <td>
                        {parseInt(
                          packageItem.price * packageItem.count
                        ).toLocaleString()}
                        원
                      </td>{" "}
                      {/* 결제 금액 */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">주문 상품이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className={styles["details-section"]}>
            <div className={styles["shipping-info"]}>
              <div className={styles["order-title"]}>배송지 정보</div>
              <div className={styles["detail-section-content"]}>
                <p>이름: {orderData.delivery?.deliveryName}</p>
                <p>전화번호: {orderData.delivery?.deliveryPhoneNumber}</p>
                <p>
                  배송지 주소:{" "}
                  {orderData.delivery?.deliveryAddress +
                    "  (" +
                    orderData.delivery?.deliveryDetailedAddress +
                    ")"}
                </p>
              </div>
            </div>

            <div className={styles["payment-info"]}>
              <div className={styles["order-title"]}>결제 정보</div>
              <div className={styles["detail-section-content"]}>
                <p>결제 수단: {orderData.payment?.paymentMethod}</p>
                <p>
                  결제 금액:{" "}
                  {orderData.paymentPackageDTO
                    ? orderData.paymentPackageDTO
                        .reduce(
                          (total, pkg) =>
                            total + (pkg.price || 0) * (pkg.count || 1),
                          0
                        )
                        .toLocaleString()
                    : "0"}
                  원
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
