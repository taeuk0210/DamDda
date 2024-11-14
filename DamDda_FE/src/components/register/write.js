import React, { useState, useRef, useEffect, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styled from "styled-components";

const Write = ({
  descriptionImagesUrl, //  기존에 저장된 이미지 URL 리스트
  descriptionDetail, // 기존에 저장된 상세 설명 내용
  setDescriptionImages, // 이미지 리스트를 업데이트하는 함수
}) => {
  // 폼 데이터 관리 (상세 설명)
  const [formData, setFormData] = useState({
    description: descriptionDetail,
  });

  const [imagePreviews, setImagePreviews] = useState([]); // 이미지 미리보기 상태

  // 컴포넌트가 렌더링될 때 초기화
  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      description: descriptionDetail, // description 필드를 업데이트, 기본값으로 빈 문자열
    }));
    setImagePreviews(descriptionImagesUrl || []); // 이미지 미리보기 업데이트
  }, [descriptionDetail, descriptionImagesUrl]);

  // 입력 파일을 참조할 ref
  const inputRef = useRef(null);

  // 이미지 업로드 핸들러 (업로드된 이미지 파일 처리)
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files); // 업로드된 파일 배열로 변환

    // 각 파일의 미리보기 URL 생성
    const filePreviews = files.map((file) => URL.createObjectURL(file));

    // 미리보기 URL을 상태에 저장 (미리보기 상태 업데이트)
    setImagePreviews((prevImages) => [...prevImages, ...filePreviews]);

    // 실제 이미지 파일을 상태에 저장 (업로드된 이미지 상태 업데이트)
    setDescriptionImages((prevImages) => [...prevImages, ...files]);
  };

  // 이미지 삭제 핸들러
  const handleImageDelete = (index) => {
    setImagePreviews((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });

    setDescriptionImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // 상세 설명 내용이 변경될 때 호출
  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  // 메모이제이션된 모듈
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ font: [] }], // 글꼴
          [{ size: [] }], // 글자 크기
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline"], // 글자 스타일
          [{ align: [] }], // 정렬
          ["image"], // 이미지 버튼 추가
          ["clean"], // 클리어 버튼 추가
        ],
        handlers: {
          image: () => {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.click();

            input.onchange = () => {
              const file = input.files[0];
              if (file) {
                handleImageUpload({ target: { files: [file] } });
              }
            };
          },
        },
      },
    }),
    []
  );

  // 숨겨진 파일 입력 필드 스타일링
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <div>
      {/* 상세설명 인풋창 */}
      <div
        style={{
          width: "100%",
          marginTop: "20px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <ReactQuill
          theme="snow"
          value={formData.description}
          onChange={handleDescriptionChange}
          style={{ height: "600px", width: "100%" }}
          modules={modules}
        />
      </div>

      {/* 이미지 미리보기 및 업로드 */}
      <div>
        {imagePreviews.map((image, index) => (
          <div key={index} style={{ display: "inline-block", margin: "10px" }}>
            <img
              src={image}
              alt={`preview-${index}`}
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
            <button onClick={() => handleImageDelete(index)}>삭제</button>
          </div>
        ))}
      </div>

      <button onClick={() => inputRef.current.click()}></button>
      <VisuallyHiddenInput
        type="file"
        ref={inputRef}
        onChange={handleImageUpload}
        multiple
      />
    </div>
  );
};

export default Write;
