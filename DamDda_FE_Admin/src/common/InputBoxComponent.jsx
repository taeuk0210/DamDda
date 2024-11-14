import React from "react";
import {
  TextField,
  Typography,
  Tooltip,
  IconButton,
  InputAdornment,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export const arrowTheme = createTheme({
  palette: {
    action: {
      active: "#787878",
      disabled: "#DFDFDF",
    },
  },
});

export const baseTheme = createTheme({
  // 색상 일괄 조정
  palette: {
    mode: "light",
    primary: {
      main: "#677cf9", // 클릭 시 적용되는 색상
      light: "#677cf9",
      dark: "#4858b8",
      contrastText: "#FFFFFF", // 대비 텍스트 색상
    },
    action: {
      active: "#ffc75f", // 툴팁 아이콘 색상
    },
    text: {
      primary: "#374edb", // 입력한 텍스트 색상, placeholder는 자동으로 연하게
      secondary: "#677cf9", // label 에 입혀지는 색상
      disabled: "#677cf9",
    },
    grey: {
      700: "#ff9671", // 툴팁 텍스트 바탕 색상
    },
    // divider, background는 언제 먹는지 모르겠음
    divider: "#845ec2",
    background: {
      paper: "#FFFFFF",
      default: "#374edb",
    },
  },
  // shape 조정
  shape: {
    borderRadius: 10,
  },
  // 텍스트 조정
  typography: {
    mytitle: {
      color: "#FF00FF", // 제목 색상 조정
      fontFamily: "Roboto, Helvetica, Arial, sans-serif",
      fontWeight: 400,
      fontSize: "1rem",
      lineHeight: 1.75,
      letterSpacing: "0.00938em",
    },
  },
});

// InputBox 컴포넌트
export function InputBox({
  tooltip,
  name,
  label,
  value,
  onChange,
  onKeyDown,
  type,
  placeholder,
  id,
  errorMessage,
  error = false,
  inputRef,
}) {
  return (
    <ThemeProvider theme={baseTheme}>
      <TextField
        fullWidth
        id={id}
        name={name}
        label={label}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        type={type ? type : "text"}
        error={error}
        inputRef={inputRef}
        helperText={error && errorMessage}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title={tooltip} placement="top">
                  <IconButton>
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          },
        }}
      />
    </ThemeProvider>
  );
}

// InputLine 컴포넌트
export function InputLine({
  name,
  label,
  value,
  onChange,
  type,
  placeholder,
  id,
  errorMessage,
  error,
  inputRef,
  checked,
  customInputProps,
}) {
  return (
    <ThemeProvider theme={baseTheme}>
      <TextField
        required
        fullWidth
        variant="standard"
        id={id}
        name={name}
        label={label}
        checked={checked}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type ? type : "text"}
        inputRef={inputRef}
        error={error}
        helperText={errorMessage} // 에러 메시지 표시
        slotProps={{
          input: {
            ...customInputProps,
          },
        }} // 추가 InputProps 적용
      />
    </ThemeProvider>
  );
}

// InputLargeBox 컴포넌트
export function InputLargeBox({
  title,
  name,
  label,
  value,
  onChange,
  type,
  placeholder,
  id,
  inputRef,
  checked,
  customInputProps,
  row,
}) {
  return (
    <ThemeProvider theme={baseTheme}>
      <Typography variant="mytitle">{title}</Typography>
      {/* 제목 스타일 */}
      <TextField
        fullWidth
        multiline
        rows={row}
        id={id}
        name={name}
        label={label}
        value={value}
        onChange={onChange}
        type={type ? type : "text"}
        placeholder={placeholder}
        maxRows={100}
        checked={checked}
        inputRef={inputRef}
        slotProps={{
          input: {
            ...customInputProps,
            readOnly: true,
          },
        }}
      />
    </ThemeProvider>
  );
}
