import {
  Box,
  Chip,
  Skeleton,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { ImageCarousel } from "common/ImageCarousel";
import Form from "common/Form";
import { baseTheme, InputBox } from "common/InputBoxComponent";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import datejs from "dayjs";

const ProjectInfo = (props) => {
  const { project } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="form-container" style={{ gap: "60px" }}>
        <h3>프로젝트 기본 정보</h3>
      </div>
      <div
        className="form-container"
        style={{ marginTop: "30px", gap: "60px" }}
      >
        <div
          style={{
            display: "flex",
            flexFlow: "row wrap",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <div>
            {project.images.length !== 0 ? (
              <ImageCarousel
                style={{ width: "500px", height: "500px" }}
                images={project.images
                  .filter((image) => image.imageType.imageType === "product")
                  .map((image) => image.url)}
              />
            ) : (
              <Skeleton variant="rectangular" width={450} height={300} />
            )}
          </div>
        </div>
        <div className="text-section">
          <Form title={"프로젝트 제목"}>
            <InputBox name="title" value={project.title} />
          </Form>
          <Form title={"프로젝트 설명"}>
            <InputBox name="description" value={project.description} />
          </Form>
          <Form title="카테고리">
            <InputBox name="category" value={project.category.name} />
          </Form>
          <Form title={"목표 금액"}>
            <InputBox
              name="target"
              value={
                String(project.targetFunding).replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  ","
                ) + " 원"
              }
            />
          </Form>
          <ThemeProvider theme={baseTheme}>
            <Form title={"프로젝트 일정"}>
              <DesktopDatePicker
                label="시작일"
                name="start"
                value={datejs(project.start_date)}
                format="YYYY-MM-DD"
                onChange={() => {}}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    style={{ marginRight: "8px", flex: 1 }}
                  />
                )}
              />
              <Typography className="icon">~</Typography>
              <DesktopDatePicker
                label="종료일"
                name="end"
                value={datejs(project.end_date)}
                format="YYYY-MM-DD"
                onChange={() => {}}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    style={{ marginLeft: "8px", flex: 1 }}
                  />
                )}
              />
            </Form>
          </ThemeProvider>
          <Form title={"예상 전달일"}>
            <InputBox value="종료일로부터 30일 이내" />
          </Form>

          <Form title={"태그"}>
            {project.tags.length > 0 && (
              <div className="scrollable" style={{ height: "auto" }}>
                {project.tags.map((tag, index) => (
                  <Chip
                    variant="outlined"
                    color="info"
                    key={index}
                    label={tag.name}
                    style={{ margin: "5px" }}
                  />
                ))}
              </div>
            )}
          </Form>
        </div>
      </div>
      <div className="text-section" style={{ marginTop: "100px" }}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h3>프로젝트 상세 정보</h3>
          <Box
            sx={{
              backgroundColor: "#F9F9F9",
              width: "1100px",
              minHeight: 200,
            }}
          >
            <Box sx={{ padding: 6 }}>
              <Typography variant="h5" sx={{ marginY: 2 }}>
                상세 설명
              </Typography>
              <Typography variant="body1">
                {project.descriptionDetail}
              </Typography>
            </Box>
          </Box>

          <div
            style={{
              display: "flex",
              flexFlow: "row wrap",
              justifyContent: "space-evenly",
              alignItems: "center",
              marginTop: "50px",
            }}
          >
            <div>
              {project.images.length !== 0 ? (
                <ImageCarousel
                  style={{ width: "700px", height: "700px" }}
                  images={project.images
                    .filter(
                      (image) => image.imageType.imageType === "description"
                    )
                    .map((image) => image.url)}
                />
              ) : (
                <Skeleton variant="rectangular" width={450} height={300} />
              )}
            </div>
          </div>
        </Box>
      </div>
    </LocalizationProvider>
  );
};

export default ProjectInfo;
