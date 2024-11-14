import React from "react";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import { SERVER_URL } from "utils/URLs";

export function ImageCarousel({ images, style }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "0",
        ...style, // 외부에서 받은 스타일을 상위 div에도 반영
      }}
    >
      {images.length > 0 && (
        <Carousel fade interval={4000} style={style}>
          {images.map((url, index) => {
            return (
              <Carousel.Item
                key={index}
                style={{ width: "100%", height: "100%" }}
              >
                <img
                  src={`${SERVER_URL}/admin/${url}`}
                  alt={`carousel-${index}`}
                  style={{
                    width: style.width, // 너비 100%
                    height: style.height, // 고정된 높이 설정
                    objectFit: "cover", // 비율 유지하며 꽉 채우기, 넘치는 부분 잘리기
                    objectPosition: "center", // 중앙 정렬
                    borderRadius: 30,
                  }}
                />
              </Carousel.Item>
            );
          })}
        </Carousel>
      )}
    </div>
  );
}
