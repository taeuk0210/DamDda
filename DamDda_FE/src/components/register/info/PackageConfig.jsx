import {
  BlueBorderButtonComponent,
  BlueButtonComponent,
} from "components/common/ButtonComponent";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Form from "./Form";
import {
  baseTheme,
  InputBox,
} from "components/register/info/InputBoxComponent";
import { DropdownComponent } from "components/common/DropdownComponent";
import { DeleteButtonTrash } from "components/common/Gift/DeleteButtons";
import { AddButton, MinusButton } from "./PlusMinusButton";
import axios from "axios";
import Cookies from "js-cookie";
import { SERVER_URL } from "constants/URLs";
import { IconButton, ThemeProvider, Tooltip } from "@mui/material";

const PackageConfig = (props) => {
  const {
    projectId,
    rewards,
    packages,
    selectReward,
    setSelectReward,
    setPackages,
    packageRewards,
    setPackageRewards,
    packageLimit,
    setPackageLimit,
    packageName,
    setPackageName,
    isLimit,
    setLimit,
    currentPackageId,
    packagePrice,
    setPackagePrice,
    isEditing,
    setEditing,
    fetchPackages,
    handleSnackbarOpen,
  } = props;
  const accessToken = Cookies.get("accessToken");

  // clear package inputs
  const clearPackageInput = () => {
    setPackageName("");
    setSelectReward(null);
    setPackageRewards([]);
    setLimit(false);
    setPackageLimit(-1);
    setPackagePrice("");
  };

  // add reward to package
  const handleRewardAdd = (rewardName) => {
    setSelectReward(rewardName);
    const rwd = rewards.find((reward) => reward.name === rewardName);
    if (!packageRewards.find((reward) => reward.id === rwd.id))
      setPackageRewards([...packageRewards, { ...rwd, count: 1 }]);
    setSelectReward(null);
  };

  // delete reward in package
  const handleRewardDelete = (id) => {
    setPackageRewards(packageRewards.filter((reward) => reward.id !== id));
  };

  // handle count of rewards in package
  const handleCountChange = (id, value) => {
    const newReward = packageRewards.find((reward) => reward.id === id);
    if (value === "--") {
      newReward.count = Math.max(newReward.count - 1, 1);
    } else if (value === "++") {
      newReward.count = newReward.count + 1;
    } else {
      newReward.count = Math.max(Number(value), 1);
    }
    setPackageRewards(
      packageRewards.filter((reward) => reward.id !== id).concat(newReward)
    );
  };

  // handle limitaion of package
  const handleLimitChange = (value) => {
    let newValue;
    if (value === "--") {
      newValue = Math.max(packageLimit - 1, 1);
    } else if (value === "++") {
      newValue = packageLimit + 1;
    } else {
      newValue = Math.max(Number(value), 1);
    }
    setPackageLimit(newValue);
  };

  // add or modify package to server
  const handlePackageAddOrModify = async () => {
    if (!packageName || packageRewards.length === 0 || !packagePrice) {
      alert("구성 이름, 선물, 가격을 모두 입력해주세요.");
      return;
    }
    const newPackage = {
      name: packageName,
      RewardList: packageRewards.map((reward) => ({
        id: reward.id,
        name: reward.name,
        count: reward.count,
        OptionList: reward.OptionList,
        optionType: reward.optionType,
      })),
      quantityLimited: isLimit ? packageLimit : -1, // 제한 수량이 없으면 '무제한'
      price: parseInt(packagePrice.replace(/,/g, "")),
    };
    if (isEditing) {
      newPackage.id = currentPackageId;
    }

    const status = await axios({
      method: isEditing ? "PUT" : "POST",
      url: `${SERVER_URL}/package/${projectId}`,
      data: newPackage,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.status)
      .catch((e) => {
        console.error(e);
        handleSnackbarOpen(
          "error",
          `선물 구성이 ${isEditing ? "수정" : "추가"}되지 못했어요.`
        );
      });
    if (200 <= status <= 299) {
      let newPackages;
      if (isEditing) {
        newPackages = packages
          .filter((pack) => pack.id !== currentPackageId)
          .concat(newPackage);
      } else {
        newPackages = [...packages, newPackage];
      }
      setPackages(newPackages);
      handleSnackbarOpen(
        "success",
        `선물 구성이 성공적으로 ${isEditing ? "수정" : "추가"}되었습니다.`
      );
    }
    fetchPackages();
    clearPackageInput();
    setEditing(false);
  };

  return (
    <div className="text-section">
      <h3>선물 구성</h3>
      <div className="text-section" style={{ marginTop: "20px" }}>
        <Form title={"구성 이름"}>
          <InputBox
            label=""
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            tooltip={"선물 구성 이름을 적어주세요."}
          />
        </Form>
        <Form title={"선물 선택"}>
          <DropdownComponent
            name={""}
            inputLabel={""}
            selectValue={selectReward}
            menuItems={rewards.map((reward) => reward.name)}
            onChange={(e) => handleRewardAdd(e.target.value)}
          />
        </Form>
        <Form title={"선택된 선물"}>
          <div className="scrollable">
            {packageRewards && (
              <div>
                {packageRewards
                  .sort((a, b) => a.id - b.id)
                  .map((reward) => (
                    <div key={reward.id} className="common-item">
                      <p>{reward.name}</p>
                      <div className="button-group">
                        <div className="count-box">
                          <MinusButton
                            onClick={() => handleCountChange(reward.id, "--")}
                          />
                          <input
                            className="count-input"
                            value={reward.count}
                            onChange={(e) =>
                              handleCountChange(reward.id, e.target.value)
                            }
                          />
                          <AddButton
                            onClick={() => handleCountChange(reward.id, "++")}
                          />
                        </div>
                        <DeleteButtonTrash
                          onClick={() => handleRewardDelete(reward.id)}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </Form>

        <Form title={"제한 수량"}>
          <div className="button-group" style={{ width: "100%", gap: "5px" }}>
            <div
              className="button-group"
              style={{ width: "100%", gap: "20px" }}
            >
              {isLimit && packageLimit !== -1 ? (
                <BlueBorderButtonComponent
                  text="없음"
                  onClick={() => {
                    setLimit(false);
                    setPackageLimit(-1);
                  }}
                />
              ) : (
                <BlueButtonComponent
                  text="없음"
                  onClick={() => {
                    setLimit(false);
                    setPackageLimit(-1);
                  }}
                />
              )}

              {isLimit && packageLimit !== -1 ? (
                <BlueButtonComponent
                  text="있음"
                  onClick={() => {
                    setLimit(true);
                    setPackageLimit(100);
                  }}
                />
              ) : (
                <BlueBorderButtonComponent
                  text="있음"
                  onClick={() => {
                    setLimit(true);
                    setPackageLimit(100);
                  }}
                />
              )}

              {isLimit && packageLimit !== -1 ? (
                <div className="count-box">
                  <MinusButton onClick={() => handleLimitChange("--")} />
                  <input
                    className="count-input"
                    value={packageLimit}
                    onChange={(e) => handleLimitChange(e.target.value)}
                  />
                  <AddButton onClick={() => handleLimitChange("++")} />
                </div>
              ) : (
                <div style={{ paddingLeft: "132px" }} />
              )}
            </div>

            <ThemeProvider theme={baseTheme}>
              <Tooltip
                title="해당 패키지에 제한 수량이 있는 경우 있음을 선택 후 총 수량을 입력하세요."
                placement="top"
              >
                <IconButton className="icon">
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </ThemeProvider>
          </div>
        </Form>

        <Form title={"가격"}>
          <InputBox
            label=""
            value={packagePrice + " 원"}
            onChange={(e) =>
              setPackagePrice(
                e.target.value
                  .replace(/[^\d]/g, "") //이전 상태에 쉼표가 포함됨 -> 쉼표 제거
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              )
            }
            tooltip={"선물 구성의 가격을 입력하세요."}
          />
        </Form>
        <Form>
          <BlueButtonComponent
            text={isEditing ? "구성 수정" : "구성 추가"}
            onClick={handlePackageAddOrModify}
          />
        </Form>
      </div>
    </div>
  );
};

export default PackageConfig;
