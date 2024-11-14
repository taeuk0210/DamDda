import { Button } from "@mui/material";
import { useAdmin } from "utils/AdminContext";
import apiClient from "utils/ApiClient";
import { SERVER_URL } from "utils/URLs";

const Logout = () => {
  const { logout, setAdminId } = useAdmin();
  const handleLogout = async () => {
    apiClient({
      method: "GET",
      url: `${SERVER_URL}/admin/logout`,
    });
    setAdminId("");
    logout();
  };
  return (
    <Button sx={{ m: 1 }} onClick={handleLogout} color="error">
      Log out
    </Button>
  );
};

export default Logout;
