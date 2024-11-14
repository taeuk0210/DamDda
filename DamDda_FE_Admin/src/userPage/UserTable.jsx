import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const UserTable = (props) => {
  const { members } = props;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <TableCell align="right">아이디</TableCell>
            <TableCell align="right">이름</TableCell>
            <TableCell align="right">이메일</TableCell>
            <TableCell align="right">전화번호</TableCell>
            <TableCell align="right">가입 날짜</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell align="right">{member.loginId}</TableCell>
              <TableCell align="right">{member.name}</TableCell>
              <TableCell align="right">{member.email}</TableCell>
              <TableCell align="right">{member.phoneNumber}</TableCell>
              <TableCell align="right">{member.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
