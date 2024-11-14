import React from "react";
import { Button } from "@mui/material";

//import "../../styles/style.css";
import { Header } from "components/layout/Header";
import { Footer } from "components/layout/Footer";

import "./errorPage.css";
import errorImg from "./errorImg.png";

const ErrorPage = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = "/"; // 메인 페이지 URL로 변경
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="container1">
          <div className="error-container">
            <h1>사이트에 연결할 수 없습니다.</h1>
            <img className="img" alt="error" src={errorImg} />

            <p></p>
            <p>불편드려 죄송합니다.</p>
            <hr />
            <div className="small-text">
              계속 이 페이지가 나온다면 아래로 연락주시기 바랍니다.
              <br />
              이메일: example@example.com | 전화번호 : 000-0000-0000
            </div>
            <div className="button-container">
              <Button className="primary-button-width" onClick={handleGoBack}>
                이전 페이지로 가기
              </Button>
              <Button className="primary-button-width" onClick={handleGoHome}>
                메인으로 가기
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ErrorPage;
