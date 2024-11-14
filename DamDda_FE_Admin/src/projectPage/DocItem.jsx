import { Typography } from "@mui/material";
import apiClient from "utils/ApiClient";
import { SERVER_URL } from "utils/URLs";

const DocItem = (props) => {
  const { doc, projectId } = props;

  const handleDownload = async () => {
    const response = await apiClient
      .get(
        `${SERVER_URL}/admin/files/projects/${projectId}/${encodeURIComponent(
          doc.fileName
        )}`,
        {
          responseType: "blob",
          withCredentials: true,
        }
      )
      .then((res) => res)
      .catch((e) => console.error(e));

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", doc.fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <Typography
      sx={{ m: 2, textDecoration: "underline", cursor: "pointer" }}
      onClick={handleDownload}
    >
      {doc.fileName.startsWith("[")
        ? doc.fileName
        : doc.fileName.split("_").pop()}
    </Typography>
  );
};

export default DocItem;
