import { Box, Dialog, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { SERVER_URL } from "utils/URLs";
import apiClient from "utils/ApiClient";
import DocItem from "projectPage/DocItem";
import { useAdmin } from "utils/AdminContext";
import {
  BlueButtonComponent,
  RedButtonComponent,
} from "common/ButtonComponent";

const DocInfo = (props) => {
  const { adminId } = useAdmin();
  const { project } = props;
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const handleText = (e) => setText(e.target.value);

  const handleClose = () => setOpen(!open);

  const submit = async (updatedApproval) => {
    console.log({
      loginId: adminId,
      projectId: project.id,
      approval: updatedApproval,
      approvalText: updatedApproval === 1 ? "프로젝트가 승인되었습니다." : text,
    });
    apiClient({
      method: "PUT",
      url: `${SERVER_URL}/admin/projects/${project.id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        loginId: adminId,
        projectId: project.id,
        approval: updatedApproval,
        approvalText:
          updatedApproval === 1 ? "프로젝트가 승인되었습니다." : text,
      },
    })
      .then((response) => response.data)
      .catch((e) => console.error(e));
    setText("");
    window.location.reload();
  };

  return (
    <div className="text-section" style={{ width: "800px", margin: "auto" }}>
      <div className="text-section">
        <div className="form-container">
          <h3>진행자 제출 서류 확인</h3>
        </div>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: 170,
            backgroundColor: "#EEEEEE",
          }}
        >
          {project.documents
            .filter(
              (doc) =>
                doc.fileName.startsWith("[진행자]") ||
                doc.fileName.split("_").pop().startsWith("[진행자]")
            )
            .map((doc, index) => (
              <DocItem key={index} doc={doc} projectId={project.id} />
            ))}
        </Box>
      </div>
      <div className="text-section">
        <div className="form-container">
          <h3>인증 서류 확인</h3>
        </div>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: 170,
            backgroundColor: "#EEEEEE",
          }}
        >
          {project.documents
            .filter(
              (doc) =>
                doc.fileName.startsWith("[인증]") ||
                doc.fileName.split("_").pop().startsWith("[인증]")
            )
            .map((doc, index) => (
              <DocItem key={index} doc={doc} projectId={project.id} />
            ))}
        </Box>
      </div>
      <div
        className="button-group"
        style={{ marginTop: "30px", marginLeft: "500px", width: "300px" }}
      >
        <BlueButtonComponent
          text="승인"
          onClick={() => {
            if (window.confirm("해당 프로젝트 등록을 승인하시겠습니까?")) {
              submit(1);
            }
          }}
        />
        <RedButtonComponent text="거절" onClick={handleClose} />
      </div>
      <Box sx={{ display: "flex", justifyContent: "end", m: 2 }}>
        <Dialog open={open} onClose={handleClose}>
          <Box sx={{ display: "flex", padding: 2 }}>
            <Typography sx={{ m: 1 }} variant="h5">
              거절 사유
            </Typography>
            <Typography sx={{ fontSize: "13px", alignSelf: "flex-end" }}>
              거절 사유를 10자 이상 적어주세요.
            </Typography>
          </Box>
          <TextField
            sx={{ m: 2 }}
            multiline
            rows={4}
            value={text}
            onChange={handleText}
          />

          <div
            className="button-group"
            style={{ width: "200px", margin: "auto", marginBottom: "20px" }}
          >
            <BlueButtonComponent
              text="제출"
              onClick={() => {
                submit(2);
                handleClose();
              }}
            />
            <RedButtonComponent
              text="취소"
              onClick={() => {
                setText("");
                handleClose();
              }}
            />
          </div>
        </Dialog>
      </Box>
    </div>
  );
};

export default DocInfo;
