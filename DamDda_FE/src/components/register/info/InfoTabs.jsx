const { Tabs, Tab } = require("@mui/material");

const InfoTabs = ({ value, scrollToSection }) => {
  return (
    <Tabs value={value} indicatorColor="primary" textColor="primary">
      <Tab label="상세 설명" onClick={() => scrollToSection("description")} />
      <Tab label="선물 구성" onClick={() => scrollToSection("package")} />
      <Tab label="서류 제출" onClick={() => scrollToSection("document")} />
    </Tabs>
  );
};

export default InfoTabs;
