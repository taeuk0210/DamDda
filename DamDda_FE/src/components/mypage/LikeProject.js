import React, { useEffect, useState } from 'react';
import { ProductCard } from 'components/common/ProjectCard';
import { Box, Typography } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import { useUser } from 'UserContext';
import Cookies from 'js-cookie';
import { SERVER_URL } from 'constants/URLs';

// Likeproject 컴포넌트
export const Likeproject = () => {
    const itemsPerPage = 10; // 한 페이지에 10개의 항목을 표시
    const [page, setPage] = useState(1); // 현재 페이지 상태
    const [total, setTotal] = useState(0); // 전체 프로젝트 개수
    const [projects, setProjects] = useState([]);
    const { user } = useUser();

    // 페이지 변경 핸들러
    const handlePageChange = (event, value) => {
        setPage(value);
    };

    // 좋아요 요청을 처리하는 함수2
    const handleLike = async (project) => {
        // liked가 true이면 DELETE 요청
        const response = await axios({
            method: project.liked ? 'DELETE' : 'POST',
            url: `${SERVER_URL}/project/like`,
            params: {
                // memberId: user.key, // ==========================>> user.key 로 수정해야해요
                projectId: project.id,
            },
            headers: {
                ...(Cookies.get('accessToken') && {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                }),
            },
        })
            .then((response) => response.status)
            .catch((e) => console.error(e));
        if (response == 200) {
        }
        setProjects(
            projects.map((_project) => {
                if (_project.id === project.id) {
                    _project.liked = !project.liked;
                }
                return _project;
            })
        );
    };

    const fetchProjects = async () => {
        axios({
            method: 'GET',
            url: `${SERVER_URL}/project/like`,
            params: {
                page: page,
                size: itemsPerPage,
            },
            headers: {
                ...(Cookies.get('accessToken') && {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                }),
            },
        })
            .then((response) => {
                setProjects(response.data.dtoList || []);
                setTotal(response.data.total);
            })
            .catch((e) => console.error(e));
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [page]);

    return (
        <Box
            sx={{
                margin: '0 auto',
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                maxWidth: '100%',
            }}
        >
            <Box
                container
                justifyContent="flex-start"
                alignItems="center"
                display="flex"
                // spacing={1}
                sx={{ flexGrow: 1 }}
                // columns={{ xs: 3, md: 6, lg: 12 }}
            >
                {projects.length > 0 ?
                    projects.map((product) => (
                        <Box
                            item
                            key={product.id}
                            size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}
                            // xs={12}
                            // sm={6}
                            // md={2.4}
                            justifyContent="center"
                        >
                            <ProductCard product={product} handleLike={handleLike} />
                        </Box>
                    ))
                :   <Typography variant="h6">관심 프로젝트가 없습니다.</Typography>}
            </Box>

            {/* Pagination 컴포넌트 추가 */}
            <Stack spacing={2} sx={{ marginTop: '20px' }}>
                <Pagination
                    count={Math.ceil(total / itemsPerPage)} // 페이지 수 계산
                    page={page} // 현재 페이지
                    onChange={handlePageChange} // 페이지 변경 핸들러
                    showFirstButton
                    showLastButton
                />
            </Stack>
        </Box>
    );
};
