import React from 'react';
import { Box, Typography, Grid, Card } from '@mui/material';
import styles from '../css/ShortcutBoxComponent.module.css'; // CSS 모듈 가져오기
import Image1 from '../../assets/Food-basket-with-groceries.png'; // 임의 이미지 경로
import Image2 from '../../assets/Food-basket-with-groceries.png'; // 임의 이미지 경로
import Image3 from '../../assets/Food-basket-with-groceries.png'; // 임의 이미지 경로

export const ShortcutBoxComponent = () => {
    const services = [
        {
            title: '01 협업하기',
            description: '진행자와 함께 협업하고 성공적인 프로젝트를 만들어보세요.',
            icon: '💻',
            route: 'mypage',
            bgColor: '#eef0fc',
        },
        {
            title: '02 프로젝트 등록하기',
            description: '새로운 프로젝트를 등록하고 펀딩을 시작하세요.',
            icon: <img src={Image2} alt="Icon 2" className={styles.icon} />,
            route: 'register',
            bgColor: '#f7efd4',
        },
        {
            title: '03 인기 프로젝트 가기',
            description: '가장 인기 있는 프로젝트에 참여하고 후원하세요.',
            icon: <img src={Image3} alt="Icon 3" className={styles.icon} />,
            route: 'entire',
            bgColor: '#dde5fe',
        },
    ];

    return (
        <Box className={styles.container}>
            <Typography variant="h4" className={styles.header}>
                [담ː따] 와 함께 성공적인 펀딩 프로젝트를 진행시키세요
            </Typography>
            <Grid container className={styles.gridContainer}>
                {services.map((service, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <Card className={styles.card} style={{ backgroundColor: service.bgColor }}>
                            <Typography variant="h6" className={styles.title}>
                                {service.title}
                            </Typography>
                            <Typography className={styles.description}>{service.description}</Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
