import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { SERVER_URL } from "constants/URLs";
import RewardConfig from "./RewardConfig";
import PackageConfig from "./PackageConfig";
import PackageList from "./PackageList";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { IconButton, ThemeProvider } from "@mui/material";
import { arrowTheme } from "components/register/info/InputBoxComponent";

const Package = (props) => {
  const { handleSnackbarOpen } = props;
  const location = useLocation();
  const projectId = new URLSearchParams(location.search).get("projectId");
  const accessToken = Cookies.get("accessToken");

  // fetch from server
  const [rewards, setRewards] = useState([]);
  const [packages, setPackages] = useState([]);
  // set paging
  const [page, setPage] = useState(0);
  // state variables for pacakge configuration
  const [packageName, setPackageName] = useState(null);
  const [packageRewards, setPackageRewards] = useState([]);
  const [selectReward, setSelectReward] = useState("");
  const [isLimit, setLimit] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [packageLimit, setPackageLimit] = useState(-1);
  const [packagePrice, setPackagePrice] = useState(""); // 가격은 String 으로 했다가 제출할때만 parseInt 하기!
  const [currentPackageId, setCurrentPackageId] = useState(null);

  // fetch Rewards from server
  const fetchRewards = async () => {
    axios({
      method: "GET",
      url: `${SERVER_URL}/package/rewards/project/${projectId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    })
      .then((response) => {
        setRewards(
          response.data.map((Reward) => ({
            id: Reward.id,
            name: Reward.name,
            count: Reward.count,
            OptionList: Reward.OptionList,
            optionType: Reward.optionType,
          }))
        );
      })
      .catch((error) => {
        console.error("선물 목록을 가져오는 중 오류 발생:", error);
        handleSnackbarOpen("error", "선물 목록을 가져오지 못했어요.");
      });
  };

  // fetch packages from server
  const fetchPackages = async () => {
    axios({
      method: "GET",
      url: `${SERVER_URL}/package/${projectId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    })
      .then((response) => {
        console.log(
          response.data.map((pack) => ({
            id: pack.id,
            name: pack.name,
            count: pack.count,
            price: pack.price,
            quantityLimited: pack.quantityLimited,
            RewardList: Array.isArray(pack.RewardList) ? pack.RewardList : [],
          }))
        );
        setPackages(
          response.data.map((pack) => ({
            id: pack.id,
            name: pack.name,
            count: pack.count,
            price: pack.price,
            quantityLimited: pack.quantityLimited,
            RewardList: Array.isArray(pack.RewardList) ? pack.RewardList : [],
          }))
        );
      })
      .catch((error) => {
        console.error("패키지 목록을 가져오는 중 오류 발생:", error);
        handleSnackbarOpen("error", "패키지 목록을 가져오지 못했어요.");
      });
  };

  // setting to modify package
  const getPackage = async (packageId) => {
    const pack = packages.find((p) => p.id === packageId);
    setCurrentPackageId(pack.id);
    setPackageName(pack.name);
    setPackageRewards(pack.RewardList);
    setPackageLimit(pack.quantityLimited);
    setLimit(pack.quantityLimited !== 0);
    setPackagePrice(pack.price.toLocaleString());
    setEditing(true);
  };

  useEffect(() => {
    fetchRewards();
    fetchPackages();
  }, []);

  return (
    <div className="package-page">
      <div className="button-group">
        <ThemeProvider theme={arrowTheme}>
          <IconButton disabled={page === 0} onClick={() => setPage(0)}>
            <ArrowBack />
          </IconButton>
        </ThemeProvider>

        <div className={page === 0 ? "block" : "hide"}>
          <RewardConfig
            projectId={projectId}
            rewards={rewards}
            fetchRewards={fetchRewards}
            handleSnackbarOpen={handleSnackbarOpen}
          />
        </div>

        <div className={page === 1 ? "block" : "hide"}>
          <PackageConfig
            projectId={projectId}
            rewards={rewards}
            packages={packages}
            setPackages={setPackages}
            selectReward={selectReward}
            setSelectReward={setSelectReward}
            packageRewards={packageRewards}
            setPackageRewards={setPackageRewards}
            packageLimit={packageLimit}
            setPackageLimit={setPackageLimit}
            packageName={packageName}
            setPackageName={setPackageName}
            isLimit={isLimit}
            setLimit={setLimit}
            currentPackageId={currentPackageId}
            packagePrice={packagePrice}
            setPackagePrice={setPackagePrice}
            isEditing={isEditing}
            setEditing={setEditing}
            fetchPackages={fetchPackages}
            handleSnackbarOpen={handleSnackbarOpen}
          />
        </div>

        <ThemeProvider theme={arrowTheme}>
          <IconButton disabled={page === 1} onClick={() => setPage(1)}>
            <ArrowForward />
          </IconButton>
        </ThemeProvider>
      </div>
      <PackageList
        packages={packages}
        setPackages={setPackages}
        getPackage={getPackage}
      />
    </div>
  );
};

export default Package;
