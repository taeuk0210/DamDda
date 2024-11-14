import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Modal, Divider, Snackbar, Typography } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { SERVER_URL } from "constants/URLs";
import Package from "components/register/info/Package";
import InfoContainer from "components/register/info/InfoContainer";
import DetailPage from "components/register/info/DetailPage";
import ProjectDocument from "components/register/info/ProjectDocument";
import dayjs from "dayjs";
import { Layout } from "components/layout/DamDdaContainer";
import { BlueButtonComponent } from "components/common/ButtonComponent";

import "pages/register/Register.css";
import InfoTabs from "components/register/info/InfoTabs";
import MessageBox from "components/register/info/MessageBar";
import { Preview } from "components/register/preview/Preview";
const getUrl = (_file) => {
  let _url;
  if (_file.file === null) {
    const splitted = _file.url.split("/");
    _url = `${SERVER_URL}/${splitted[0]}/${splitted[1]}/${splitted[2]}/${encodeURIComponent(splitted[3])}`;
  } else {
    _url = _file.url;
  }
  return _url;
};

const Register = () => {
  ////////////////////////////
  // DEFINE STATE VARIABLES //
  ////////////////////////////
  const location = useLocation();
  const navigate = useNavigate();
  const projectId = new URLSearchParams(location.search).get("projectId");
  // for project information
  const [writeData, setWriteData] = useState([]);
  const [tags, setTags] = useState([]);
  const [formData, setFormData] = useState({
    // 기본 폼 데이터
    category_id: "",
    subcategory: "",
    title: "",
    description: "",
    target_funding: "",
    start_date: null,
    end_date: null,
    delivery_date: null,
    tags: "",
  });
  // for project detail and files
  const [descriptionDetail, setDescriptionDetail] = useState(""); // 상세설명
  const [productImages, setProductImages] = useState([]); // 상품이미지
  const [descriptionImages, setDescriptionImages] = useState([]); // 설명이미지
  const [docs, setDocs] = useState([]);

  const [preview, setPreview] = useState(false);
  const handlePreviewOpen = () => setPreview(true);
  const handlePreviewClose = () => setPreview(false);

  //////////////////////
  // DEFINE CALLBACKS //
  //////////////////////
  // --------AI용 요청 정보 저장 및 동기화 시작--------

  // AI 요청에 필요한 데이터를 저장하는 상태 변수
  const [aiRequestData, setAiRequestData] = useState({
    title: formData.title || "", // formData에서 제목 가져오기
    description: formData.description || "", // formData에서 설명 가져오기
    tags: tags || [], // 태그 목록 가져오기
    category: formData.category_id || "", // 카테고리 ID 가져오기
  });

  /**
   * formData와 tags가 변경될 때마다 AI 요청 데이터를 최신 상태로 동기화
   * 의존성 배열에 포함된 값이 변경될 때마다 useEffect가 호출됨
   */
  useEffect(() => {
    setAiRequestData({
      title: formData.title, // 최신 제목
      description: formData.description, // 최신 설명
      tags: tags, // 최신 태그 목록
      category: formData.category_id, // 최신 카테고리 ID
    });
  }, [formData.title, formData.description, formData.category_id, tags]);
  // formData의 title, description, category_id 또는 tags가 변경될 때마다 실행

  // --------AI용 요청 정보 저장 및 동기화 종료--------
  // fetch writing data from server
  const fetchWriteData = async () => {
    try {
      const accessToken = Cookies.get("accessToken");
      const response = await axios
        .get(`${SERVER_URL}/project/write/${projectId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => response)
        .catch((error) =>
          console.error("프로젝트 데이터를 가져오는 중 오류 발생:", error)
        );
      setWriteData(response.data || []);
    } catch (error) {}
  };

  useEffect(() => {
    fetchWriteData();
  }, []);

  useEffect(() => {
    setFormData({
      category_id: writeData.category,
      subcategory: "",
      title: writeData.title,
      description: writeData.description,
      target_funding: Number(writeData.targetFunding).toLocaleString(),
      start_date: dayjs(writeData.startDate).format("YYYY-MM-DD"),
      end_date: dayjs(writeData.endDate).format("YYYY-MM-DD"),
      delivery_date: null,
    });
    writeData.tags && setTags(writeData.tags);
    writeData.descriptionDetail &&
      setDescriptionDetail(writeData.descriptionDetail);
    writeData.productImages &&
      setProductImages([
        ...writeData.productImages.map((_url) => ({
          file: null,
          url: _url,
          title: _url.split("/").pop(),
        })),
      ]);
    writeData.descriptionImages &&
      setDescriptionImages([
        ...writeData.descriptionImages.map((_url) => ({
          file: null,
          url: _url,
          title: _url.split("/").pop(),
        })),
      ]);
    writeData.docs &&
      setDocs([
        ...writeData.docs.map((_url) => ({
          file: null,
          url: _url,
          title: _url.split("/").pop().split("_").pop(),
        })),
      ]);
  }, [writeData]);

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    target.scrollIntoView({ behavior: "smooth" });
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarColor, setSnackbarColor] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSnackbarOpen = (color, message) => {
    setSnackbarColor(color);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = () => {
    if (window.confirm("정말로 제출하시겠습니까?")) {
      saveProject(projectId, "제출");
      handleSnackbarOpen("success", "작성하신 프로젝트가 제출되었습니다.");
    }
  };

  const addFileToForm = (form, files, fileField, metaField, updateField) => {
    const metas = [];
    const updates = [];
    files.forEach((image, index) => {
      if (image.file !== null) {
        form.append(fileField, image.file);
        metas.push({
          url: "",
          ord: index + 1,
        });
      } else {
        updates.push({
          url: image.url,
          ord: index + 1,
        });
      }
    });
    form.append(
      metaField,
      new Blob([JSON.stringify(metas)], {
        type: "application/json",
      })
    );
    form.append(
      updateField,
      new Blob([JSON.stringify(updates)], {
        type: "application/json",
      })
    );
  };

  const saveProject = async (projectId, submit, isSkip = false) => {
    if (!isSkip && !window.confirm("저장하시겠습니까?")) {
      return; // 사용자가 "취소"를 선택하면 함수 종료
    }
    const projectFormData = new FormData();
    // ProjectDetailDTO 데이터
    const projectDetailDTO = {
      id: projectId, // 프로젝트 ID
      title: formData.title, // formData에서 가져오는 값 예시
      description: formData.description, // formData에서 가져오는 값 예시
      descriptionDetail: descriptionDetail,
      fundsReceive: 0,
      targetFunding: parseInt(formData.target_funding.replace(/,/g, "")), // 목표 금액
      nickName: "testNickName", // 진행자 닉네임
      startDate: new Date(formData.start_date), // 시작 날짜 (적절하게 변환 필요)
      endDate: new Date(formData.end_date), // 종료 날짜 (적절하게 변환 필요)
      supporterCnt: 0,
      likeCnt: 0,
      category: formData.category_id,
      tags: tags.map((tag) => ({
        name: tag,
        usageFrequency: -1,
        projectIds: [0],
      })),
    };

    projectFormData.append(
      "projectDetailDTO",
      new Blob([JSON.stringify(projectDetailDTO)], { type: "application/json" })
    );

    // productImages 파일 추가
    addFileToForm(
      projectFormData,
      productImages,
      "productImages",
      "productImagesMeta",
      "updateProductImages"
    );

    // descriptionImages 파일 추가
    addFileToForm(
      projectFormData,
      descriptionImages,
      "descriptionImages",
      "descriptionImagesMeta",
      "updateDescriptionImages"
    );

    // descriptionImages 파일 추가
    addFileToForm(projectFormData, docs, "docs", "docsMeta", "updateDocs");

    // 추가적으로 필요한 텍스트 필드 데이터
    projectFormData.append("submit", submit); // "저장" 혹은 "제출"

    try {
      const accessToken = Cookies.get("accessToken");
      const response = await axios({
        method: "PUT",
        url: `${SERVER_URL}/project/register/${projectId}`,
        data: projectFormData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      handleSnackbarOpen("success", "저장이 완료되었습니다.");
    } catch (error) {
      console.error("프로젝트 업데이트 중 오류 발생:", error);
      handleSnackbarOpen("error", "저장을 성공하지 못했습니다.");
    }

    if (submit === "제출") {
      navigate("/");
    }
  };

  return (
    <>
      <Layout>
        {/* 헤더 때문에 안보여서 추가한거임 */}
        <Box sx={{ padding: 10 }}></Box>
        {/* register header */}
        <div className="header-container">
          <h1>프로젝트 등록하기</h1>
          <div className="button-right">
            <div className="button-group">
              <BlueButtonComponent
                text="미리보기"
                onClick={handlePreviewOpen}
              />
              <BlueButtonComponent
                text="저장하기"
                onClick={() => saveProject(projectId, "저장")}
              />
            </div>
          </div>
        </div>

        {/* register basic project information */}
        {writeData && (
          <InfoContainer
            tags={tags}
            setTags={setTags}
            formData={formData}
            setFormData={setFormData}
            productImages={productImages}
            setProductImages={setProductImages}
          />
        )}
        <hr />

        {/* register detail project information */}
        <div id="description">
          <InfoTabs value={0} scrollToSection={scrollToSection} />
          <DetailPage
            descriptionDetail={descriptionDetail}
            setDescriptionDetail={setDescriptionDetail}
            descriptionImages={descriptionImages}
            setDescriptionImages={setDescriptionImages}
            aiRequestData={aiRequestData}
          />
          <hr />
        </div>
        {/* register package information */}
        <div id="package">
          <InfoTabs value={1} scrollToSection={scrollToSection} />
          <Package handleSnackbarOpen={handleSnackbarOpen} />
          <hr />
        </div>
        {/* register project documents */}
        <div id="document">
          <InfoTabs value={2} scrollToSection={scrollToSection} />
          <ProjectDocument docs={docs} setDocs={setDocs} />
          <hr />
        </div>
        {/* register information to server */}
        <Divider style={{ margin: "20px 0", width: "0" }} />
        <div className="button-group">
          <BlueButtonComponent text="미리보기" onClick={handlePreviewOpen} />
          <BlueButtonComponent
            text="저장하기"
            onClick={() => saveProject(projectId, "저장")}
          />
          <BlueButtonComponent text="제출하기" onClick={handleSubmit} />
        </div>
        <Divider style={{ margin: "20px 0", width: "0" }} />
      </Layout>
      {/* 스낵바 */}
      <MessageBox
        open={snackbarOpen}
        color={snackbarColor}
        message={snackbarMessage}
        handleClose={handleSnackbarClose}
      />
      {/* 미리보기 모달 창 */}
      {/* <Modal open={preview} onClose={handlePreviewClose}>
        <Box sx={style}>아무거나</Box>
        <BlueButtonComponent text="닫기" onClick={handlePreviewClose} />
      </Modal> */}
      <div>
        <Modal open={preview} onClose={handlePreviewClose}>
          <Box sx={style}>
            <Preview
              projectId={projectId}
              project={{
                title: formData.title,
                nickName: "sample nickname",
                description: formData.description,
                targetFunding: parseInt(
                  formData.target_funding.replace(/,/g, "")
                ),
                startDate: formData.start_date,
                endDate: formData.end_date,
                category: formData.category_id,
                descriptionDetail: descriptionDetail,
                productImages: productImages.map((image) => getUrl(image)),
                descriptionImages: descriptionImages.map((image) =>
                  getUrl(image)
                ),
              }}
            />
          </Box>
        </Modal>
      </div>
    </>
  );
};
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  height: "80%",
  overflow: "auto",
  transform: "translate(-50%, -50%)",
  maxWidth: "1700px",
  width: "90%",
  bgcolor: "#FFFFFF",
  border: "2px solid #000",
};
export default Register;
