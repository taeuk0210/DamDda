import React, { useState, useEffect } from 'react'; // React
import { borderRadius } from '@mui/system';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material'; // MUI 관련 컴포넌트
import { OptionOrder } from 'components/common/Gift/OptionOrder'; // OptionOrder 컴포넌트
import { DeleteButtonX, DeleteButtonTrash, NumericInput } from 'components/common/Gift/DeleteButtons'; // 경로에 맞게 수정

// export const GiftOrder1 = ({ title, price, options, setOptions }) => {
//     const style = {
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "space-between",
//         alignItems: "flex-start",
//         width: "340px",
//         padding: "20px",
//         borderRadius: "5px",
//         border: "solid 1px black",
//         margin: "10px",
//         backgroundColor: "gray"
//     };

//     // 수량 업데이트 함수
//     const setNum = (id, newNum) => {
//         setOptions((prevOptions) =>
//             prevOptions.map(option =>
//                 option.id === id ? { ...option, num: newNum } : option
//             )
//         );
//     };

//     const [open, setOpen] = useState(false); // Dialog 상태 관리
//     const [currentOption, setCurrentOption] = useState(null); // 현재 삭제할 옵션 저장

//     const handleClickOpen = (option) => {
//         setCurrentOption(option);
//         setOpen(true);
//     };

//     const handleClose = () => {
//         setOpen(false);
//     };

//     const handleDelete = () => {
//         if (currentOption) {
//             setOptions((prevOptions) =>
//                 prevOptions.filter(option => option.id !== currentOption.id) // ID에 해당하는 옵션 삭제
//             );
//         }
//         handleClose();
//     };

//     return (
//         <div style={style}>
//             <div style={{ fontSize: "18px", fontWeight: "bold", letterSpacing: "5px" }}>{title}</div>
//             <div style={{ fontSize: "18px", fontWeight: "bold", letterSpacing: "5px" }}>가격 : {price}</div>
//             {options.map((option) => (
//                 <OptionOrder
//                     key={option.id}
//                     option={option.option}
//                     num={option.num}
//                     setNum={(newNum) => setNum(option.id, newNum)} // 수량 업데이트 함수
//                     onDelete={() => handleClickOpen(option)} // 삭제 함수 연결
//                 />
//             ))}

//             {/* Dialog 컴포넌트 */}
//             <Dialog open={open} onClose={handleClose}>
//                 <DialogTitle>삭제 확인</DialogTitle>
//                 <DialogContent>
//                     <div>{currentOption ? currentOption.option + "을 삭제하시겠습니까?" : ""}</div>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleClose} color="primary">취소</Button>
//                     <Button onClick={handleDelete} color="primary">삭제</Button>
//                 </DialogActions>
//             </Dialog>
//         </div>
//     );
// };

export const GiftOrder = ({ selectedPackage, updateSelectedCountById, removePackageById }) => {
    const [open, setOpen] = useState(false); // Dialog 상태 관리

    const handleClickOpen = () => {
        setOpen(true);
        // 상태가 true로 바뀌었는지 확인
    };

    const handleClose = () => {
        setOpen(false);
    };

    // open 상태가 변경될 때마다 콘솔에 로그 출력
    useEffect(() => {}, [open]);

    return (
        <Card
            sx={{
                mb: 2,
                borderRadius: 2,
                borderColor: 'black',
                borderWidth: 1,
                padding: '10px',
                width: '400px',
                backgroundColor: '#fafafa',
            }}
        >
            <CardContent>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={7}>
                        <Typography variant="h7" sx={{ fontWeight: 'bold' }}>
                            [ 장바구니 ]
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {selectedPackage.packageName}
                        </Typography>
                        <Typography variant="h7" sx={{ fontWeight: 'bold' }}>
                            가격: {selectedPackage.packagePrice}원
                        </Typography>
                        {selectedPackage?.selectOption &&
                            selectedPackage.selectOption.length > 0 &&
                            selectedPackage.selectOption.map((option, index) => (
                                <Typography key={index} variant="body2">
                                    {option.rewardName}: {option.selectOption}원
                                </Typography>
                            ))}
                    </Grid>

                    <Grid item xs={4}>
                        <NumericInput
                            value={selectedPackage.selectedCount}
                            min={0}
                            max={9999}
                            setNum={(newNum) =>
                                updateSelectedCountById(
                                    selectedPackage.packageName,
                                    selectedPackage.selectOption,
                                    newNum
                                )
                            }
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <DeleteButtonX onClick={handleClickOpen} />
                    </Grid>
                </Grid>

                {/* Dialog 컴포넌트 */}
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>삭제 확인</DialogTitle>
                    <DialogContent>
                        <Typography>
                            <Box>{selectedPackage.packageName}의 </Box>
                            {selectedPackage.selectOption.map((option, index) => (
                                <span key={index}>
                                    <Box>
                                        {option.rewardName}: {option.selectOption}
                                    </Box>
                                </span>
                            ))}
                            정말로 삭제하시겠습니까?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            취소
                        </Button>
                        <Button
                            onClick={() => removePackageById(selectedPackage.packageName, selectedPackage.selectOption)}
                            color="primary"
                        >
                            삭제
                        </Button>
                    </DialogActions>
                </Dialog>
            </CardContent>
        </Card>
    );
};
