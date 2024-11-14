import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { PasswordInputBox } from "components/common/InputBoxComponent";

const EditModal = ({
  open,
  onClose,
  onSubmit,
  setError,
  error,
  currentPassword,
  instruction,
}) => {
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    onSubmit(password);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      sx={{
        "& .MuiDialog-paper": {
          minWidth: "400px", // !important 사용
          margin: "auto",
        },
      }}
    >
      <DialogTitle id="form-dialog-title">
        <h4 align="center">🔒 접근 암호 인증</h4>
      </DialogTitle>
      <DialogContent>
        <Typography align="center">{instruction}</Typography>

        <from
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
        >
          <PasswordInputBox
            name="password"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              marginTop: "20px",
            }}
          />
        </from>

        {/* 에러 메시지 표시 */}
        {error && (
          <Typography
            color="error"
            align="center"
            style={{ marginTop: "10px" }}
          >
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          취소
        </Button>
        <Button onClick={handleSubmit} color="primary">
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;
