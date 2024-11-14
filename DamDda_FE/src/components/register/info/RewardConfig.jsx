import {
  BlueBorderButtonComponent,
  BlueButtonComponent,
} from "components/common/ButtonComponent";
import Form from "./Form";
import {
  baseTheme,
  InputBox,
} from "components/register/info/InputBoxComponent";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { DeleteButtonTrash } from "components/common/Gift/DeleteButtons";
import { AddButton } from "./PlusMinusButton";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { SERVER_URL } from "constants/URLs";
import { IconButton, ThemeProvider, Tooltip } from "@mui/material";

const RewardConfig = (props) => {
  const { projectId, rewards, fetchRewards, handleSnackbarOpen } = props;
  const accessToken = Cookies.get("accessToken");

  // input state variables
  const [rewardName, setRewardName] = useState("");
  const [optionName, setOptionName] = useState("");
  const [optionList, setOptionList] = useState([]);
  const [optionType, setOptionType] = useState("none");

  const clearRewardInput = () => {
    setRewardName("");
    setOptionName("");
    setOptionList([]);
    setOptionType("none");
  };

  // add reward options
  const handleOptionAdd = () => {
    setOptionList([...optionList, optionName]);
    setOptionName("");
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleOptionAdd();
    }
  };

  // delete reward option
  const handleOptionDelete = (id) => {
    setOptionList(optionList.filter((option, index) => index !== id));
  };

  // add new Reward to server
  const handleRewardAdd = async () => {
    if (!rewardName || (optionType === "select" && optionList.length === 0)) {
      alert("선물 이름과 옵션을 모두 입력해주세요.");
      return;
    }
    const newReward = {
      name: rewardName,
      count: 1,
      OptionList: optionList,
      optionType: optionType,
    };
    const status = await axios({
      method: "POST",
      url: `${SERVER_URL}/package/rewards/${projectId}`,
      data: newReward,
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.status)
      .catch((error) => {
        console.error("선물 옵션을 추가하던 중 오류 발생:", error);
        handleSnackbarOpen("error", "선물 옵션을 추가하지 못했어요.");
      });
    if (200 <= status <= 299) {
      handleSnackbarOpen("success", "선물 옵션이 추가되었습니다.");
      fetchRewards();
      clearRewardInput();
    }
  };

  // delete Reward in server
  const handleRewardDelete = async (rewardId) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) {
      return;
    }
    const status = await axios({
      method: "DELETE",
      url: `${SERVER_URL}/package/rewards/${rewardId}`,
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.status)
      .catch((e) => {
        console.error(e);
        handleSnackbarOpen("error", "선물을 삭제하지 못했어요.");
      });

    if (200 <= status <= 299) {
      handleSnackbarOpen("success", "선물이 성공적으로 삭제되었습니다.");
      fetchRewards();
    }
  };

  return (
    <div className="text-section">
      <h3>선물 옵션</h3>
      <Form title={"선물 이름"}>
        <InputBox
          label=""
          value={rewardName}
          onChange={(e) => setRewardName(e.target.value)}
          tooltip={"선물 이름을 적어주세요."}
        />
      </Form>
      <Form title={"옵션 조건"}>
        <div className="button-group" style={{ width: "100%", gap: "10px" }}>
          <div className="button-group" style={{ width: "100%", gap: "40px" }}>
            {optionType === "none" ? (
              <BlueButtonComponent
                text="없음"
                onClick={() => setOptionType("none")}
              />
            ) : (
              <BlueBorderButtonComponent
                text="없음"
                onClick={() => setOptionType("none")}
              />
            )}
            {optionType === "select" ? (
              <BlueButtonComponent
                text="선택식"
                onClick={() => setOptionType("select")}
              />
            ) : (
              <BlueBorderButtonComponent
                text="선택식"
                onClick={() => setOptionType("select")}
              />
            )}
          </div>
          <ThemeProvider theme={baseTheme}>
            <Tooltip
              title="선물에 옵션이 있을 경우 선택식을 클릭 후 옵션을 추가하세요."
              placement="top"
            >
              <IconButton className="icon">
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </ThemeProvider>
        </div>
      </Form>
      {optionType === "select" && (
        <>
          <Form title="옵션 항목">
            <div className="button-group" style={{ width: "100%", gap: "5px" }}>
              <InputBox
                label=""
                value={optionName}
                onKeyDown={handleKeyDown}
                onChange={(e) => setOptionName(e.target.value)}
                tooltip={"옵션을 입력해주세요."}
              />
              <AddButton onClick={handleOptionAdd} />
            </div>
          </Form>
          <Form title="옵션 리스트">
            <div className="scrollable">
              {optionList !== undefined &&
                optionList.map((option, index) => (
                  <div className="common-item" key={index}>
                    {option}
                    <DeleteButtonTrash
                      onClick={() => handleOptionDelete(index)}
                    />
                  </div>
                ))}
            </div>
          </Form>
        </>
      )}
      <Form>
        <BlueButtonComponent text="선물 추가" onClick={handleRewardAdd} />
      </Form>
      <Form title="선물 리스트">
        <div className="scrollable">
          {rewards.length > 0 &&
            rewards.map((reward, index) => (
              <div className="common-item" key={reward.id}>
                {`${reward.name} ` +
                  (reward.optionType === "none"
                    ? ""
                    : `(${
                        reward.OptionList &&
                        reward.OptionList.length > 0 &&
                        reward.OptionList.join(", ")
                      })`)}
                <DeleteButtonTrash
                  onClick={() => handleRewardDelete(reward.id)}
                />
              </div>
            ))}
        </div>
      </Form>
    </div>
  );
};

export default RewardConfig;
