import React, { useState } from "react"; // React
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/CheckCircle";
import { DropdownComponent } from "components/common/DropdownComponent";
import { BlueButtonComponent } from "../ButtonComponent";

export const PackageCard = ({ packageDTO, selectedCount, handleOrder }) => {
  const [onclickCard, setOnclickCard] = useState(false);

  // useState로 초기값 설정
  const [selectOptions, setSelectOptions] = useState(
    packageDTO?.RewardList?.map((reward) => ({
      rewardName: reward.name,
      selectOption: reward.option ? reward.option[0] : null,
    })) || [] // 만약 RewardList가 undefined일 경우 빈 배열 반환
  );

  const handleSelectOptions = (index, e) => {
    const newSelectOptions = [...selectOptions];
    newSelectOptions[index].selectOption = e.target.value; // 선택된 옵션 업데이트
    setSelectOptions(newSelectOptions); // 새로운 배열로 상태 업데이트
  };

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        borderColor: selectedCount > 0 ? "#FF4081" : "#E0E0E0",
        borderWidth: 2,
        width: "400px",
      }}
    >
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={8}>
            <Box>
              <Box
                onClick={() => {
                  setOnclickCard((prev) =>
                    packageDTO.quantityLimited !== 0 ? !prev : false
                  );
                }}
              >
                {selectedCount > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "#FF4081",
                    }}
                  >
                    <CheckIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {selectedCount}개 선택
                    </Typography>
                  </Box>
                )}

                <Typography variant="h5" sx={{ fontWeight: "bold", mt: 1 }}>
                  {packageDTO.price}원 +
                </Typography>

                <Typography variant="h7" sx={{ fontWeight: "bold", mt: 1 }}>
                  {packageDTO.name}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={4} sx={{ textAlign: "right" }}>
            <Button
              size="small"
              sx={{ width: "100px" }}
              variant="outlined"
              onClick={() => {
                setOnclickCard((prev) =>
                  packageDTO.quantityLimited !== 0 ? !prev : false
                );
              }}
              color={packageDTO.quantityLimited === 0 ? "error" : "primary"}
              disabled={packageDTO.quantityLimited === 0}
            >
              {packageDTO.quantityLimited === 0
                ? "품절"
                : packageDTO.quantityLimited < 0
                  ? "무제한"
                  : `${packageDTO.quantityLimited}개 남음`}
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={0} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {packageDTO.RewardList &&
              packageDTO.RewardList.map((reward, index) => (
                <div
                  key={reward.id}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: onclickCard > 0 ? "80px" : "35px",
                  }}
                >
                  <div style={{ width: "218px", fontSize: "17px" }}>
                    {reward.name} : {reward.count}개
                  </div>

                  {onclickCard &&
                    Array.isArray(reward.OptionList) &&
                    reward.OptionList.length > 0 && (
                      <div style={{ width: "150px", height: "50px" }}>
                        <DropdownComponent
                          inputLabel={reward.name + "의 옵션"}
                          menuItems={reward.OptionList}
                          selectValue={selectOptions[index].selectOption} // 기본 선택값
                          onChange={(e) => {
                            handleSelectOptions(index, e);
                          }}
                        />
                      </div>
                    )}
                </div>
              ))}
          </Typography>
        </Grid>

        {onclickCard && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: "150px", marginTop: "10px" }}>
              <BlueButtonComponent
                text={"장바구니 담기"}
                onClick={() => {
                  setOnclickCard(false);
                  handleOrder(
                    packageDTO.id,
                    packageDTO.name,
                    packageDTO.price,
                    selectOptions
                  );
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
