import React from "react";
import { Card, CardContent, Typography, Button, Box, Grid } from "@mui/material";
import CheckIcon from "@mui/icons-material/CheckCircle";
import styles from "../css/RewardCard.module.css"; // CSS 모듈 가져오기

export const RewardCard = ({ amount, title, description, selectedCount, remainingCount }) => {
  return (
    <Card
      className={styles.rewardCard}
      sx={{ borderColor: selectedCount > 0 ? "#FF4081" : "#E0E0E0" }}
    >
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={10}>
            <Box>
              {selectedCount > 0 && (
                <Box className={styles.selectedBox}>
                  <CheckIcon className={styles.selectedIcon} />
                  <Typography variant="body2">{selectedCount}개 선택</Typography>
                </Box>
              )}
              <Typography variant="h5" className={styles.amount}>
                {amount.toLocaleString()}원 +
              </Typography>
              <Typography variant="body2" className={styles.title}>
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={2} className={styles.gridRight}>
            <Button
              size="small"
              variant="outlined"
              color={remainingCount === 0 ? "error" : "primary"}
              disabled={remainingCount === 0}
            >
              {remainingCount === 0 ? "품절" : `${remainingCount}개 남음`}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
