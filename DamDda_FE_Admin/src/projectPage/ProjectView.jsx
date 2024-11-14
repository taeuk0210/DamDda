import { useState } from "react";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
// import TabContext from "@mui/material/Tab";
// import TabList from "@mui/material/Tab";
// import TabPanel from "@mui/material/Tab";
import ProjectInfo from "projectPage/ProjectInfo";
import PackageInfo from "projectPage/PackageInfo";
import DocInfo from "projectPage/DocInfo";

const ProjectView = (props) => {
  const { project, packages, approval } = props;
  const [tab, setTab] = useState("1");
  const handleTab = (e, newValue) => setTab(newValue);

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleTab}>
            <Tab label="프로젝트 설명" value="1" />
            <Tab label="선물 구성" value="2" />
            <Tab label="서류" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <ProjectInfo project={project} />
        </TabPanel>
        <TabPanel value="2">
          <PackageInfo packages={packages} />
        </TabPanel>
        <TabPanel value="3">
          <DocInfo project={project} approval={approval} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default ProjectView;
