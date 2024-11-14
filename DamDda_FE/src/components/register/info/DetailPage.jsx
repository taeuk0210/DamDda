import { useState, useRef } from 'react';
import { Modal, Snackbar, IconButton, Paper, Input } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import Write from '../write';
import AiModal from '../AiModal/AiModal';
import { BlueButtonComponent } from 'components/common/ButtonComponent';
import { FileUploadComponent } from 'components/common/FileUploadComponent';
import { SERVER_URL } from 'constants/URLs';

//상세설명 페이지
const DetailPage = (props) => {
    const { descriptionImages, descriptionDetail, setDescriptionDetail, setDescriptionImages, aiRequestData } = props;
    const [confirmationOpen, setConfirmationOpen] = useState(false); // 설명 등록 확인 모달 상태
    const [snackbarOpen, setSnackbarOpen] = useState(false); // 스낵바 상태 (알림)

    // --------생성형 AI 모달 관련 상태 및 함수 시작--------

    const [aiModalOpen, setAiModalOpen] = useState(false);
    // AI 모달의 열림/닫힘 상태를 관리하는 상태 변수

    /**
     * AI 모달을 닫는 함수
     * 모달을 닫는 작업을 수행할 때 호출됩니다.
     */
    const closeAiModal = () => {
        setAiModalOpen(false); // 모달을 닫기 위해 상태를 false로 변경
    };

    /**
     * AI가 생성한 설명을 formData에 저장하고 모달을 닫는 함수
     * @param {string} aiGeneratedDescriptionDetail - AI가 생성한 프로젝트 설명
     */
    const confirmAiDescriptionDetailRegistration = (
        aiGeneratedDescriptionDetail,
        uploadFiles // AI 생성 설명에 추가할 이미지 파일
    ) => {
        // AI가 생성한 설명을 forData에 저장
        setDescriptionDetail(aiGeneratedDescriptionDetail);

        // 이미지 업로드: AI 설명에 새로운 이미지 파일 추가
        if (uploadFiles && uploadFiles.length > 0) {
            const newImages = Array.from(uploadFiles).map((file) => ({
                file: file,
                url: URL.createObjectURL(file),
                title: file.name,
            }));

            // 기존 이미지 배열에 새로운 이미지 추가
            setDescriptionImages((prevImaages) => [...prevImaages, ...newImages]);
        }

        // 설명 등록 후 모달 닫음
        closeAiModal();
    };

    // --------생성형 AI 모달 관련 상태 및 함수 종료--------

    // 입력 파일을 참조할 ref
    const inputRef = useRef(null);

    const handleConfirmRegister = () => {
        setConfirmationOpen(false);
        setSnackbarOpen(true);
    };

    const handleCloseConfirmation = () => {
        setConfirmationOpen(false);
    };
    // 스낵바 닫기
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // 이미지 삭제 함수
    const handleRemoveImage = (index) => {
        const newImages = descriptionImages.filter((_, i) => i !== index); // 클릭된 이미지 제거
        setDescriptionImages(newImages);
    };

    // 이미지 업로드 함수
    const handleUploadImage = (e) => {
        try {
            const files = Array.from(e.target.files);
            const newImages = files.map((file) => ({
                file: file,
                url: URL.createObjectURL(file),
                title: file.name,
            }));

            setDescriptionImages((prevImaages) => [...prevImaages, ...newImages]);
        } catch (error) {}
    };

    // 상세 설명 내용이 변경될 때 호출
    const handleDescriptionChange = (value) => {
        setDescriptionDetail(value);
    };

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="column-container">
                    {/* 페이지 제목과 버튼 */}
                    <div className="header-container">
                        <h1>상세 설명</h1>
                        <div className="button-right">
                            <BlueButtonComponent text="AI 도움받기" onClick={() => setAiModalOpen(true)} />
                        </div>
                    </div>

                    {/* 상세설명 인풋창 */}
                    <div className="detail-input">
                        <ReactQuill
                            theme="snow"
                            value={descriptionDetail}
                            onChange={handleDescriptionChange}
                            style={{ height: '300px', width: '1200px' }}
                        />

                        {/* <Write
              descriptionImagesUrl={descriptionImages.map((img) => img.url)}
              descriptionDetail={descriptionDetail}
              setDescriptionImages={setDescriptionImages}
            /> */}
                    </div>

                    {/* 이미지 미리보기 및 업로드 */}
                    <div className="detail-section">
                        <h3>프로젝트 상세 이미지 등록</h3>
                        <FileUploadComponent
                            handleChange={handleUploadImage}
                            handleUpload={handleUploadImage}
                            text="📤이미지 파일 업로드"
                            detail="프로젝트를 설명할 수 있는 이미지를 추가하세요."
                        />
                        <Paper className="detail-paper">
                            {descriptionImages.map((image, index) => (
                                <div className="detail-image" key={index}>
                                    <img
                                        className="detail-image-image"
                                        src={image.file === null ? `${SERVER_URL}/${image.url}` : image.url}
                                        alt={`preview-${index}`}
                                    />
                                    <IconButton
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleRemoveImage(index);
                                        }}
                                        color="warning"
                                        style={{ position: 'absolute', top: 0, right: 0 }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </div>
                            ))}
                            <Input
                                className="detail-image-preview"
                                type="file"
                                inputProps={{ multiple: true }}
                                ref={inputRef}
                                onChange={handleUploadImage}
                            />
                        </Paper>
                    </div>
                </div>
            </LocalizationProvider>

            {/* 생성형 AI 도움받기 모달 */}
            <AiModal
                aiModalOpen={aiModalOpen}
                closeAiModal={closeAiModal}
                aiRequestData={aiRequestData}
                confirmAiDescriptionDetailRegistration={confirmAiDescriptionDetailRegistration}
            />

            {/* 등록 확인 모달 */}
            <Modal open={confirmationOpen} onClose={handleCloseConfirmation}>
                <div className="register-modal">
                    <h3>정말로 등록하시겠습니까?</h3>
                    <BlueButtonComponent text="확인" onClick={handleConfirmRegister} />
                    <BlueButtonComponent text="취소" onClick={handleCloseConfirmation} />
                </div>
            </Modal>

            {/* 성공 메시지 스낵바 */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success">
                    상세설명이 등록되었습니다!
                </Alert>
            </Snackbar>
        </>
    );
};

export default DetailPage;
