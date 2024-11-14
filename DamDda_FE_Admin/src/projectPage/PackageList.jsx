import { Chip } from "@mui/material";

const PackageList = (props) => {
  const { packages, handleClick } = props;

  return (
    <div className="package-list">
      <div
        className="scrollable"
        style={{ marginTop: "20px", height: "550px", width: "330px" }}
      >
        {packages.length > 0 ? (
          packages
            .sort((a, b) => a.id - b.id)
            .map((pack, index) => (
              <div
                key={pack.id}
                className="package-card"
                onClick={() => handleClick(index)}
              >
                <div
                  className="button-group"
                  style={{
                    marginTop: "10px",
                    justifyContent: "space-between",
                  }}
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
                        <Chip
                          sx={{ minWidth: "100px" }}
                          label={`${reward.count} 개`}
                        />
                      </div>
                      <ul className="option-ul">
                        {reward.OptionList.map((opt, optIndex) => (
                          <li key={optIndex}>{opt}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
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
              width: "100%",
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default PackageList;
