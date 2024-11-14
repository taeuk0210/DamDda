import { useState } from "react";
import {
  Stack,
  TextField,
  FormControlLabel,
  Typography,
  Button,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import axios from "axios";
import { SERVER_URL } from "utils/URLs";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import { useAdmin } from "utils/AdminContext";

const Login = () => {
  const { login } = useAdmin();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({
    loginId: "",
    password: "",
  });
  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    const responseCode = await axios({
      method: "POST",
      url: `${SERVER_URL}/admin/login`,
      headers: {
        "Content-Type": "application/json",
      },
      data: user,
    })
      .then((response) => {
        login({
          accessToken: response.headers.authorization,
          refreshToken: response.data.refreshToken,
          _adminId: user.loginId,
        });
        return response.status;
      })
      .catch((e) => console.error(e));

    if (responseCode !== 200) {
      setOpen(true);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <Stack
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        my: 10,
      }}
    >
      <Typography variant="h5">관리자 로그인</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 5,
          backgroundColor: "#F9F9F9",
          borderRadius: 5,
          border: "solid 2px #32a1ce",
        }}
      >
        <Typography sx={{ marginTop: 5 }} color="warning" variant="p">
          {`Connected to ${SERVER_URL}`}
        </Typography>
        <FormControlLabel
          sx={{ margin: 5 }}
          label="아이디"
          labelPlacement="start"
          control={
            <TextField
              sx={{ marginLeft: 3, width: 170 }}
              variant="standard"
              placeholder="아이디를 입력하세요."
              name="loginId"
              value={user.loginId}
              onChange={handleChange}
            />
          }
        />
        <FormControlLabel
          sx={{ margin: 5, marginTop: 0 }}
          label="비밀번호"
          labelPlacement="start"
          control={
            <TextField
              sx={{ marginLeft: 1, width: 170 }}
              variant="standard"
              type="password"
              placeholder="비밀번호를 입력하세요."
              name="password"
              value={user.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          }
        />
        <Button
          sx={{ paddingLeft: 5, paddingRight: 5, marginBottom: 5 }}
          variant="contained"
          onClick={login}
        >
          <Typography variant="h6">로그인</Typography>
        </Button>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={2500}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert icon={<PriorityHighIcon fontSize="inherit" />} severity="error">
          로그인이 실패했습니다. 아이디 또는 비밀번호를 확인하세요.
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default Login;
