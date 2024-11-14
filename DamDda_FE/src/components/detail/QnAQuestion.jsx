import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Chip,
} from "@mui/material";
import { Delete, Edit, ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { QnAComment } from "./QnAComment";
import { StandardInputBox } from "components/common/InputBoxComponent";
import { useUser } from "UserContext";
import {
  QnAButtonComponent,
  QnASmallButtonComponent,
} from "components/common/ButtonComponent";
import axios from "axios";
import { SERVER_URL } from "constants/URLs";
import Cookies from "js-cookie";

export const QnAQuestion = ({
  questions,
  setQuestions,
  question,
  replyingTo,
  setReplyingTo,
  // replyContent,
  // setReplyContent,
  // memberId,
  nickName,
  projectId,
}) => {
  const [replyContents, setReplyContents] = useState([]);
  const [newReplyContent, setNewReplyContent] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState(question.title);
  const [editedContent, setEditedContent] = useState(question.content);

  const { user } = useUser();

  //댓글 불러오기
  const fetchReplyContents = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/qna/reply`, {
        headers: {
          ...(Cookies.get("accessToken") && {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          }),
        },
        params: { qnaQuestionId: question.id },
      });
      console.log("reply, get, data, 하는중 : ", response.data);
      if (Array.isArray(response.data)) {
        setReplyContents(response.data);
      } else {
        console.error("질문 데이터가 배열이 아닙니다:", response.data);
      }
    } catch (error) {
      console.error("질문을 불러오는 데 실패했습니다.", error);
    }
  };

  useEffect(() => {
    fetchReplyContents();
  }, []);

  //댓글 등록
  // 문의 등록
  const handleAddReply = async () => {
    const newReply = {
      qnaQuestionId: question.id,
      memberId: user.key,
      // parentReplyId: question.id,
      content: newReplyContent || "문의 내용을 입력해주세요.",
      depth: 1,
      orderPosition: 1,
    };

    console.log("newReply: ", newReply);

    try {
      const response = await axios.post(`${SERVER_URL}/qna/reply`, newReply, {
        headers: {
          "Content-Type": "application/json",
          ...(Cookies.get("accessToken") && {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          }),
        },
      });
      console.log("response.data: ", response.data);

      alert("등록이 완료되었습니다");
      setReplyContents((prevQuestions) => [...prevQuestions, response.data]);
      setNewReplyContent("");
    } catch (error) {
      console.error(
        "댓글을 등록하는 데 실패했습니다.",
        error.response?.data || error.message
      );
    }
  };

  // 문의 수정
  const handleEditQuestion = async () => {
    try {
      const response = await axios.put(
        `${SERVER_URL}/qna/question/${question.id}`,
        {
          id: question.id,
          projectId: question.projectId,
          memberId: question.memberId,
          title: editedTitle,
          content: editedContent,
        },
        {
          headers: {
            ...(Cookies.get("accessToken") && {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            }),
          },
        }
      );

      const updatedQuestions = questions.map((q) => {
        if (q.id === question.id) {
          return {
            ...q,
            title: response.data.title,
            content: response.data.content,
          };
        }
        return q;
      });

      setQuestions(updatedQuestions);
      alert("수정이 완료되었습니다");
    } catch (error) {
      console.error("수정 실패:", error);
      alert("수정에 실패했습니다.");
    }
  };

  // 문의 삭제
  const handleDeleteQuestion = async () => {
    const confirmed = window.confirm("삭제하시겠습니까?");
    if (confirmed) {
      try {
        await axios.delete(`${SERVER_URL}/qna/question/${question.id}`, {
          headers: {
            ...(Cookies.get("accessToken") && {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            }),
          },
        });
        console.log("1111111111111111111");
        const updatedQuestions = questions.filter((q) => q.id !== question.id);
        console.log("1111111111111111111");
        setQuestions(updatedQuestions);
        alert("삭제가 완료되었습니다");
      } catch (error) {
        console.error("삭제 실패:", error);
        alert("삭제에 실패했습니다.");
      }
    }
  };

  const handleSaveEdit = () => {
    handleEditQuestion(question.id, editedTitle, editedContent);
    setEditMode(false);
  };

  // const toggleComments = (id) => {
  //   setShowComments((prev) => ({
  //     ...prev,
  //     [id]: !prev[id],
  //   }));
  // };

  const handleAddComment = () => {
    if (!newReplyContent) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    handleAddReply();

    // const newComment = {
    //   id: question.comments.length + 1,
    //   author: user.nickname,
    //   profileImage: user.profile,
    //   date: new Date().toLocaleString(),
    //   content: replyContents[question.id],
    //   replies: [],
    // };

    // const updatedQuestions = questions.map((q) => {
    //   if (q.id === question.id) {
    //     return {
    //       ...q,
    //       comments: [...q.comments, newComment],
    //     };
    //   }
    //   return q;
    // });

    // setQuestions(updatedQuestions);
    // setReplyContents((prev) => ({
    //   ...prev,
    //   [question.id]: "",
    // }));
  };

  return (
    <Card
      style={{
        marginBottom: "20px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        border: "1px dashed #d1d1d1",
        boxShadow: "none",
      }}
    >
      <CardContent>
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <Avatar
            src={question.profileImage}
            alt={question.memberId}
            style={{ marginRight: "10px" }}
          />

          <div style={{ flexGrow: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                variant="subtitle1"
                style={{ fontWeight: "bold", marginLeft: "10px" }}
              >
                {question.memberId}
              </Typography>
              <div>
                <IconButton onClick={() => setEditMode(true)}>
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton onClick={() => handleDeleteQuestion(question.id)}>
                  <Delete fontSize="small" />
                </IconButton>
              </div>
            </div>
            <Typography variant="caption" color="textSecondary">
              {question.date}
            </Typography>

            {editMode ? (
              <div
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              >
                <StandardInputBox
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  placeholder="수정할 제목"
                  style={{ margin: "5px 0" }}
                />
                <StandardInputBox
                  rows={4}
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  placeholder="수정할 내용"
                  style={{ margin: "5px 0" }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "10px",
                    gap: "20px",
                  }}
                >
                  <QnAButtonComponent onClick={handleSaveEdit} text={"저장"} />
                  <QnAButtonComponent
                    onClick={() => setEditMode(false)}
                    text={"취소"}
                  />
                </div>
              </div>
            ) : (
              <>
                <div
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ margin: "5px", display: "flex", gap: "20px" }}>
                    <Chip
                      label="질문"
                      style={{
                        backgroundColor: "#6A1B9A",
                        color: "#fff",
                      }}
                    />
                    <Typography variant="h6">{question.title}</Typography>
                  </div>

                  <Typography
                    variant="body1"
                    color="textSecondary"
                    style={{
                      whiteSpace: "pre-wrap",
                      padding: "10px 10px 10px 70px",
                    }}
                  >
                    {question.content}
                  </Typography>
                </div>
              </>
            )}
            <div
              onClick={() => setShowComments(!showComments)}
              style={{ cursor: "pointer", marginTop: "10px" }}
            >
              <IconButton size="small">
                {showComments ? <ArrowDropUp /> : <ArrowDropDown />}
              </IconButton>
              <Typography
                variant="body2"
                style={{ fontSize: "14px", marginLeft: "5px" }}
              >
                {question.length} 댓글
              </Typography>
            </div>

            {/* 댓글 목록 토글 */}
            {showComments && (
              <>
                {replyContents.length > 0 &&
                  replyContents.map((replyContent) => (
                    <QnAComment
                      key={replyContent.id}
                      questionId={question.id}
                      // comment={comment}
                      // question={question}
                      // questions={questions}
                      // setQuestions={setQuestions}
                      // replyingTo={replyingTo}
                      // setReplyingTo={setReplyingTo}
                      replyContents={replyContents}
                      replyContent={replyContent}
                      setReplyContents={setReplyContents}
                    />
                  ))}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ width: "85%", margin: "10px" }}>
                    <StandardInputBox
                      placeholder="댓글을 작성해주세요"
                      rows={2}
                      value={newReplyContent}
                      onChange={(e) => setNewReplyContent(e.target.value)}
                      //style={{ margin: "10px" }}
                    />
                  </div>
                  <div style={{ width: "15%", height: "53px", margin: "10px" }}>
                    <QnASmallButtonComponent
                      text={"댓글작성"}
                      onClick={handleAddComment}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
