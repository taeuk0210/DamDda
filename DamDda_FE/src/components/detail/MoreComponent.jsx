import React from "react";
import { Box, Typography, TextField } from "@mui/material";

export const ModalInputText = ({
  label,
  value,
  onChange,
  error,
  helperText,
}) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      fullWidth
      margin="normal"
      value={value}
      onChange={onChange}
      error={error}
      helperText={error ? helperText : ""}
      InputProps={{
        style: {
          borderColor: error ? "red" : "inherit",
        },
      }}
    />
  );
};

export const ProjectInfoBox = ({ title, value, unit, statistics }) => {
  return (
    <Box
      sx={{
        textAlign: "left",
        padding: "10px",
        margin: "7px 0",
      }}
    >
      {/* 제목 */}
      <Typography variant="body2" sx={{ color: "gray", marginBottom: "5px" }}>
        {title}
      </Typography>

      {/* 금액과 통계 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "flex-start",
        }}
      >
        {/* 금액 */}
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", fontSize: "36px", lineHeight: "1" }}
        >
          {value}
        </Typography>
        {/* 단위 */}
        <Typography variant="h6" sx={{ fontSize: "20px", marginLeft: "5px" }}>
          {unit}
        </Typography>
        {/* 통계 */}
        {statistics && (
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", fontSize: "18px", marginLeft: "auto" }}
          >
            {statistics}
          </Typography>
        )}
      </Box>
    </Box>
  );
};
