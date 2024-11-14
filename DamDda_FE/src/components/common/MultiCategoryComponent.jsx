import React from "react";
import { useNavigate } from "react-router-dom";
import { CategoryComponent } from "./CategoryComponent";
import styles from "../css/MultiCategoryComponent.module.css";

export const MultiCategoryComponent = ({ setCategory }) => {
  const navigate = useNavigate();

  // 카테고리 목록
  const categoryList = [
    {
      value: "전체",
      text: "dAbstract",
      imgUrl: require("assets/d-abstract-holographic-form.png"),
    },
    {
      value: "뷰티",
      text: "cosmeticComposition",
      imgUrl: require("assets/cosmetic-composition.png"),
    },
    {
      value: "K-POP",
      text: "pinkHeadphones",
      imgUrl: require("assets/pink-headphones-floating.png"),
    },
    {
      value: "K-콘텐츠",
      text: "movieCamera",
      imgUrl: require("assets/movie-video-camera.png"),
    },
    {
      value: "음식",
      text: "foodBasket",
      imgUrl: require("assets/Food-basket-with-groceries.png"),
    },
    {
      value: "패션",
      text: "tShirtMockup",
      imgUrl: require("assets/t-shirt-mockup.png"),
    },
    {
      value: "게임",
      text: "gameController",
      imgUrl: require("assets/game-controller.png"),
    },
    {
      value: "문화재",
      text: "traditional",
      imgUrl: require("assets/traditional.png"),
    },
  ];

  return (
    <div className={styles["category-wrapper"]}>
      {categoryList.map((category, index) => (
        <CategoryComponent
          key={index}
          text={category.value}
          onClick={() => setCategory(category.value)}
          imgUrl={category.imgUrl}
        />
      ))}
    </div>
  );
};
