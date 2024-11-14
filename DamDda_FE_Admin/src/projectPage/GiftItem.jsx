import { Button, Typography, Box, Chip } from "@mui/material";

const GiftItem = (props) => {
  const { reward, index, handleClick } = props;

  return (
    <Button
      variant="contained"
      sx={{
        display: "flex",
        flexDirection: "column",
        margin: 2,
        width: 130,
        height: 100,
        backgroundColor: "#677cf9",
        color: "#FFFFFF",
        textAlign: "center",
        borderRadius: 5,
      }}
      onClick={() => handleClick(index)}
    >
      <Typography sx={{ padding: 0 }} variant="p">
        {reward.name}
      </Typography>
      <Chip
        sx={{
          marginTop: "10px",
          minWidth: "100px",
          backgroundColor: "#EDEDED",
        }}
        label={`${reward.count} 개`}
      />
    </Button>
  );
};

export default GiftItem;
