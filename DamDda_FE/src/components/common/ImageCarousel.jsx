import React from "react";
import Carousel from "react-bootstrap/Carousel";
import ExampleCarouselImage from "../../assets/fresh-sale.png"; // 기본 이미지
import "bootstrap/dist/css/bootstrap.min.css";
import { ADMIN_SERVER_URL, SERVER_URL } from "constants/URLs";
export function ImageCarousel({ images, style }) {
  images =
    images.length > 0
      ? images
      : [ExampleCarouselImage, ExampleCarouselImage, ExampleCarouselImage];

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
      {images.length > 0 ? (
        <Carousel fade interval={4000} style={style}>
          {images.map((url, index) => {
            return (
              <Carousel.Item
                key={index}
                style={{ width: "100%", height: "100%" }}
              >
                <img
                  src={
                    url.substring(6, 15) === "carousels"
                      ? `${ADMIN_SERVER_URL}/${url}`
                      : url.substring(0, 5) === "files"
                        ? `${SERVER_URL}/${url}`
                        : url
                  }
                  alt={`carousel-${index}`}
                  style={{
                    width: "100%", // 너비 100%
                    height: "500px", // 고정된 높이 설정
                    objectFit: "cover", // 비율 유지하며 꽉 채우기, 넘치는 부분 잘리기
                    objectPosition: "center", // 중앙 정렬
                    borderRadius: 30,
                  }}
                />
                <Carousel.Caption>
                  <h3></h3>
                  <p></p>
                </Carousel.Caption>
              </Carousel.Item>
            );
          })}
        </Carousel>
      ) : (
        // 기본 이미지를 보여줌
        <Carousel fade interval={4000} style={style}>
          <Carousel.Item>
            <img
              src={ExampleCarouselImage}
              alt="First slide"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 30,
                objectPosition: "center", // 중앙 정렬
              }}
            />
            <Carousel.Caption>
              <h3>First slide label</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              src={ExampleCarouselImage}
              alt="Second slide"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 30,
                objectPosition: "center", // 중앙 정렬
              }}
            />
            <Carousel.Caption>
              <h3>Second slide label</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              src={ExampleCarouselImage}
              alt="Third slide"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 30,
                objectPosition: "center", // 중앙 정렬
              }}
            />
            <Carousel.Caption>
              <h3>Third slide label</h3>
              <p>
                Praesent commodo cursus magna, vel scelerisque nisl consectetur.
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      )}
    </div>
  );
}

export function MainImageCarousel({ images, style }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {images.length > 0 ? (
        <Carousel fade interval={4000} style={style}>
          {images.map((url, index) => (
            <Carousel.Item key={index}>
              <img
                src={
                  url.substring(6, 15) === "carousels"
                    ? `${ADMIN_SERVER_URL}/${url}`
                    : url.substring(0, 5) === "files"
                      ? `${SERVER_URL}/${url}`
                      : url
                }
                alt={`Slide ${index + 1}`}
                style={{
                  width: "100%",
                  height: "350px",
                  objectFit: "cover",
                  borderRadius: 30,
                }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <Carousel fade interval={4000} style={style}>
          <Carousel.Item>
            <img
              src={ExampleCarouselImage}
              alt="First slide"
              style={{
                width: "100%",
                height: "300px",
                objectFit: "cover",
                borderRadius: 30,
              }}
            />
          </Carousel.Item>

          <Carousel.Item>
            <img
              src={ExampleCarouselImage}
              alt="Second slide"
              style={{
                width: "100%",
                height: "300px",
                objectFit: "cover",
                borderRadius: 30,
              }}
            />
          </Carousel.Item>

          <Carousel.Item>
            <img
              src={ExampleCarouselImage}
              alt="Third slide"
              style={{
                width: "100%",
                height: "300px",
                objectFit: "cover",
                borderRadius: 30,
              }}
            />
          </Carousel.Item>
        </Carousel>
      )}
    </div>
  );
}
