import React from "react";
import "./css/Footer.css";
import { Collaboration } from "components/main/Collaboration";

// 이미지 import
import link1Svg from "assets/link-1.svg";
import link2Svg from "assets/link-2.svg";
import link3Svg from "assets/link-3.svg";
import link4Svg from "assets/link-4.svg";

export const Footer = () => {
  return (
    <>
      <div style={{ paddingTop: "400px" }}></div>
      <Collaboration />

      <div
        className="footer"
        maxWidth="100%"
        style={{
          marginTop: "300px",
        }}
      >
        <div className="footer-container">
          <div className="horizontal-border">
            <div className="img-wrapper-container">
              <div className="img-wrapper">
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <img className="link" alt="Link" src={link1Svg} />
                </a>
              </div>
              <div className="img-wrapper">
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <img className="link" alt="Link" src={link2Svg} />
                </a>
              </div>
              <div className="img-wrapper">
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <img className="link" alt="Link" src={link3Svg} />
                </a>
              </div>
              <div className="img-wrapper">
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <img className="link" alt="Link" src={link4Svg} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 추가적인 섹션들 */}
        <div className="footer-container-2">
          <div className="footer-wrapper">
            <div className="footer-container-3">
              <div className="container-2">
                <div className="div-wrapper">
                  <div className="text-wrapper">이용가이드</div>
                </div>
                <div className="horizontal-border-2">
                  <a
                    className="link-2"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <div className="container-3">
                      <div className="text-wrapper-2">담따의 이용방침</div>
                    </div>
                  </a>
                </div>
                <div className="horizontal-border-3">
                  <a
                    className="link-2"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <div className="container-3">
                      <div className="text-wrapper-2">담따의 서비스 소개</div>
                    </div>
                  </a>
                </div>
              </div>
              <div className="container-2">
                <div className="div-wrapper">
                  <div className="text-wrapper-3">저작권 고지</div>
                </div>
                <div className="horizontal-border-2">
                  <a
                    className="link-2"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <div className="container-4">
                      <div className="text-wrapper-2">저작권 정책</div>
                    </div>
                  </a>
                </div>
              </div>
              <div className="container-2">
                <div className="div-wrapper">
                  <div className="text-wrapper-4">도움</div>
                </div>
                <div className="horizontal-border-2">
                  <a
                    className="link-2"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <div className="container-3">
                      <a
                        className="text-wrapper-5"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        자주하는 질문
                      </a>
                    </div>
                  </a>
                </div>
                <div className="horizontal-border-3">
                  <a
                    className="link-2"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <div className="container-3">
                      <a
                        className="text-wrapper-5"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        온라인 문의하기
                      </a>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="container-6">
            <div className="margin-wrapper">
              <div className="margin-2">
                <div className="naver-cloud-logo-svg">
                  <div className="text-wrapper-6">8bit</div>
                </div>
                <br />

                <div className="container-8">
                  <div className="container-9">
                    <div className="container-10">
                      <div className="text-wrapper-7">
                        사업자등록번호: 000-000-000
                      </div>
                    </div>
                    <br />
                    <div className="container-11">
                      <div className="text-wrapper-8">
                        전화문의 000-0000-0000
                      </div>
                    </div>
                    <div className="vertical-divider" />
                  </div>
                  <div className="container-6">
                    <div className="container-12">
                      <p className="p">
                        주소: Seoul, Gangnam District
                      </p>
                    </div>
                  </div>
                  <div className="container-6">
                    <p className="text-wrapper-9">
                      © 8bit. All Rights Reserved.
                      황지영, 이주현, 강태욱, 박민후, 김민희, 한혜원, 김남희, 박세연
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
