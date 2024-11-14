import React, { useState, useEffect } from "react"; // React
import { Typography, Box, Divider } from "@mui/material";
import { PackageCard } from "components/common/Gift/PackageCard";
import { GiftOrder } from "components/common/Gift/GiftOrder";
import { BlueButtonComponent } from "../ButtonComponent";
import { SERVER_URL } from "constants/URLs";
import Cookies from "js-cookie";
import axios from "axios";

export const GiftCompositionComponent = ({
  handleSponsorClick,
  selectedPackages,
  setSelectedPackages,
  projectId,
}) => {
  // 더미 데이터
  const packageData = [
    {
      id: 1,
      name: "패키지 A",
      price: 20000,
      quantityLimited: 5,
      salesQuantity: 10, // 판매 수량 추가
      RewardDTO: [
        {
          id: 1,
          name: "보상 A1",
          count: 2,
          option: ["옵션 1", "옵션 2"],
        },
        {
          id: 2,
          name: "보상 A2",
          count: 1,
          option: ["옵션 A", "옵션 B"],
        },
      ],
    },
    {
      id: 2,
      name: "패키지 B",
      price: 30000,
      quantityLimited: 0, // 품절
      salesQuantity: 5, // 판매 수량 추가
      RewardDTO: [
        {
          id: 1,
          name: "보상 B1",
          count: 3,
          option: ["옵션 X", "옵션 Y"],
        },
        {
          id: 2,
          name: "보상 B2",
          count: 2,
          option: null, // 옵션 없음
        },
      ],
    },
    {
      id: 3,
      name: "패키지 C",
      price: 15000,
      quantityLimited: 10,
      salesQuantity: 7, // 판매 수량 추가
      RewardDTO: [
        {
          id: 1,
          name: "보상 C1",
          count: 1,
          option: ["옵션 A", "옵션 B", "옵션 C"],
        },
      ],
    },
    {
      id: 4,
      name: "패키지 D",
      price: 25000,
      quantityLimited: 2,
      salesQuantity: 3, // 판매 수량 추가
      RewardDTO: [
        {
          id: 1,
          name: "보상 D1",
          count: 1,
          option: ["옵션 1"],
        },
        {
          id: 2,
          name: "보상 D2",
          count: 2,
          option: ["옵션 1", "옵션 2", "옵션 3"],
        },
      ],
    },
    {
      id: 5,
      name: "패키지 E",
      price: 50000,
      quantityLimited: 7,
      salesQuantity: 12, // 판매 수량 추가
      RewardDTO: [
        {
          id: 1,
          name: "보상 E1",
          count: 5,
          option: ["옵션 A", "옵션 B"],
        },
      ],
    },
    {
      id: 6,
      name: "패키지 F",
      price: 45000,
      quantityLimited: 0, // 품절
      salesQuantity: 8, // 판매 수량 추가
      RewardDTO: [
        {
          id: 1,
          name: "보상 F1",
          count: 3,
          option: ["옵션 X", "옵션 Y", "옵션 Z"],
        },
      ],
    },
  ];
  // const [selectPackages, setSelectPackages] = useState([]);

  const [projectPackage, setProjectPackage] = useState([]);
  ////////패키지 데이터 가져오기 시작//////////////////////////////////////
  const fetchPackage = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/package/${projectId}`, {
        withCredentials: true,
      });

      if (!Array.isArray(response.data)) {
        console.error("API response is not an array:", response.data);
        return;
      }
      const formattedPackages = response.data?.map((pac) => ({
        id: pac.id,
        name: pac.name,
        count: pac.count,
        price: pac.price,
        quantityLimited: pac.quantityLimited,
        RewardList: Array.isArray(pac.RewardList) ? pac.RewardList : [],
      }));
      console.log("패키지 데이터: ", formattedPackages); // 패키지 데이터를 콘솔에 출력
      setProjectPackage(formattedPackages);
    } catch (error) {
      console.error(`패키지 목록을 가져오는 중 오류 발생:`, error);
    }
  };

  useEffect(() => {
    fetchPackage();
  }, []);

  ////////패키지 데이터 가져오기 끝//////////////////////////////////////

  const deepEqual = (obj1, obj2) => {
    if (obj1 === obj2) return true; // 같은 참조거나 값이 같으면 true
    if (
      typeof obj1 !== "object" ||
      typeof obj2 !== "object" ||
      obj1 === null ||
      obj2 === null
    ) {
      return false; // 객체가 아닌 경우 false
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false; // 키의 개수가 다르면 false

    // 모든 키와 값을 재귀적으로 비교
    for (let key of keys1) {
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }

    return true;
  };

  // 패키지를 삭제하는 함수
  const removePackageById = (selectName, selectOption) => {
    setSelectedPackages((prevPackages) => {
      const newPackages = prevPackages.filter(
        (pkg) =>
          pkg.packageName !== selectName ||
          !deepEqual(pkg.selectOption, selectOption)
      );
      console.log("Updated packages after deletion:", newPackages); // 상태 확인
      return newPackages;
    });
  };

  // 선택된 패키지의 수량을 변경하는 함수
  const updateSelectedCountById = (selectName, selectOption, setNum) => {
    console.log(
      "selectName, selectOption, setNum",
      selectName,
      selectOption,
      setNum
    );

    setSelectedPackages((prevPackages) => {
      const newPackages = prevPackages?.map((pkg) => {
        if (
          pkg.packageName === selectName &&
          deepEqual(pkg.selectOption, selectOption)
        ) {
          return { ...pkg, selectedCount: setNum };
        }
        return pkg;
      });
      console.log("newPackages:", newPackages); // 상태 변경 후 확인
      return newPackages;
    });
  };

  // 주문 처리 함수

  const handleOrder = (packageId, packageName, packagePrice, selectOption) => {
    const hasNullOption =
      Array.isArray(selectOption) && selectOption.length > 0
        ? selectOption.some((optionItem) => optionItem.selectOption == null)
        : true;

    if (hasNullOption) {
      alert("옵션을 선택해주세요.");
      return;
    }

    console.log("selectOption: ", selectOption);

    setSelectedPackages((prevSelectedPackages) => {
      const existingPackage = prevSelectedPackages.find(
        (selectedPackage) =>
          selectedPackage.packageName === packageName &&
          deepEqual(selectedPackage.selectOption, selectOption)
      );

      if (existingPackage) {
        return prevSelectedPackages?.map((selectedPackage) =>
          selectedPackage.packageName === packageName &&
          deepEqual(selectedPackage.selectOption, selectOption)
            ? {
                ...selectedPackage,
                selectedCount: selectedPackage.selectedCount + 1,
              }
            : selectedPackage
        );
      }

      return [
        ...prevSelectedPackages,
        {
          packageId: packageId,
          packageName: packageName,
          packagePrice: packagePrice,
          selectOption: JSON.parse(JSON.stringify(selectOption)), // 깊은 복사
          selectedCount: 1,
        },
      ];
    });
  };

  // 패키지 선택 수량 계산 함수
  const findSelectCount = (packageName) => {
    let count = 0;
    selectedPackages?.forEach((selectedPackage) => {
      if (selectedPackage.packageName === packageName) {
        count += selectedPackage.selectedCount;
      }
    });
    return count;
  };

  return (
    <div>
      {selectedPackages?.length > 0 &&
        selectedPackages?.map((selectedPackage) => (
          <GiftOrder
            key={selectedPackage.packageName + selectedPackage.selectOption}
            selectedPackage={selectedPackage}
            updateSelectedCountById={updateSelectedCountById}
            removePackageById={removePackageById}
          />
        ))}

      {selectedPackages?.length > 0 && (
        <div style={{ width: "100px", marginLeft: "300px" }}>
          <BlueButtonComponent onClick={handleSponsorClick} text={"후원하기"} />
        </div>
      )}
      {selectedPackages?.length > 0 && (
        <Divider sx={{ my: 3, width: "400px", borderColor: "black" }} />
      )}

      {projectPackage?.map((packageDTO) => (
        <PackageCard
          key={packageDTO.id}
          packageDTO={packageDTO}
          selectedCount={findSelectCount(packageDTO.name)}
          handleOrder={handleOrder}
        />
      ))}
    </div>
  );
};
