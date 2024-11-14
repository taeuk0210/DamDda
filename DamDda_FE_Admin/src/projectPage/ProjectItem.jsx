import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box, Chip, Skeleton } from "@mui/material";
import { SERVER_URL } from "utils/URLs";

const ProjectItem = (props) => {
  const { project } = props;

  return (
    <Card>
      {project.thumbnailUrl !== null ? (
        <CardMedia
          component={"img"}
          sx={{ height: 200, objectFit: "cover" }}
          alt={project.thumbnailUrl}
          src={`${SERVER_URL}/admin/${project.thumbnailUrl}`}
        />
      ) : (
        <Skeleton variant="rectangular" height={200} />
      )}
      <CardContent>
        <Typography variant="body1" align="left">
          {project.title}
        </Typography>
        <Typography
          gutterBottom
          variant="body2"
          align="right"
          sx={{ color: "text.secondary" }}
        >
          {project.organizer}
        </Typography>
        <Box
          sx={{ marginTop: 2, display: "flex", justifyContent: "space-around" }}
        >
          <Chip
            sx={{ padding: 1, fontSize: 10 }}
            label="승인"
            color="success"
            variant={project.approval === 1 ? "filled" : "outlined"}
          />
          <Chip
            sx={{ padding: 1, fontSize: 10 }}
            label="대기"
            color="warning"
            variant={project.approval === 0 ? "filled" : "outlined"}
          />
          <Chip
            sx={{ padding: 1, fontSize: 10 }}
            label="거절"
            color="error"
            variant={project.approval === 2 ? "filled" : "outlined"}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectItem;
