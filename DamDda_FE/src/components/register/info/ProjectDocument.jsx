import React from "react";
import { Paper, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";
import axios from "axios";
import { SERVER_URL } from "constants/URLs";
import { FileUploadComponent } from "components/common/FileUploadComponent";

const FileContainer = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  gap: "10px", // 간격 조정
  marginTop: "10px",
});

const FileItem = styled("div")({
  display: "flex",
  alignItems: "center",
  position: "relative",
});

const ProjectDocument = (props) => {
  const { docs, setDocs } = props;

  const handleRemoveFile = (title) => {
    const newDocs = docs.filter((doc) => doc.title !== title); // 클릭된 이미지 제거
    setDocs(newDocs); // 이미지 배열 업데이트
  };
  const handleDownloadFile = async (doc) => {
    let _url;
    if (doc.file === null) {
      const splitted = doc.url.split("/");
      _url = `${SERVER_URL}/${splitted[0]}/${splitted[1]}/${splitted[2]}/${encodeURIComponent(splitted[3])}`;
    } else {
      _url = doc.url;
    }
    axios({
      method: "GET",
      url: _url,
      responseType: "blob",
      withCredentials: true,
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", doc.title);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((e) => console.error(e));
  };

  const handleUploadFile = (e, prefix) => {
    const files = Array.from(e.target.files);
    files.forEach((_file) => {
      const newFile = new File([_file], prefix + _file.name, {
        type: _file.type,
      });
      setDocs([
        ...docs,
        {
          file: newFile,
          url: URL.createObjectURL(newFile),
          title: newFile.name,
        },
      ]);
    });
  };

  return (
    <div className="detail-section">
      <h3>진행자 서류 제출</h3>
      <div className="detail-section">
        {/* 필수 서류 업로드 섹션 */}
        <FileUploadComponent
          handleChange={(event) => handleUploadFile(event, "[진행자]")}
          handleUpload={handleUploadFile}
          text="📁 필수 서류 파일 업로드"
          detail="필수서류를 꼭 확인해주세요! 진행자의 신분을 증명할 수 있는 서류, 통장사본, 사업자등록증 등 필요한
        서류를 제출하세요."
        />
        <Paper className="detail-paper">
          <FileContainer>
            {docs
              .filter((doc) => doc.title.startsWith("[진행자]"))
              .map((doc, index) => (
                <FileItem key={index} sx={{ cursor: "pointer" }}>
                  <div onClick={() => handleDownloadFile(doc)}>{doc.title}</div>
                  <IconButton
                    onClick={() => handleRemoveFile(doc.title)}
                    style={{ marginLeft: "5px" }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </FileItem>
              ))}
          </FileContainer>
        </Paper>
      </div>

      {/* 인증 서류 업로드 섹션 */}
      <h3 style={{ marginTop: "40px" }}>인증 서류 제출</h3>
      <div className="detail-section">
        <FileUploadComponent
          handleChange={(event) => handleUploadFile(event, "[인증]")}
          handleUpload={handleUploadFile}
          text="📁 인증 서류 파일 업로드"
          detail="후원자에게 제공할 모든 선물의 인증서류가 필요합니다. 필수서류를 제출하지 않으면 프로젝트가 반려될 수 있습니다."
        />
        <Paper className="detail-paper">
          <FileContainer>
            {docs
              .filter((doc) => doc.title.startsWith("[인증]"))
              .map((doc, index) => (
                <FileItem key={index} sx={{ cursor: "pointer" }}>
                  <div onClick={() => handleDownloadFile(doc)}>{doc.title}</div>
                  <IconButton
                    onClick={() => handleRemoveFile(doc.title)}
                    style={{ marginLeft: "5px" }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </FileItem>
              ))}
          </FileContainer>
        </Paper>
      </div>
    </div>
  );
};

export default ProjectDocument;
