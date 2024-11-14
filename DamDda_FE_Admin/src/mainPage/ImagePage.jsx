import { Alert, Box, Button, Grid2, Snackbar, Typography } from "@mui/material";

import ImageItem from "mainPage/ImageItem";
import { useEffect, useState } from "react";
import { SERVER_URL } from "utils/URLs";
import apiClient from "utils/ApiClient";
import CheckIcon from "@mui/icons-material/Check";

import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import FileUpload from "mainPage/FileUpload";
import {
  BlueBorderButtonComponent,
  BlueButtonComponent,
} from "common/ButtonComponent";

const ImagePage = () => {
  const [images, setImages] = useState([]);
  const [deletedData, setDeletedData] = useState([]);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openFailure, setOpenFailure] = useState(false);

  const fetchUrls = async () => {
    apiClient({
      method: "GET",
      url: `${SERVER_URL}/admin/files/carousels`,
      headers: {
        Authorization: sessionStorage.getItem("jwtToken"),
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setImages(
          response.data.map((image) => {
            const parts = image.split("/");
            return {
              fileName: parts[parts.length - 1],
              file: null,
            };
          })
        );
      })
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleUpload = (files) => {
    const nonDuplicateFiles = files
      .filter((f) => !images.some((image) => image.fileName === f.name))
      .map((f) => {
        return { fileName: f.name, file: f };
      });
    setImages([...images, ...nonDuplicateFiles]);
  };
  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    handleUpload(files);
  };

  const handleDelete = (image) => {
    if (image.file === null) setDeletedData([...deletedData, image.fileName]);
    setImages(images.filter((img) => img.fileName !== image.fileName));
  };
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleSave = async () => {
    const newData = new FormData();
    images.forEach((image) => {
      if (image.file !== null) newData.append("files", image.file);
    });

    const responsePOST = await apiClient({
      method: "POST",
      url: `${SERVER_URL}/admin/files/carousels`,
      headers: {
        Authorization: sessionStorage.getItem("jwtToken"),
        "Content-Type": "multipart/form-data",
      },
      data: newData,
    })
      .then((response) => response.status)
      .catch((e) => console.error(e));

    const responsePUT = await apiClient({
      method: "PUT",
      url: `${SERVER_URL}/admin/files/carousels`,
      headers: {
        Authorization: sessionStorage.getItem("jwtToken"),
        "Content-Type": "application/json",
      },
      data: deletedData,
    })
      .then((response) => response.status)
      .catch((e) => console.error(e));
    if (responsePOST === 200 && responsePUT === 200) setOpenSuccess(true);
    else setOpenFailure(true);
  };

  return (
    <Box>
      <Box sx={{ backgroundColor: "#DDDDDD", height: 45 }}>&nbsp;</Box>
      <Box
        sx={{
          backgroundColor: "#EEEEEE",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 2,
          }}
        >
          <Typography>Upload Carousel Image</Typography>
          <div className="button-group">
            <BlueButtonComponent text="REFRESH" onClick={handleRefresh} />
            <BlueButtonComponent text="SAVE" onClick={handleSave} />
          </div>
        </Box>
        <FileUpload handleChange={handleChange} handleUpload={handleUpload} />
        <Box
          sx={{
            my: 7,
            backgroundColor: "#EEEEFF",
            width: "90%",
            mx: "5%",
            borderRadius: 4,
          }}
        >
          <Grid2
            container
            margin="auto"
            spacing={{ xs: 2 }}
            columns={{ xs: 4, md: 6, lg: 10 }}
          >
            {images.map((image) => {
              return (
                <Grid2 key={image.fileName} size={{ xs: 2 }}>
                  <ImageItem image={image} handleDelete={handleDelete} />
                </Grid2>
              );
            })}
          </Grid2>
        </Box>
      </Box>

      <Snackbar
        open={openSuccess}
        autoHideDuration={2500}
        onClose={() => setOpenSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
          캐러셀 등록 및 수정이 성공적으로 완료되었습니다.
        </Alert>
      </Snackbar>

      <Snackbar
        open={openFailure}
        autoHideDuration={2500}
        onClose={() => setOpenFailure(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert icon={<PriorityHighIcon fontSize="inherit" />} severity="error">
          캐러셀 등록 및 수정이 실패했습니다. 새로고침 후 다시 시도해보세요.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ImagePage;
