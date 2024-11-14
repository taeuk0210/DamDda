import React, { useState, useEffect } from "react";
import { StatusButton } from "./ButtonComponent";
import styles from "../css/PaymentInfoCard.module.css"; // Import CSS module
import { SERVER_URL } from "constants/URLs";
import axios from "axios";
import Cookies from "js-cookie";

export const PaymentInfoCard = ({ project }) => {
  const [paymentStatus, setPaymentStatus] = useState(
    project?.supportingProject?.payment?.paymentStatus || ""
  );
  const [isCanceled, setIsCanceled] = useState(paymentStatus === "결제 취소"); // 초기 상태 설정

  console.log("초기 렌더링: 프로젝트 데이터:", project);

  // 결제 취소 로직
  const handleCancelPayment = async () => {
    if (isCanceled) {
      alert("이미 결제 취소된 주문입니다.");
      return;
    }

    const supportingProject = project?.supportingProject;
    console.log("결제 취소 요청: supportingProject:", supportingProject);

    if (!supportingProject || !supportingProject.payment) {
      console.warn("결제 정보가 없습니다.");
      alert("결제 정보가 없습니다.");
      return;
    }

    const confirmed = window.confirm("정말 결제를 취소하시겠습니까?");
    if (!confirmed) {
      console.log("사용자가 결제 취소를 취소했습니다.");
      return;
    }

    const updatedPaymentStatus = {
      supportingProject: supportingProject,
      paymentStatus: "결제 취소",
    };

    try {
      const accessToken = Cookies.get("accessToken");
      if (!accessToken) {
        alert("로그인이 필요합니다.");
        return;
      }

      const response = await axios.put(
        `${SERVER_URL}/order/${supportingProject.payment.paymentId}/cancel`,
        updatedPaymentStatus,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("결제 취소 응답:", response);
      if (response.status === 200) {
        alert("결제가 취소되었습니다.");
        setPaymentStatus("결제 취소");
        setIsCanceled(true); // 버튼 비활성화
      }
    } catch (error) {
      console.error("결제 취소 중 오류 발생:", error);
      alert("결제 취소에 실패했습니다.");
    }
  };

  useEffect(() => {
    setIsCanceled(paymentStatus === "결제 취소"); // 결제 상태 변경 시 버튼 상태 업데이트
  }, [paymentStatus]);

  const deliveryInfo = [
    { label: "수령인", value: project?.delivery?.deliveryName },
    { label: "휴대폰", value: project?.delivery?.deliveryPhoneNumber },
    {
      label: "주소",
      value: `${project?.supportingProject?.delivery?.deliveryAddress} (${project?.supportingProject?.delivery?.deliveryDetailedAddress})`,
    },
    {
      label: "요청 사항 ",
      value: project?.supportingProject?.delivery?.deliveryMessage,
    },
  ];

  const paymentInfo = [
    {
      label: "결제 방법",
      value: project?.supportingProject?.payment?.paymentMethod,
    },
    {
      label: "총 금액 ",
      value:
        project?.paymentPackageDTO.reduce(
          (total, pp) => (total = total + pp.price * pp.count),
          0
        ) + 3000,
    },
    { label: "결제 상태", value: paymentStatus },
  ];

  paymentInfo.map((pay) => console.log(pay));
  return (
    <div className={styles.container}>
      <div className={styles.deliveryInfo}>
        <div className={styles.title}>배송 정보</div>
        {deliveryInfo.map((item, index) => (
          <div className={styles.infoRow} key={index}>
            <div className={styles.label}>{item.label}:</div>
            <div>{item.value}</div>
          </div>
        ))}
      </div>

      <div className={styles.separator} />

      <div className={styles.paymentInfo}>
        <div className={styles.title}>결제 내역</div>
        {paymentInfo.map((item, index) => (
          <div className={styles.infoRow} key={index}>
            <div className={styles.label}>{item.label}:</div>
            <div>{item.value}</div>
          </div>
        ))}
      </div>

      <div className={styles.cancelButtonBox}>
        <StatusButton
          status={isCanceled ? "결제 취소됨" : "결제 취소"} // 결제 취소 시 상태 변경
          label="결제 취소"
          onClick={handleCancelPayment}
          disabled={isCanceled} // 비활성화 여부
        />
      </div>
    </div>
  );
};
