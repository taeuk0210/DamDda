import React, { useEffect, useState } from "react";
import { Typography, Divider } from "@mui/material";
import { QnAQuestion } from "./QnAQuestion";
import { useUser } from "UserContext";
import axios from "axios";
import Cookies from "js-cookie";
import { SERVER_URL } from "constants/URLs";
// import { useLocation } from "react-router-dom";
import { StandardInputBox } from "components/common/InputBoxComponent";
import { QnAButtonComponent } from "components/common/ButtonComponent";

export const QnA = ({ nickName, projectId }) => {
  const [questions, setQuestions] = useState([]);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [replyContent, setReplyContent] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const { user } = useUser();
  //const location = useLocation();
  //const query = new URLSearchParams(location.search);
  //const projectId = query.get("projectId") || "";

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/qna/question`, {
        headers: {
          ...(Cookies.get("accessToken") && {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          }),
        },
        params: { projectId },
      });
      console.log("response.dataresponse.data : ", response.data.content);
      if (Array.isArray(response.data.content)) {
        setQuestions(response.data.content);
      } else {
        console.error("질문 데이터가 배열이 아닙니다:", response.data.content);
      }
    } catch (error) {
      console.error("질문을 불러오는 데 실패했습니다.", error);
    }
  };

  // 문의 등록
  const handleAddQuestion = async () => {
    const newQuestion = {
      projectId: Number(projectId),
      memberId: user.key,
      author: user.nickname,
      profileImage: user.profile,
      date: new Date().toLocaleString(),
      title: newTitle || "문의제목입니다",
      content: newContent || "문의 내용을 입력해주세요.",
      comments: [],
    };

    console.log(newQuestion);

    try {
      const response = await axios.post(
        `${SERVER_URL}/qna/question`,
        newQuestion,
        {
          headers: {
            ...(Cookies.get("accessToken") && {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            }),
          },
        }
      );
      console.log("response.data: ", response.data);

      alert("등록이 완료되었습니다");
      setQuestions((prevQuestions) => [...prevQuestions, response.data]);
      setNewTitle("");
      setNewContent("");
    } catch (error) {
      console.error(
        "질문을 등록하는 데 실패했습니다.",
        error.response?.data || error.message
      );
    }
  };

  // 컴포넌트가 마운트될 때 질문 목록 불러오기
  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div style={{ width: "100%" }}>
      {/* ////////////////////////////////////질문 등록 폼//////////////////////////////////// */}
      <div
        style={{
          marginBottom: "50px",
          width: "80%",
          minWidth: "300px",
          margin: "0 auto",
        }}
      >
        <Typography
          variant="h6"
          style={{ fontWeight: "bold", marginBottom: "20px" }}
        >
          {user.nickname}
        </Typography>

        <StandardInputBox
          placeholder="제목을 입력해주세요."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{ marginBottom: "10px" }}
        />

        <StandardInputBox
          placeholder="내용을 입력해주세요."
          rows={4}
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          style={{ marginBottom: "10px" }}
        />

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <QnAButtonComponent
            variant="contained"
            onClick={handleAddQuestion}
            text={"문의하기"}
          />
        </div>
      </div>

      {/* ////////////////////////////////////등록된 질문 리스트//////////////////////////////////// */}
      <br />
      <div style={{ width: "80%", minWidth: "300px", margin: "0 auto" }}>
        {Array.isArray(questions) && questions.length > 0 ? (
          questions.map((question, index) => (
            <React.Fragment key={question.id}>
              <QnAQuestion
                questions={questions}
                setQuestions={setQuestions}
                question={question}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                replyContent={replyContent}
                setReplyContent={setReplyContent}
                projectId={projectId}
                nickName={nickName}
              />
              {/* 구분선 */}
              {/* {index < questions.length - 1 && (
                <Divider style={{ marginBottom: "20px" }} />
              )} */}
            </React.Fragment>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            등록된 Q&A가 없습니다.
          </Typography>
        )}
      </div>
    </div>
  );
};
