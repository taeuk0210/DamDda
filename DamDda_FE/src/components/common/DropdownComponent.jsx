import React from "react";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import styles from "../css/DropdownComponent.module.css";

export const DropdownComponent = ({
  name,
  inputLabel,
  menuItems,
  selectValue,
  onChange,
}) => {
  return (
    <Box className={styles["dropdown-container"]}>
      <FormControl
        variant="outlined"
        fullWidth
        className={styles["dropdown-form-control"]}
      >
        <InputLabel>{inputLabel}</InputLabel>
        <Select
          name={name || null}
          value={selectValue}
          onChange={onChange}
          label={inputLabel}
          className={styles["dropdown-select"]}
          MenuProps={{
            classes: { paper: styles.dropdownMenu },
          }}
        >
          {menuItems.map((menuItem, index) => (
            <MenuItem key={index} value={menuItem} className={styles.menuItem}>
              {menuItem}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};