import { Box, Button, Chip, TextField, Typography } from "@mui/material";
import { useState } from "react";
import GiftItem from "projectPage/GiftItem";
import PackageList from "projectPage/PackageList";
import Form from "common/Form";
import { InputBox } from "common/InputBoxComponent";
import { BlueButtonComponent } from "common/ButtonComponent";

const PackageInfo = (props) => {
  const { packages } = props;
  const [currentPackageIndex, setCurrentPackageIndex] = useState(0);
  const [currentGiftIndex, setCurrentGiftIndex] = useState(0);

  const handleClickPackage = (index) => {
    setCurrentGiftIndex(0);
    setCurrentPackageIndex(index);
  };

  const handleClickGift = (index) => {
    setCurrentGiftIndex(index);
  };

  return (
    <div className="text-section">
      <div className="form-container">
        <h3>프로젝트 선물 구성 확인</h3>
      </div>
      <Box
        sx={{
          marginTop: "10px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            marginBottom: 5,
          }}
        >
          <PackageList packages={packages} handleClick={handleClickPackage} />
          <div
            className="text-section"
            style={{ width: "500px", marginTop: "70px", marginLeft: "50px" }}
          >
            <Form title={"선물 구성 이름"}>
              <InputBox value={packages[currentPackageIndex].name} />
            </Form>
            <Form title={"패키지 수량 제한"}>
              <div className="button-group">
                <BlueButtonComponent
                  text={
                    packages[currentPackageIndex].quantityLimited === 0
                      ? "없음"
                      : "있음"
                  }
                />
                <InputBox
                  value={
                    packages[currentPackageIndex].quantityLimited !== 0
                      ? packages[currentPackageIndex].quantityLimited + " 개"
                      : ""
                  }
                />
              </div>
            </Form>
            <Form title={"선물 구성 가격"}>
              <InputBox
                value={
                  packages[currentPackageIndex].price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " 원"
                }
              />
            </Form>
            <Form title={"선물 리스트"}>
              <div
                style={{
                  border: "1px solid rgb(128, 128, 128, 0.3)",
                  borderRadius: "5px",
                  height: "140px",
                  width: "100%",
                  overflowX: "auto",
                }}
              >
                {packages[currentPackageIndex].RewardList.map(
                  (reward, index) => (
                    <GiftItem
                      reward={reward}
                      index={index}
                      key={index}
                      handleClick={handleClickGift}
                    />
                  )
                )}
              </div>
            </Form>
            <Form title={"선물 옵션 리스트"}>
              <div
                style={{
                  border: "1px solid rgb(128, 128, 128, 0.3)",
                  borderRadius: "5px",
                  height: "150px",
                  width: "100%",
                  overflowX: "auto",
                }}
              >
                {packages[currentPackageIndex].RewardList[
                  currentGiftIndex
                ].OptionList.map((option, index) => (
                  <Chip
                    variant="outlined"
                    color="info"
                    sx={{ margin: "10px" }}
                    key={index}
                    label={option}
                  />
                ))}
              </div>
            </Form>
          </div>
        </Box>
      </Box>
    </div>
  );
};

export default PackageInfo;
