import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  TextField,
} from "@mui/material";
import UserTable from "userPage/UserTable";
import { useEffect, useState } from "react";
import apiClient from "utils/ApiClient";
import { SERVER_URL } from "utils/URLs";
import SearchIcon from "@mui/icons-material/Search";

const UserPage = () => {
  const [members, setMembers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("loginId");
  const [page, setPage] = useState(1);
  const [paging, setPaging] = useState({
    size: 10,
    totalCounts: 0,
    totalPages: 0,
  });

  const handleQuery = (e) => setQuery(e.target.value);
  const handleKeyword = (e) => setKeyword(e.target.value);
  const onPageChange = (e, value) => setPage(value);

  const fetchMember = async () => {
    apiClient({
      method: "GET",
      url: `${SERVER_URL}/admin/members`,
      params: {
        query: query,
        keyword: keyword,
        page: page - 1,
        size: paging.size,
      },
    })
      .then((response) => {
        setMembers(response.data.dtoList);
        setPaging({
          ...paging,
          totalCount: response.data.totalCounts,
          totalPages: response.data.totalPages,
        });
      })
      .catch((e) => console.error(e));
  };
  useEffect(() => {
    fetchMember();
  }, []);

  useEffect(() => {
    fetchMember();
  }, [page]);

  const search = () => {
    fetchMember();
    setPage(1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") search();
  };

  return (
    <Box>
      <Box sx={{ backgroundColor: "#DDDDDD", height: 45 }}>&nbsp;</Box>
      <Box
        sx={{
          backgroundColor: "#EEEEEE",
          display: "flex",
          flexDirection: "row",
          justifyContent: "end",
        }}
      >
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel>검색 기준</InputLabel>
          <Select value={query} onChange={handleQuery}>
            <MenuItem value={null}>None</MenuItem>
            <MenuItem value="loginId">아이디</MenuItem>
            <MenuItem value="name">이름</MenuItem>
            <MenuItem value="email">이메일</MenuItem>
            <MenuItem value="phoneNumber">전화번호</MenuItem>
            <MenuItem value="createdAt">가입 날짜</MenuItem>
          </Select>
        </FormControl>
        <TextField
          sx={{ m: 1 }}
          variant="filled"
          value={keyword}
          onChange={handleKeyword}
          onKeyDown={handleKeyDown}
        />
        <IconButton sx={{ marginRight: 3 }} onClick={search}>
          <SearchIcon />
        </IconButton>
      </Box>
      <UserTable members={members} />
      <Pagination
        sx={{ m: 2 }}
        count={paging.totalPages}
        page={page}
        onChange={onPageChange}
        color="primary"
        variant="outlined"
      />
    </Box>
  );
};

export default UserPage;
