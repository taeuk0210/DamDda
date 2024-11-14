import { Chip } from "@mui/material";
import axios from "axios";
import { BlueButtonComponent } from "components/common/ButtonComponent";
import { SERVER_URL } from "constants/URLs";
import Cookies from "js-cookie";
const PackageList = (props) => {
  const { packages, setPackages, getPackage } = props;
  const accessToken = Cookies.get("accessToken");

  const handlePacakgeDelete = async (packageId) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) {
      return;
    }
    const status = await axios({
      method: "DELETE",
      url: `${SERVER_URL}/package/${packageId}`,
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.status)
      .catch((e) => console.error(e));

    if (200 <= status <= 299) {
      setPackages(packages.filter((pack) => pack.id !== packageId));
    }
  };

  return (
    <div className="package-list">
      <h3>나의 선물구성</h3>
      <div
        className="scrollable"
        style={{ marginTop: "20px", height: "550px", width: "330px" }}
      >
        {packages.length > 0 ? (
          packages
            .sort((a, b) => a.id - b.id)
            .map((pack) => (
              <div key={pack.id} className="package-card">
                <div
                  className="button-group"
                  style={{ marginTop: "10px", justifyContent: "space-between" }}
                >
                  <h4>{pack.name}</h4>
                  <Chip
                    variant="outlined"
                    label={
                      pack.quantityLimited === -1
                        ? "무제한"
                        : pack.quantityLimited + " 개"
                    }
                    color="info"
                  />
                </div>
                <h3>{pack.price.toLocaleString()} 원</h3>
                <div className="reward-list">
                  {pack.RewardList.map((reward, rewardIndex) => (
                    <div key={rewardIndex}>
                      <div className="reward-info">
                        {reward.name}
                        <p className="quantity-box">{reward.count}개</p>
                      </div>
                      <ul className="option-ul">
                        {reward.OptionList.map((opt, optIndex) => (
                          <li key={optIndex}>{opt}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="button-group">
                  <BlueButtonComponent
                    text="수정"
                    onClick={() => getPackage(pack.id)}
                  />
                  <BlueButtonComponent
                    text="삭제"
                    onClick={() => handlePacakgeDelete(pack.id)}
                  />
                </div>
              </div>
            ))
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <img
              src={require("../../../assets/empty.png")}
              width={"100%"}
              style={{ opacity: 0.15 }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageList;
