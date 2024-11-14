import { Header } from "components/layout/Header";
import { Footer } from "components/layout/Footer";
import "components/layout/css/DamDdaContainer.module.css"; // 오타 수정
import TranslatePage from "components/common/TranslatePage";
import React, { useState } from "react";

export function Layout({ children }) {
  return (
    <>
      <Header />
      <div style={{ width: "100%", maxWidth: "1600px", margin: "0px auto" }}>
        {children} {/* 페이지 내용이 여기에 들어감 */}
      </div>
      <Footer />
      <TranslatePage /> {/* 모든 페이지에서 번역 기능을 사용하도록 추가 */}
    </>
  );
}
