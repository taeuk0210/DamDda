import React from "react";
import { Tabs, Tab } from "@mui/material";
import styles from "../css/TabComponent.module.css";

export const TabComponent = ({
  tabIndex,
  setTabIndex,
  labels,
  sectionRefs,
}) => {
  const scrollToSection = (label) => {
    const refKey = label.trim();
    const targetRef = sectionRefs[refKey];

    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      console.warn(`${label} 섹션을 찾을 수 없습니다.`);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    scrollToSection(labels[newValue]);
  };

  return (
    <div className={styles.tabContainer}>
      {labels.map((label, index) => (
        <div
          key={index}
          className={`${styles.tabItem} ${tabIndex === index ? styles.tabItemActive : ""}`}
          onClick={(event) => handleTabChange(event, index)}
        >
          {label}
        </div>
      ))}
    </div>
  );
};
