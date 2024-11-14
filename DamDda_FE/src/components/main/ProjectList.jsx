// src/components/layout/ProjectList.jsx
import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { SERVER_URL } from "../../constants/URLs";
import Cookies from "js-cookie";

export const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  // useEffect(() => {
  //   fetchWritingProjects();
  // }, []);

  // const fetchWritingProjects = async () => {
  //   const response = await axios.get(`${SERVER_URL}/api/projects/write`, {
  //     headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
  //   });
  //   setProjects(response.data);
  // };

  // const handleDeleteProject = async (id) => {
  //   const confirmDelete = window.confirm(`작성중인 프로젝트를 정말 삭제하시겠습니까?\n프로젝트 이름 : "${projects.find((p) => p.id === id).title}"`);
  //   if (confirmDelete) {
  //     await axios.delete(`${SERVER_URL}/api/projects/${id}`, {
  //       headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
  //     });
  //     setProjects(projects.filter((project) => project.id !== id));
  //   }
  // };

  return (
    <Box sx={{ position: "absolute", zIndex: 1000, width: 300, padding: 2, border: "1px solid #ccc", backgroundColor: "white", borderRadius: 10 }}>
      {projects.length < 3 && (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#1263CE", textAlign: "center", cursor: "pointer" }} onClick={() => navigate("/register")}>
          + 새로운 프로젝트
        </Typography>
      )}
      {projects.map((project) => (
        <Box key={project.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 1 }}>
          <Typography>{project.title}</Typography>
          <IconButton size="small" onClick={() => navigate(`/register?projectId=${project.id}`)}>
            <EditIcon sx={{ color: "#4B89DC" }} />
          </IconButton>
          {/* <IconButton size="small" onClick={() => handleDeleteProject(project.id)}>
            <CloseIcon sx={{ color: "#f44e38" }} />
          </IconButton> */}
        </Box>
      ))}
    </Box>
  );
};

