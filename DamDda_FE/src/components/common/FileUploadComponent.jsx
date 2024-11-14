// import { Box, Button, Typography } from "@mui/material";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import { styled } from "@mui/material/styles";
// import { useState } from "react";
// import styles from '../css/FileUploadComponent.module.css'; // 경로 확인

// const VisuallyHiddenInput = styled("input")({
//   clip: "rect(0 0 0 0)",
//   clipPath: "inset(50%)",
//   height: 1,
//   overflow: "hidden",
//   position: "absolute",
//   bottom: 0,
//   left: 0,
//   whiteSpace: "nowrap",
// });

// export const FileUploadComponent = (props) => {
//   const { handleChange, handleUpload } = props;
//   const [isActive, setActive] = useState(false);
//   const handleDragStart = () => setActive(true);
//   const handleDragEnd = () => setActive(false);
//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };
//   const handleDrop = (e) => {
//     e.preventDefault();
//     const files = Array.from(e.dataTransfer.files);
//     handleUpload(files);
//     setActive(false);
//   };

//   return (
//      <Box
//       className={`${styles.fileUploadBox} ${isActive ? styles.fileUploadBoxActive : ""}`} // 클래스명 확인
//       onDragEnter={handleDragStart}  
//       onDragOver={handleDragOver}
//       onDragLeave={handleDragEnd}
//       onDrop={handleDrop}
//     >
//       <CloudUploadIcon color="primary" className={styles.uploadIcon} />
//       <Typography variant="body2" className={styles.uploadText}>
//         여러 이미지를 이곳에 드래그 & 드롭하여 업로드하세요.
//       </Typography>
//       <Button
//         className={styles.uploadButton}
//         component="label"
//         variant="contained"
//         tabIndex={-1}
//       >
//         Upload Images
//         <input type="file" className={styles.hiddenInput} onChange={handleChange} multiple />
//       </Button>
//     </Box>
//   );
// };

import { Box, Button, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import styles from "../css/FileUploadComponent.module.css"; // 경로 확인

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

export const FileUploadComponent = (props) => {
  const { handleChange, handleUpload, text, detail } = props;
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
      className={`${styles.fileUploadBox} ${isActive ? styles.fileUploadBoxActive : ""}`} // 클래스명 확인
      onDragEnter={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragEnd}
      onDrop={handleDrop}
    >
      <CloudUploadIcon color="primary" className={styles.uploadIcon} />
      <Typography variant="body2" className={styles.uploadText}>
        {detail}
      </Typography>
      <Button
        className={styles.uploadButton}
        component="label"
        variant="contained"
        tabIndex={-1}
      >
        {text}
        <input
          type="file"
          className={styles.hiddenInput}
          onChange={handleChange}
          multiple
        />
      </Button>
    </Box>
  );
};