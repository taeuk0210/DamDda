import React, { useState, useEffect } from 'react';
import {
    TableContainer,
    Paper,
    Button,
    Select,
    MenuItem,
    Box,
    FormControl,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Typography,
} from '@mui/material';
import StatusButton from './StatusButton';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { useUser } from 'UserContext';
import Cookies from 'js-cookie';
import { SERVER_URL } from 'constants/URLs';

export const CollaborationList = ({ setClickCollb, filter, setFilter }) => {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [collaborations, setCollaborations] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const { user } = useUser();
    const [checkReset, setCheckReset] = useState(0);
    // const [selectionModel, setSelectionModel] = useState([]);

    const [selectedRows, setSelectedRows] = useState([]); // 선택된 행의 ID를 저장

    const [open, setOpen] = useState(false); // 모달 상태 관리
    const [currentAction, setCurrentAction] = useState(''); // 현재 실행할 액션 (승인 or 거절)

    useEffect(() => {
        if (filter === '제안 받은 협업') {
            handleReadProject('receive');
        } else if (filter === '제안 한 협업') {
            handleReadProject('request');
        }
    }, [size, page, filter]);

    const handleReadProject = async (path) => {
        try {
            const response = await axios.get(`${SERVER_URL}/collab/read/${path}`, {
                params: {
                    page,
                    size,
                    // userId: user.id
                },
                withCredentials: true,
                headers: {
                    ...(Cookies.get('accessToken') && {
                        Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    }),
                },
            });

            const { dtoList, total, page: responsePage } = response.data;

            setCollaborations(dtoList);
            setTotalElements(total);
            setTotalPages(Math.ceil(total / size));
            // setSelectionModel([]);
            setSelectedRows([]);
            setCheckReset((checkReset + 1) % 50);
            //setPage(responsePage + 1);
        } catch (error) {
            // 404 오류 처리
            if (error.response) {
                console.error('API 요청 실패:', error.response.data);
                if (error.response.status === 404) {
                    setCollaborations([]); // 빈 목록으로 설정
                } else {
                    alert('데이터를 가져오는 중 오류가 발생했습니다.');
                }
            } else {
                console.error('서버에 연결할 수 없습니다:', error.message);
                alert('서버에 연결할 수 없습니다.');
            }
        }
    };

    // 모달 열기
    const handleClickOpen = (action) => {
        setCurrentAction(action); // 현재 실행할 액션 저장 (승인 or 거절)
        setOpen(true);
    };

    // 모달 닫기
    const handleClose = () => {
        setOpen(false);
    };

    const handleAction = (currentAction) => {
        if (currentAction === '승인' || currentAction === '거절') {
            handleApproval(currentAction);
        } else if (currentAction === '삭제') {
            handleDelete(currentAction);
        }
        handleClose();
    };

    // const handleDelete = async () => {
    //
    //     await axios.delete(`${SERVER_URL}/collab/delete`, {
    //             headers: {
    //             ...(Cookies.get('accessToken') && {
    //                 Authorization: `Bearer ${Cookies.get('accessToken')}`,
    //             }),
    //         },

    //         data: selectedRows, // 바로 배열을 전송
    //     });
    //     alert('선택된 협업이 삭제되었습니다.');
    //     /*if처리하면 좋을 듯 */
    //     if (filter === '제안 받은 협업') {
    //         handleReadProject('receive');
    //     } else if (filter === '제안 한 협업') {
    //         handleReadProject('request');
    //     }
    // };

    const handleDelete = async () => {
        try {
            // 서버로 보내는 데이터 확인

            // axios.delete로 데이터 전송
            const response = await axios.delete(`${SERVER_URL}/collab/delete`, {
                headers: {
                    ...(Cookies.get('accessToken') && {
                        Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    }),
                },
                data: selectedRows, // 배열 데이터를 서버로 전송
            });

            alert('선택된 협업이 삭제되었습니다.');

            // 성공 시 추가 동작 처리
            if (filter === '제안 받은 협업') {
                handleReadProject('receive');
            } else if (filter === '제안 한 협업') {
                handleReadProject('request');
            }
        } catch (error) {
            console.error('삭제 중 오류 발생:', error);
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

    /*협업받은 제안자일 때만 approval, reject 가능하도록 설정 */
    const handleApproval = async (status) => {
        let approvalPath;
        if (status === '승인') {
            approvalPath = `${SERVER_URL}/collab/approval`;
        } else if (status === '거절') {
            approvalPath = `${SERVER_URL}/collab/reject`;
        }
        try {
            await axios.put(approvalPath, selectedRows, {
                headers: {
                    ...(Cookies.get('accessToken') && {
                        Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    }),
                },
                withCredentials: true,
            });
            alert(`선택된 협업들이 ${status}되었습니다.`);

            // collaborations 데이터를 업데이트 (리액트 상태 관리)
            setCollaborations((prevCollaborations) => {
                return prevCollaborations.map((clb) => {
                    // selectedRows 안에 있는 id와 일치하는 항목만 approval 값을 변경
                    if (selectedRows.includes(clb.id)) {
                        return {
                            ...clb, // 기존 데이터는 그대로 유지하고
                            approval: status, // approval 값만 업데이트
                        };
                    }
                    return clb; // 나머지는 그대로 반환
                });
            });

            //setApproval(status); // '승인' 또는 '거절' 상태로 설정
            //   handleReadReceive() // 목록 새로고침
            //   setSelectedCollabs([]) // 선택 초기화
            // 새로고침 트리거
        } catch (error) {
            console.error(`${status} 처리 중 에러 발생:`, error);
            alert(`${status} 처리에 실패했습니다.`);
        }
    };

    // 주현코드 필요한거
    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        // 여기에 선택한 필터에 따라 프로젝트를 필터링하는 로직을 추가할 수 있습니다.
    };

    // 컬럼 정의
    const columns = [
        // { field: 'id', headerName: 'ID', width: 50, cellClassName: 'centered-cell' },
        {
            field: 'status',
            headerName: '상태',
            width: 70,
            renderCell: (params) => (
                <StatusButton
                    status={params.row.approval}
                    label={params.row.approval}
                    sx={{
                        //   backgroundColor: params.row.approval === "거절" ? "red" : "#4caf50",
                        backgroundColor:
                            params.row.approval === '승인' ? '#C8E6C9'
                            : params.row.approval === '거절' ? '#FFCDD2'
                            : '#E0E0E0', // 파스텔 톤 배경색
                        color:
                            params.row.approval === '승인' ? '#2E7D32'
                            : params.row.approval === '거절' ? '#D32F2F'
                            : '#000000', // 글씨 색
                        border:
                            params.row.approval === '승인' ? '2px solid #C8E6C9'
                            : params.row.approval === '거절' ? '2px solid #FFCDD2'
                            : '2px solid #E0E0E0', // 테두리 배경색과 동일
                        borderRadius: '50px',
                        width: '50px',
                        padding: '2px 10px', // 버튼 내부 패딩 줄임
                        fontSize: '12px', // 텍스트 크기 줄임
                        minWidth: '50px', // 버튼의 최소 너비를 줄임
                        height: '30px', // 버튼 높이를 줄임
                    }}
                />
            ),
        },
        { field: 'title', headerName: '프로젝트 제목', width: 400 },
        // { field: 'proposer', headerName: '제안자', width: 100 },
        ...(filter === '제안 받은 협업' ? [{ field: 'name', headerName: '제안자', width: 100 }] : []),
        { field: 'CollaborateDate', headerName: '제안 날짜', width: 200 },
    ];

    // 체크박스로 선택된 행의 ID를 업데이트
    // const handleSelectionChange = (ids) => {
    //   setSelectedRows(ids); // 선택된 행의 ID들을 업데이트
    //
    // };

    const handleRowClick = (id) => {
        setClickCollb(id);
    };

    return (
        <>
            <TableContainer
                sx={{
                    margin: '100px auto',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyItems: 'justify-content',
                    alignItems: 'center',
                }}
                component={Paper}
            >
                <Box display="flex" width="100%" justifyContent="flex-end" p={2}>
                    <FormControl variant="outlined">
                        <InputLabel>협업 선택</InputLabel>
                        <Select value={filter} onChange={handleFilterChange} label="협업 선택">
                            <MenuItem value="제안 받은 협업">제안 받은 협업</MenuItem>
                            <MenuItem value="제안 한 협업">제안 한 협업</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Typography variant="h6" style={{ fontWeight: 'bold', color: '#000000' }}>
                    {filter}
                </Typography>

                <Paper sx={{ height: 400, width: '90%' }}>
                    <DataGrid
                        key={checkReset} // 상태에 따라 리렌더링 강제
                        rows={collaborations}
                        columns={columns}
                        // initialState={{ pagination: { paginationModel } }}
                        // pageSizeOptions={[5, 10]}
                        checkboxSelection
                        disableColumnMenu // 컬럼 메뉴 비활성화
                        selectionModel={selectedRows}
                        onRowSelectionModelChange={(newSelection) => {
                            setSelectedRows(newSelection);
                        }}
                        onRowClick={(params) => handleRowClick(params.id)} // 행 클릭 시 상세 페이지 이동
                        sx={{ border: 0 }}
                    />
                    {collaborations &&
                        collaborations.length === 0 && ( /////-------------------------------------> 이거 추가됨
                            <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 2 }}>
                                협업 제안이 없습니다.
                            </Typography>
                        )}
                </Paper>

                <Box marginTop="20px" display="flex" width="100%" justifyContent="space-between" p={2}>
                    {/* 좌측에 삭제 버튼 */}
                    <Button
                        sx={{ margin: '10px' }}
                        variant="outlined"
                        color="error"
                        onClick={(event) => handleClickOpen('삭제')}
                    >
                        삭제
                    </Button>

                    {/* 우측에 승인, 거절 버튼 */}
                    {filter === '제안 받은 협업' && (
                        <Box display="flex">
                            <Button sx={{ margin: '10px' }} variant="contained" onClick={() => handleClickOpen('승인')}>
                                승인
                            </Button>
                            <Button sx={{ margin: '10px' }} variant="outlined" onClick={() => handleClickOpen('거절')}>
                                거절
                            </Button>
                        </Box>
                    )}
                </Box>
            </TableContainer>

            {/* 모달 (Dialog) */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>정말로 {currentAction}하시겠습니까?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        확인을 누르면 {currentAction}됩니다. 정말로 {currentAction} 하시겠습니까?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        취소
                    </Button>
                    <Button onClick={() => handleAction(currentAction)} color="primary">
                        확인
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
