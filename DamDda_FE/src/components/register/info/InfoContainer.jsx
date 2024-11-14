import React, { useState } from "react";
import {
  TextField,
  Chip,
  IconButton,
  ThemeProvider,
  Typography,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { closestCenter } from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import datejs from "dayjs";
import { DropdownComponent } from "components/common/DropdownComponent";
import ImageCard from "./ImageCard";
import {
  baseTheme,
  InputBox,
} from "components/register/info/InputBoxComponent";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Form from "./Form";

const InfoContainer = (props) => {
  const {
    tags,
    setTags,
    formData,
    setFormData,
    productImages,
    setProductImages,
  } = props;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeId, setActiveId] = useState(null);

  const handleChange = (event) => {
    if (event.target.name === "target_funding") {
      setFormData({
        ...formData,
        [event.target.name]: event.target.value
          .replace(/[^\d]/g, "")
          .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      });
      return;
    }
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };
  // 미리보기에서 이전 이미지로 이동
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  // 미리보기에서 다음 이미지로 이동
  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  // 이미지 삭제 함수
  const handleRemoveImage = (index) => {
    const newImages = productImages.filter((_, i) => i !== index); // 클릭된 이미지 제거
    setProductImages(newImages); // 이미지 배열 업데이트
    if (currentImageIndex >= index && currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1); // 삭제된 이미지가 미리보기 중이면 인덱스 조정
    }
  };
  // 이미지 업로드 함수
  const handleProductImageChange = (e) => {
    if (productImages.length > 4) {
      window.alert(
        "제품 이미지는 최대 5장 까지 추가할 수 있습니다!\n\n더 추가하고 싶은 이미지는 상세 설명에서 추가하세요."
      );
    }
    const files = Array.from(e.target.files);
    files.forEach((_file) =>
      setProductImages([
        ...productImages,
        {
          file: _file,
          url: URL.createObjectURL(_file),
          title: _file.name,
        },
      ])
    );
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && formData.tags.trim() !== "") {
      event.preventDefault(); // 기본 Enter 동작 방지

      if (tags.length >= 5) {
        alert("입력 가능한 태그 개수를 초과했습니다. (최대 5개)");
      } else {
        setTags([...tags, formData.tags.trim()]); // 새로운 태그 추가
        setFormData({ ...formData, tags: "" }); // 태그 입력창 초기화
      }
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id); // 드래그 시작 시 activeId 설정
  };

  // 이미지 순서 변경 처리 함수
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null); // 드래그 종료 시 activeId 초기화
    if (active.id !== over.id) {
      // const oldIndex = productImages.indexOf(active.id);
      // const newIndex = productImages.indexOf(over.id);

      const oldIndex = productImages.findIndex(
        (item) => item.url === active.id
      );
      const newIndex = productImages.findIndex((item) => item.url === over.id);
      setProductImages((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleTagDelete = (index) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1); // 태그 삭제
    setTags(updatedTags);
  };

  const handleDateChange = (date, name) => {
    setFormData({ ...formData, [name]: date });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="form-container">
        {/* register product images */}
        <div className="image-section">
          <ImageCard
            productImages={productImages}
            currentImageIndex={currentImageIndex}
            handlePrevImage={handlePrevImage}
            handleNextImage={handleNextImage}
            setCurrentImageIndex={setCurrentImageIndex}
            handleProductImageChange={handleProductImageChange}
            handleDragStart={handleDragStart}
            closestCenter={closestCenter}
            handleDragEnd={handleDragEnd}
            rectSortingStrategy={rectSortingStrategy}
            handleRemoveImage={handleRemoveImage}
            activeId={activeId}
          />
        </div>

        {/* register project information */}
        <div className="text-section">
          {/* 프로젝트 제목 */}
          <Form title={"프로젝트 제목"}>
            <InputBox
              label=""
              name="title"
              value={formData.title}
              onChange={handleChange}
              tooltip={"프로젝트 제목을 입력하세요."}
            />
          </Form>
          <Form title={"프로젝트 설명"}>
            <InputBox
              label=""
              name="description"
              value={formData.description}
              onChange={handleChange}
              tooltip={"프로젝트의 간단한 설명을 입력하세요."}
            />
          </Form>
          <Form title="카테고리">
            <DropdownComponent
              name="category_id"
              menuItems={[
                "K-POP",
                "K-콘텐츠",
                "게임",
                "문화재",
                "뷰티",
                "음식",
                "패션",
              ]}
              selectValue={formData.category_id}
              onChange={handleChange}
              setValue2Index={true}
            />
          </Form>
          <Form title={"목표 금액"}>
            <InputBox
              label=""
              name="target_funding"
              value={formData.target_funding + " 원"}
              onChange={handleChange}
              tooltip={"프로젝트의 목표 후원 금액을 입력하세요."}
            />
          </Form>
          <ThemeProvider theme={baseTheme}>
            <Form title={"프로젝트 일정"}>
              <DesktopDatePicker
                label="시작일"
                value={datejs(formData.start_date)}
                format="YYYY-MM-DD"
                onChange={(date) => handleDateChange(date, "start_date")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    style={{ marginRight: "8px", flex: 1 }}
                  />
                )}
              />
              <Typography className="icon">~</Typography>
              <DesktopDatePicker
                label="종료일"
                value={datejs(formData.end_date)}
                format="YYYY-MM-DD"
                onChange={(date) => handleDateChange(date, "end_date")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    style={{ marginLeft: "8px", flex: 1 }}
                  />
                )}
              />
              <Tooltip
                title="프로젝트의 시작일과 종료일을 선택하세요."
                placement="top"
              >
                <IconButton className="icon">
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Form>
          </ThemeProvider>
          <Form title={"예상 전달일"}>
            <InputBox
              label=""
              name="target_funding"
              value="종료일로부터 30일 이내"
              tooltip={"선물은 종료일로부터 30일 이내에 전달이 되어야합니다."}
            />
          </Form>
          <Form title={"태그"}>
            <InputBox
              label=""
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              onKeyDown={handleKeyDown} // Enter 입력 처리
              placeholder="태그를 입력하고 엔터를 눌러주세요"
              tooltip={"선물의 관련 태그를 입력하세요. (최대 5개)"}
            />
          </Form>
          <Form>
            {tags.length > 0 && (
              <div className="scrollable" style={{ height: "auto" }}>
                {tags.map((tag, index) => (
                  <Chip
                    variant="outlined"
                    color="info"
                    key={index}
                    label={tag}
                    onDelete={() => handleTagDelete(index)} // 태그 삭제 처리
                    style={{ margin: "5px" }}
                  />
                ))}
              </div>
            )}
          </Form>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default InfoContainer;
