import React, { useEffect, useState, useRef } from "react";
import { Typography, Button } from "@mui/material";
import { styled } from "@mui/system";
import { ADMIN_SERVER_URL } from "constants/URLs";

const Container = styled("div")({
  padding: "20px",
  backgroundColor: "#f0f0f0",
  display: "flex",
});

// 상세 설명 섹션 스타일
const DetailSection = styled("div")({
  display: "flex",
  flexDirection: "column",
  marginBottom: "20px",
  width: "100%",
  flex: 2,
  // maxHeight: "800px", // 최대 높이 800px
  overflow: "hidden", // 넘치는 부분 숨김
});

const ImageContainer = styled("img")({
  margin: "10px 0px",
  width: "100%",
  height: "auto",
});

export const DetailDescroption = ({ descriptionDetail, descriptionImages }) => {
  // const [detailedDescription, setDetailedDescription] = useState([]);
  const [showMore, setShowMore] = useState(false); // 더보기 상태
  const detailRef = useRef(null);

  // useEffect(() => {
  //   if (detailRef.current) {
  //     setShowMore(detailRef.current.scrollHeight > 800);
  //   }
  // }, []);

  return (
    <Container>
      {/* 상세 설명 섹션 */}
      <DetailSection ref={detailRef}>
        <Typography
          variant="body1"
          style={{
            width: "760px",
            marginTop: "10px",
            overflow: "auto",
            whiteSpace: "pre-line", // pre-line 대신 normal로 변경
            textAlign: "center", // 가운데 정렬
            fontSize: "18px", // 폰트 크기 조정
            wordBreak: "break-word", // 긴 단어 줄바꿈
            overflowWrap: "break-word", // 긴 텍스트 줄바꿈
          }}
        >
          {descriptionDetail}
        </Typography>
        {descriptionImages && descriptionImages.length > 0 ? (
          descriptionImages.map((image, index) => {
            return (
              <ImageContainer
                key={index}
                src={
                  image.includes("http")
                    ? image
                    : `${ADMIN_SERVER_URL}/${image}`
                }
                alt={`Product image ${index}`}
              />
            );
          })
        ) : (
          <Typography variant="body2" color="textSecondary">
            이미지가 없습니다.
          </Typography>
        )}

        {/* 더보기 버튼 표시 조건 수정 */}
        {/* {detailRef.current &&
          detailRef.current.scrollHeight > 800 &&
          !showMore && (
            <Button onClick={() => setShowMore(true)}>▽ 더보기</Button>
          )} */}
        {/* 상세 내용이 더보기 상태일 때 모든 내용 표시 */}
        {/* {showMore && (
          <div>
            <Typography variant="body1" style={{ marginTop: "10px" }}>
              {descriptionDetail}
            </Typography>

            {descriptionImages.map((image, index) => (
              <ImageContainer
                key={index}
                src={image}
                alt={`Product image ${index}`}
              />
            ))}
          </div>
        )} */}
      </DetailSection>
    </Container>
  );
};
