import React, { useState } from 'react'; // React
import { DeleteButtonX, DeleteButtonTrash, NumericInput } from './DeleteButtons'; // 경로에 맞게 수정
// import { ProductCard } from 'components/common/ProjectCard'; // ProductCard 경로에 맞게 수정
// import { ProjectRowComponent } from 'components/common/ProjectRowComponent';
import { OptionOrder } from 'components/common/Gift/OptionOrder';
import { GiftOrder } from 'components/common/Gift/GiftOrder';
import { GiftCompositionComponent } from  'components/common/Gift/GiftCompositionComponent';
import { ProjectRowComponent } from 'components/common/ProjectRowComponent'

export const GiftPage = () => {
    const handleDeleteX = () => {
        alert("X 버튼 클릭");
    };

    const handleDeleteTrash = () => {
        alert("휴지통 버튼 클릭");
    };


    const [products, setProducts] = useState([
        {
            id: 1,
            title: '프로젝트 A',
            description: '프로젝트 A에 대한 설명입니다.',
            targetFunding: 1000000,
            fundsReceive: 500000,
            endDate: '2024-12-31T23:59:59Z',
            thumbnailUrl: 'path/to/image.jpg', // 실제 이미지 경로
            liked: false,
            nickName: '작성자1',
        },
        {
            id: 2,
            title: '프로젝트 B',
            description: '프로젝트 B에 대한 설명입니다.',
            targetFunding: 1500000,
            fundsReceive: 800000,
            endDate: '2024-11-30T23:59:59Z',
            thumbnailUrl: 'path/to/image.jpg', // 실제 이미지 경로
            liked: false,
            nickName: '작성자2',
        },
        // 다른 제품 정보 추가 가능
    ]);


    const handleLike = (product) => {
        setProducts(prevProducts =>
            prevProducts.map(p =>
                p.id === product.id ? { ...p, liked: !p.liked } : p
            )
        );
    };

    const [ num, setNum ] = useState(0);
    // 상태를 여기서 관리
    const [options, setOptions] = useState([
        { id: 1, option: '옵션 A', num: 1 },
        { id: 2, option: '옵션 B', num: 2 },
    ]);



      //GiftCompositionComponent
  const rewardData = [
    {
      amount: 1000,
      title: "선물 없이 후원하기",
      description: "감사합니다!",
      selectedCount: 0,
      remainingCount: 50,
    },
    {
      amount: 50000,
      title: "[얼리버드] 스페셜 티셔츠",
      description: "한정판 티셔츠",
      selectedCount: 10,
      remainingCount: 5,
    },
    {
      amount: 100000,
      title: "프리미엄 후원 패키지",
      description: "티셔츠 + 머그컵 + 사인 포스터",
      selectedCount: 3,
      remainingCount: 2,
    },
  ];
    


    return (
        <div>
            {/* <DeleteButtonX onClick={handleDeleteX} />
            <DeleteButtonTrash onClick={handleDeleteTrash} /> */}
            {/* <NumericInput initialValue={0} min={0} max={1000000} /> */}
            {/* {products.map(product => (
                <ProductCard key={product.id} product={product} handleLike={handleLike} />
            ))}
            <ProjectRowComponent
                sortCondition="popular" // 예: 인기순
                title="추천 프로젝트" // 섹션 제목
                subTitle="여기에서 추천하는 프로젝트를 확인해보세요!" // 섹션 서브 제목
            /> */}
            {/* <OptionOrder text="옵션 A" num={num} setNum={setNum}></OptionOrder> */}

            {/* <GiftOrder 
                title="선물 구성 A세트" 
                price="10000원" 
                options={options} // 옵션 목록 전달
                setOptions = {setOptions}
            /> */}
     <GiftCompositionComponent rewardData={rewardData} />
     {/* <ProjectRowComponent title={"타이틀"} sortCondition={"정렬기준"} subTitle={"서브타이틀"} /> */}

        </div>
    );
};
