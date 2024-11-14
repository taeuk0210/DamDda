import { Box, Button, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SERVER_URL } from "utils/URLs";

const ImageItem = (props) => {
  const { image, handleDelete } = props;
  const imageUrl =
    image.file === null
      ? `${SERVER_URL}/admin/files/carousels/${image.fileName}`
      : URL.createObjectURL(image.file);

  const showName = (fileName) => {
    const parts = fileName.split("_");
    return parts[parts.length - 1];
  };

  return (
    <Box
      sx={{
        m: 2,
        height: 250,
        overflow: "hidden",
        backgroundColor: "#CCCCCC",
        position: "relative",
      }}
    >
      <Typography sx={{ m: 1 }} variant="caption">
        {showName(image.fileName)}
      </Typography>
      <Button
        sx={{
          position: "absolute",
          top: 0,
          right: 8,
          minWidth: "auto",
          padding: 0,
        }}
        onClick={() => handleDelete(image)}
      >
        <CloseIcon color="primary" />
      </Button>
      <img
        src={imageUrl}
        alt={image.name}
        style={{
          margin: "5%",
          width: "90%",
          height: "80%",
          objectFit: "cover",
        }}
      />
    </Box>
  );
};

export default ImageItem;
