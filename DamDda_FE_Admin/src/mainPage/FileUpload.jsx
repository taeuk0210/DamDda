import { Box, Button, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useState } from "react";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
});

const FileUpload = (props) => {
  const { handleChange, handleUpload } = props;
  const [isActive, setActive] = useState(false);
  const handleDragStart = () => setActive(true);
  const handleDragEnd = () => setActive(false);
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleUpload(files);
    setActive(false);
  };

  return (
    <Box
      onDragEnter={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragEnd}
      onDrop={handleDrop}
      sx={{
        backgroundColor: `${isActive ? "#DDDDEE" : "#EEEEFF"}`,
        width: "90%",
        height: 200,
        mx: "5%",
        border: 1,
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <CloudUploadIcon
        color="secondary"
        sx={{ m: 3, mx: "auto", fontSize: 50 }}
      />
      <Typography variant="body2">
        여러 이미지를 이곳에 드래그 & 드롭하여 업로드하세요.
      </Typography>
      <Button
        sx={{ backgroundColor: "#677cf9", width: "160px", mx: "auto", mt: 2 }}
        component="label"
        variant="contained"
        tabIndex={-1}
      >
        Upload Images
        <VisuallyHiddenInput type="file" onChange={handleChange} multiple />
      </Button>
    </Box>
  );
};

export default FileUpload;
