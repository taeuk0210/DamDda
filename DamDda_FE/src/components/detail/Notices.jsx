import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  IconButton,
  Divider,
  Chip,
  TextField,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useUser } from "UserContext";
import axios from "axios";
import { SERVER_URL } from "constants/URLs";
import Cookies from "js-cookie";

export const Notice = ({ nickName, projectId }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [notices, setNotices] = useState([]);
  const [editingNoticeId, setEditingNoticeId] = useState(null);
  const { user } = useUser();
  // 공지사항 리스트를 관리하는 상태 (처음에는 세 개의 더미 데이터로 초기화)
  //   {
  //     id: 1,
  //     title: "1번째 예시 공지사항 제목",
  //     content: "1번째 예시 공지사항 내용입니다.",
  //     date: new Date(2024, 6, 23).toLocaleDateString(),
  //     imageUrl: "https://via.placeholder.com/80", // Replace with actual image URL
  //   },
  //   {
  //     id: 2,
  //     title: "2번째 예시 공지사항 제목",
  //     content: "2번째 예시 공지사항 내용입니다.",
  //     date: new Date(2023, 7, 1).toLocaleDateString(),
  //     imageUrl: "https://via.placeholder.com/80",
  //   },
  //   {
  //     id: 3,
  //     title: "3번째 예시 공지사항 제목",
  //     content: "3번째 예시 공지사항 내용입니다.",
  //     date: new Date(2024, 4, 10).toLocaleDateString(),
  //     imageUrl: "https://via.placeholder.com/80",
  //   },
  // ]);

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/notice?projectId=${projectId}`, {
        headers: {
          ...(Cookies.get("accessToken") && {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          }),
        },
      })
      .then((response) => {
        setNotices(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // 새로운 공지사항을 추가하는 함수(수정 완)
  const handleAddNotice = () => {
    const alertText = newTitle
      ? newContent
        ? ""
        : "내용을 입력해주세요."
      : newContent
        ? "제목을 입력해주세요."
        : "제목과 내용을 입력해 주세요.";
    if (alertText !== "") {
      alert(alertText);
      return;
    }
    const newNotice = {
      title: newTitle,
      content: newContent,
      projectId: projectId,
    };
    axios
      .post(`${SERVER_URL}/notice`, newNotice, {
        headers: {
          ...(Cookies.get("accessToken") && {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          }),
        },
      })
      .then((response) => {
        setNotices((prevNotices) => [...prevNotices, response.data]);
        setNewTitle("");
        setNewContent("");
        console.log(response.data);
        window.alert("공지사항이 등록되었습니다.");
      })
      .catch((error) => {
        console.error(error.response.data);
        window.alert(
          "공지사항 등록에 실패했습니다." + error.response.data.message
        );
      });
  };

  // 공지사항을 삭제하는 함수 (ID를 기준으로 필터링하여 삭제)
  const handleDeleteNotice = async (id) => {
    if (window.confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
      axios
        .delete(`${SERVER_URL}/notice/${id}`, {
          headers: {
            ...(Cookies.get("accessToken") && {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            }),
          },
        })
        .then(() => {
          setNotices(notices.filter((notice) => notice.id !== id));
          window.alert("공지사항이 삭제되었습니다.");
        })
        .catch((error) => {
          console.error(error.response.data);
        });
    }
  };

  const handleEditNotice = (id) => {
    setEditingNoticeId(id);
    const noticeToEdit = notices.find((notice) => notice.id === id);
    if (noticeToEdit) {
      setEditTitle(noticeToEdit.title);
      setEditContent(noticeToEdit.content);
    }
  };

  // 공지사항 저장
  const handleSaveNotice = async (id) => {
    const updatedNotice = {
      id: id,
      projectId: projectId,
      title: editTitle,
      content: editContent,
      date: notices.find((notice) => notice.id === id).date,
      updated: new Date().toLocaleDateString(),
    };
    axios
      .put(`${SERVER_URL}/notice/${id}`, updatedNotice, {
        headers: {
          ...(Cookies.get("accessToken") && {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          }),
        },
      })
      .then((response) => {
        const updatedNotices = notices.map((notice) =>
          notice.id === id ? response.data : notice
        );
        setNotices(updatedNotices);
        setEditingNoticeId(null);
        setEditTitle("");
        setEditContent("");
        window.alert("공지사항이 수정되었습니다.");
      })
      .catch((error) => {
        console.error(error.response.data);
        window.alert("공지사항 수정에 실패했습니다.");
      });
  };

  // 최신순으로 공지사항을 정렬하는 함수
  const sortedNotices = notices.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div style={{ width: "100%" }}>
      {/* 공지사항 입력 영역 */}
      {user.nickname === nickName && (
        <div
          style={{
            marginBottom: "50px", // 아래쪽에 여유 공간 추가
            maxWidth: "1200px", // 입력 영역의 최대 너비 설정
            margin: "0 auto", // 가운데 정렬
          }}
        >
          <Typography
            variant="h6"
            style={{ fontWeight: "bold", marginBottom: "20px" }}
          >
            공지사항 입력하기
          </Typography>

          <TextField
            label="제목을 입력해주세요."
            fullWidth
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="내용을 입력해주세요."
            fullWidth
            multiline
            rows={4}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <Button
            variant="contained"
            onClick={handleAddNotice}
            style={{ float: "right" }}
          >
            등록하기
          </Button>
        </div>
      )}

      {/* 등록된 공지사항 리스트 */}
      <div style={{ width: "1200px", margin: "10px auto", clear: "both" }}>
        {sortedNotices.map((notice, index) => (
          <React.Fragment key={notice.id}>
            {/* 공지사항 카드 */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "15px",
                alignItems: "center",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {/* 공지, 중요 뱃지 - 모든 공지사항에 붙음 */}
                  <Chip
                    label="공지"
                    style={{
                      marginRight: "5px",
                      backgroundColor: "#007bff",
                      color: "#fff",
                    }}
                    size="small"
                  />
                  <Chip
                    label="중요"
                    style={{
                      marginRight: "5px",
                      backgroundColor: "#ff9800",
                      color: "#fff",
                    }}
                    size="small"
                  />
                  {/* 제목 */}
                  <Typography
                    variant="h6"
                    style={{
                      fontWeight: "bold",
                      marginRight: "10px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {editingNoticeId === notice.id ? (
                      <TextField
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        variant="outlined"
                        size="small"
                        style={{ marginRight: "10px" }}
                      />
                    ) : (
                      <span>{notice.title}</span>
                    )}
                  </Typography>
                </div>
                {/* 내용 */}
                <Typography variant="body1" style={{ marginTop: "10px" }}>
                  {editingNoticeId === notice.id ? (
                    <TextField
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      variant="outlined"
                      multiline
                      rows={4}
                      fullWidth
                    />
                  ) : (
                    notice.content.split("\n").map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))
                  )}
                </Typography>
                {/* 작성일자 */}
                <Typography
                  variant="body2"
                  style={{ color: "#888", marginTop: "5px" }}
                >
                  작성자: 관리자({nickName})
                </Typography>
              </div>

              {/* 수정/삭제 버튼 */}
              <div style={{ marginLeft: "20px" }}>
                {nickName === user.nickname && (
                  <div>
                    {editingNoticeId === notice.id ? (
                      <>
                        <Button
                          variant="contained"
                          onClick={() => handleSaveNotice(notice.id)}
                          style={{ marginRight: "10px" }}
                        >
                          저장
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => setEditingNoticeId(null)}
                        >
                          취소
                        </Button>
                      </>
                    ) : (
                      <>
                        <IconButton onClick={() => handleEditNotice(notice.id)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteNotice(notice.id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* 구분선 */}
            {index < notices.length - 1 && (
              <Divider style={{ margin: "0px" }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
