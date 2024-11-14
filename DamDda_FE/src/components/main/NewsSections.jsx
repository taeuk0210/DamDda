import React from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import new_section_image1 from "../../assets/newSection_image_1.png";
import new_section_image2 from "../../assets/newSection_image_2.png";
import new_section_image3 from "../../assets/newSection_image_3.png";
import new_section_image4 from "../../assets/newSection_image_4.png";

const CardComponent = ({ title, description, buttonText, imageUrl }) => (
  <Card
    sx={{
      borderRadius: "15px",
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      height: "100%",
    }}
  >
    <CardMedia
      component="img"
      image={imageUrl}
      alt={title}
      sx={{ height: 150 }}
    />
    <CardContent>
      <Typography
        variant="h6"
        component="div"
        sx={{ fontWeight: "bold", marginBottom: 1 }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ marginBottom: 2 }}
      >
        {description}
      </Typography>
      <Button variant="text" sx={{ color: "#0071e3" }}>
        {buttonText} &rarr;
      </Button>
    </CardContent>
  </Card>
);

export const NewsSection = ({ cardData }) => (
  <Box
    sx={{
      width: "100%",
      marginTop: 7,
      marginLeft: 2,
      maxWidth: 1500,
      height: 500,
    }}
  >
    <Typography
      variant="h5"
      sx={{
        fontSize: "26px",
        fontWeight: "bold",
        color: "#555555",
        marginBottom: 4,
      }}
    >
      [담ː따] 의 기획전을 확인하세요
    </Typography>
    <Box sx={{ display: "flex", alignItems: "center", marginLeft: 5 }}>
      <Grid container spacing={6} sx={{ flexGrow: 1 }}>
        {cardData.map((card, index) => (
          <Grid item xs={10} sm={5} md={3} key={index}>
            <CardComponent {...card} />
          </Grid>
        ))}
      </Grid>
    </Box>
  </Box>
);
