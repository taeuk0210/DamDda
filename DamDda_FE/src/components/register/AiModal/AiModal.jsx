import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  TextField,
  Button,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import fetchAiGeneratedDescriptionDetail from "./fetchAiGeneratedDescriptionDetail";
import "./AiModal.css"; // 스타일 시트 불러오기

const AiModal = ({
  aiModalOpen,
  closeAiModal,
  aiRequestData,
  confirmAiDescriptionDetailRegistration,
}) => {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGeneratedDescriptionDetail, setAiGeneratedDescriptionDetail] =
    useState("");
  const [error, setError] = useState(null);

  // AI 설명 생성 함수 (비동기 호출)
  const generateDescriptionDetail = useCallback(async () => {
    setAiLoading(true);
    setError(null); // 에러 초기화

    try {
      const descriptionDetail = await fetchAiGeneratedDescriptionDetail(
        aiRequestData.title,
        aiRequestData.descriptionDetail,
        aiRequestData.tags,
        aiRequestData.category
      );
      setAiGeneratedDescriptionDetail(
        descriptionDetail || "생성된 설명이 없습니다."
      );
    } catch (error) {
      setAiGeneratedDescriptionDetail("");
      setError("AI 설명 생성에 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setAiLoading(false);
    }
  }, [aiRequestData]);

  // 모달이 열릴 때 설명 생성 호출
  useEffect(() => {
    if (aiModalOpen) {
      generateDescriptionDetail();
    }
  }, [aiModalOpen, generateDescriptionDetail]);

  // 재사용 가능한 버튼 렌더링 함수
  const renderButton = useCallback(
    (text, onClick, variant = "outlined", className = "") => (
      <Button variant={variant} onClick={onClick} className={className}>
        {text}
      </Button>
    ),
    []
  );

  return (
    <Modal
      open={aiModalOpen}
      onClose={closeAiModal}
      className="ModalCentered" // 모달을 중앙에 배치하는 클래스
    >
      <div className="ModalContainer">
        {/* 모달 닫기 버튼 */}
        <IconButton
          aria-label="close"
          onClick={closeAiModal}
          className="ModalCloseButton"
        >
          <CloseIcon />
        </IconButton>

        <h2 className="ModalHeader">AI 도움받기</h2>

        {/* 로딩 중일 때 */}
        {aiLoading && (
          <>
            <CircularProgress />
            <Typography variant="body1" className="LoadingText">
              AI가 최적의 상세설명을 생성 중입니다... 잠시만 기다려주세요.
            </Typography>
          </>
        )}

        {/* 에러 발생 시 */}
        {error && (
          <>
            <Typography variant="body2" className="ErrorMessage">
              {error}
            </Typography>
            {renderButton("재시도", generateDescriptionDetail, "contained")}
          </>
        )}

        {/* 로딩 및 에러가 없는 정상 상태 */}
        {!aiLoading && !error && (
          <>
            <TextField
              fullWidth
              multiline
              rows={20}
              value={aiGeneratedDescriptionDetail}
              onChange={(e) => setAiGeneratedDescriptionDetail(e.target.value)}
              InputProps={{
                classes: {
                  input: "TextAreaInput", // 텍스트 영역에 대한 커스텀 클래스 적용
                },
              }}
              className="TextFieldInput"
            />

            <div className="ButtonContainer">
              {renderButton("닫기", closeAiModal, "outlined", "OutlinedButton")}
              {renderButton("상세설명 등록", () =>
                confirmAiDescriptionDetailRegistration(
                  aiGeneratedDescriptionDetail
                )
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default AiModal;
