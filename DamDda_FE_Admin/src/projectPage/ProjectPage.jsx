import { Grid2, Box, Button, Pagination } from "@mui/material";
import ProjectItem from "projectPage/ProjectItem";
import ProjectView from "projectPage/ProjectView";
import { useEffect, useState } from "react";
import apiClient from "utils/ApiClient";
import { SERVER_URL } from "utils/URLs";

const buttons = [
  { name: "전체", value: "null" },
  { name: "대기", value: 0 },
  { name: "승인", value: 1 },
  { name: "거절", value: 2 },
];

const ProjectPage = () => {
  const [showList, setShowList] = useState(true);
  const [project, setProject] = useState({});
  const [packages, setPackages] = useState({});
  const [projects, setProjects] = useState([]);
  const [approval, setApproval] = useState(null);
  const [page, setPage] = useState(1);
  const [paging, setPaging] = useState({
    size: 10,
    totalCounts: 0,
    totalPages: 0,
  });

  const fetchProjects = async () => {
    apiClient({
      method: "GET",
      url: `${SERVER_URL}/admin/projects`,
      params: { approval: approval, page: page - 1, size: paging.size },
    })
      .then((response) => {
        setProjects(response.data.dtoList);
        setPaging({
          ...paging,
          totalCount: response.data.totalCounts,
          totalPages: response.data.totalPages,
        });
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [approval, page]);

  const getProject = async (id) => {
    apiClient({
      method: "GET",
      url: `${SERVER_URL}/admin/projects/${id}`,
    })
      .then((response) => setProject(response.data))
      .catch((error) => console.error(error));
  };

  const getPackage = async (id) => {
    apiClient({
      method: "GET",
      url: `${SERVER_URL}/admin/packages/${id}`,
    })
      .then((response) => setPackages(response.data))
      .catch((error) => console.error(error));
  };

  const handleView = (id) => {
    getProject(id);
    getPackage(id);
    setShowList(false);
  };

  const handleApproval = (e) => {
    setApproval(e.target.value === "null" ? null : Number(e.target.value));
    setPage(1);
  };
  const handlePage = (e, value) => setPage(value);

  if (showList)
    return (
      <Box>
        <Box sx={{ backgroundColor: "#DDDDDD", height: 45 }}>
          {buttons.map((b) => (
            <Button
              key={b.name}
              variant={
                approval === (b.value === "null" ? null : b.value)
                  ? "contained"
                  : "text"
              }
              size="large"
              sx={{ paddingX: 7 }}
              value={b.value}
              onClick={handleApproval}
            >
              {b.name}
            </Button>
          ))}
        </Box>
        <Box sx={{ backgroundColor: "#EEEEEE" }} padding={3}>
          <Grid2
            container
            margin="auto"
            spacing={{ xs: 2 }}
            columns={{ xs: 4, md: 6, lg: 10 }}
          >
            {projects.map((project) => {
              return (
                <Grid2
                  key={project.projectId}
                  size={{ xs: 2 }}
                  onClick={() => handleView(project.projectId)}
                >
                  <ProjectItem project={project} />
                </Grid2>
              );
            })}
          </Grid2>
        </Box>
        <Pagination
          sx={{ m: 2 }}
          count={paging.totalPages}
          page={page}
          onChange={handlePage}
          color="primary"
          variant="outlined"
        />
      </Box>
    );
  else
    return project && project.id ? (
      <ProjectView
        project={project}
        packages={packages}
        approval={
          projects.filter((pro) => pro.projectId === project.id)[0].approval
        }
      />
    ) : (
      <div>Loading...</div>
    );
};

export default ProjectPage;
