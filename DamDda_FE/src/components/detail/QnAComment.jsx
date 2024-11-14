import React, { useEffect, useState } from "react";
import { Typography, IconButton, Avatar } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { StandardInputBox } from "components/common/InputBoxComponent";
import { QnASmallButtonComponent } from "components/common/ButtonComponent";
import axios from "axios";
import { SERVER_URL } from "constants/URLs";
import Cookies from "js-cookie";
import { useUser } from "UserContext";
export const QnAComment = ({
  // comment,
  // question,
  // questions,
  // setQuestions,
  // qnaQuestionId,
  // nickName,
  // projectId,
  questionId,
  replyContent,
  replyContents,
  setReplyContents,
}) => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [newReply, setNewReply] = useState(replyContent.content);
  //const [editedContent, setEditedContent] = useState(comment.content);

  const handleEditComment = async () => {
    const editReplyDTO = {
      id: replyContent.id,
      qnaQuestionId: questionId,
      memberId: user.key,
      // parentReplyId: question.id,
      content: newReply || "문의 내용을 입력해주세요.",
      depth: 1,
      orderPosition: 1,
    };
    if (isEditing) {
      try {
        const response = await axios.put(
          `${SERVER_URL}/qna/reply/${replyContent.id}`,
          editReplyDTO,
          // { content: editedContent, qnaQuestionId: question.id },
          {
            headers: {
              ...(Cookies.get("accessToken") && {
                Authorization: `Bearer ${Cookies.get("accessToken")}`,
              }),
            },
          }
        );
        console.log(response);
        const updatedQuestions = replyContents.map((r) =>
          r.id === replyContent.id ? response.data : r
        );
        setReplyContents(updatedQuestions);
        alert("댓글이 수정되었습니다.");
      } catch (error) {
        console.error("댓글 수정 실패:", error);
      }
    }
    setIsEditing((prev) => !prev);
  };

  // 문의 삭제
  const handleDeleteReply = async (replyId) => {
    const confirmed = window.confirm("삭제하시겠습니까?");
    if (confirmed) {
      try {
        await axios.delete(`${SERVER_URL}/qna/reply/${replyId}`, {
          headers: {
            ...(Cookies.get("accessToken") && {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            }),
          },
        });
        const updatedReplys = replyContents.filter((r) => r.id !== replyId);
        console.log("1111111111111111111");
        setReplyContents(updatedReplys);
        alert("삭제가 완료되었습니다");
      } catch (error) {
        console.error("삭제 실패:", error);
        alert("삭제에 실패했습니다.");
      }
    }
  };

  // const handleDeleteComment = async () => {
  //   const confirmed = window.confirm("삭제하시겠습니까?");
  //   if (confirmed) {
  //     try {
  //       await axios.delete(`${SERVER_URL}/qna/question/${question.id}`, {
  //         headers: {
  //           ...(Cookies.get("accessToken") && {
  //             Authorization: `Bearer ${Cookies.get("accessToken")}`,
  //           }),
  //         },
  //       });

  //       const updatedQuestions = questions.map((q) =>
  //         q.id === question.id
  //           ? {
  //               ...q,
  //               comments: q.comments.filter((c) => c.id !== comment.id),
  //             }
  //           : q
  //       );
  //       setQuestions(updatedQuestions);
  //       alert("댓글이 삭제되었습니다.");
  //     } catch (error) {
  //       console.error("댓글 삭제 실패:", error);
  //     }
  //   }
  // };

  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        {/* <Avatar
        src={comment.profileImage}
        alt={comment.author}
        style={{ marginRight: "10px" }}
        /> */}
        <div style={{ flexGrow: 1 }}>
          {/* <Typography variant="caption" colo3856r="textSecondary">
            {replyContent.content}
          </Typography> */}
          {isEditing ? (
            <div style={{ margin: "0px 10px" }}>
              <StandardInputBox
                placeholder="수정할 댓글을 입력하세요."
                multiline
                rows={3}
                variant="outlined"
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                style={{ width: "100%", marginBottom: "10px" }}
              />
              <div style={{ display: "flex", gap: "20px" }}>
                <QnASmallButtonComponent
                  text={"취소"}
                  onClick={() => {
                    setIsEditing(false);
                  }}
                />
                <QnASmallButtonComponent
                  text={"저장"}
                  onClick={handleEditComment}
                />
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="subtitle1"
                style={{ fontWeight: "bold", marginLeft: "20px" }}
              >
                {replyContent.memberId} : {replyContent.content}
              </Typography>
              <div>
                <IconButton onClick={handleEditComment}>
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton onClick={() => handleDeleteReply(replyContent.id)}>
                  <Delete fontSize="small" />
                </IconButton>
              </div>
            </div>
            // <Typography
            //   variant="body1"
            //   color="textSecondary"
            //   style={{ marginTop: "10px", whiteSpace: "pre-wrap" }}
            // >
            //   {"comment.content"}
            // </Typography>
          )}
        </div>
      </div>
    </div>
  );
};
