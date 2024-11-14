import React, { useState } from 'react';
import Box from '@mui/joy/Box';
// import { StatusButton } from './StatusButton';
import Typography from '@mui/joy/Typography';
import axios from 'axios';
import { South } from '@mui/icons-material';
import Cookies from 'js-cookie';
import { SERVER_URL } from 'constants/URLs';

export const PaymentDeliveryInfo = ({ project }) => {
    const [paymentStatus, setPaymentStatus] = useState(project.payment.paymentStatus); // 결제 상태 상태 추가

    // 결제 취소 로직
    // const handleCancelPayment = async () => {
    //     const supportingProject = project.supportingProject; // supportingProject 객체를 가져옴
    //     alert('supportingProject ID: ' + supportingProject.payment.paymentId); // 객체의 ID를 확인하기 위한 알림

    //     const updatedPaymentStatus = {
    //         supportingProject: supportingProject, // 해당 supportingProject 객체 전달
    //         paymentStatus: '결제 취소', // '결제 취소' 상태 설정
    //     };

    //     try {
    //         const response = await axios.put(
    //             `${SERVER_URL}/order/${supportingProject.payment.paymentId}/cancel`,
    //             updatedPaymentStatus
    //         ); // 객체를 JSON 바디로 전달
    //         if (response.status === 200) {
    //             // 성공적으로 결제가 취소됨
    //             alert('결제가 취소되었습니다.');
    //             // 필요한 경우 UI를 업데이트하거나 상태를 새로 고침하는 로직 추가
    //         }
    //     } catch (error) {
    //         console.error('결제 취소 중 오류 발생:', error);
    //         alert('결제 취소에 실패했습니다.');
    //     }
    // };

    return '나죽네';
    // <Box sx={{ padding: '20px' }}>
    //     {/* 배송 정보 */}
    //     <Box sx={{ marginBottom: '20px' }}>
    //         <Typography
    //             variant="h6"
    //             sx={{
    //                 marginBottom: '10px',
    //                 fontWeight: 'bold',
    //                 color: 'black',
    //                 fontSize: '20px',
    //             }}
    //         >
    //             배송 정보
    //         </Typography>
    //         <Box sx={{ display: 'flex', marginBottom: '5px' }}>
    //             <Typography sx={{ fontWeight: 'bold', color: 'gray', minWidth: '80px' }}>수령인:</Typography>
    //             <Typography sx={{ marginLeft: '50px' }}>{project.supportingProject.user.name}</Typography>
    //         </Box>
    //         <Box sx={{ display: 'flex', marginBottom: '5px' }}>
    //             <Typography sx={{ fontWeight: 'bold', color: 'gray', minWidth: '80px' }}>휴대폰:</Typography>
    //             <Typography sx={{ marginLeft: '50px' }}>{project.supportingProject.user.phoneNumber}</Typography>
    //         </Box>
    //         <Box sx={{ display: 'flex', marginBottom: '5px' }}>
    //             <Typography sx={{ fontWeight: 'bold', color: 'gray', minWidth: '80px' }}>주소:</Typography>
    //             <Typography sx={{ marginLeft: '50px' }}>
    //                 {project.supportingProject.delivery.deliveryAddress}({' '}
    //                 {project.supportingProject.delivery.deliveryDetailedAddress} )
    //             </Typography>
    //         </Box>
    //         <Box sx={{ display: 'flex', marginBottom: '5px' }}>
    //             <Typography sx={{ fontWeight: 'bold', color: 'gray', minWidth: '80px' }}>
    //                 배송 요청 사항:
    //             </Typography>
    //             <Typography sx={{ marginLeft: '20px' }}>
    //                 {project.supportingProject.delivery.deliveryMessage}
    //             </Typography>
    //         </Box>
    //     </Box>

    //     {/* 구분선 */}
    //     <Box
    //         sx={{
    //             borderBottom: '1px solid #e0e0e0',
    //             marginBottom: '20px',
    //             width: '1000px',
    //         }}
    //     />

    //     {/* 결제 정보 */}
    //     <Box sx={{ marginBottom: '20px' }}>
    //         <Typography
    //             variant="h6"
    //             sx={{
    //                 marginBottom: '10px',
    //                 fontWeight: 'bold',
    //                 color: 'black',
    //                 fontSize: '20px',
    //             }}
    //         >
    //             결제 내역
    //         </Typography>
    //         <Box sx={{ display: 'flex', marginBottom: '5px' }}>
    //             <Typography sx={{ fontWeight: 'bold', color: 'gray', minWidth: '80px' }}>결제 방법:</Typography>
    //             <Typography sx={{ marginLeft: '50px' }}>
    //                 {project.supportingProject.payment.paymentMethod}
    //             </Typography>
    //         </Box>
    //         <Box sx={{ display: 'flex', marginBottom: '5px' }}>
    //             <Typography sx={{ fontWeight: 'bold', color: 'gray', minWidth: '80px' }}>총 상품 금액:</Typography>
    //             <Typography sx={{ marginLeft: '38px' }}>{project.supportingPackage.packagePrice}</Typography>
    //         </Box>
    //         <Box sx={{ display: 'flex', marginBottom: '5px' }}>
    //             <Typography sx={{ fontWeight: 'bold', color: 'gray', minWidth: '80px' }}>결제 상태:</Typography>
    //             <Typography sx={{ marginLeft: '50px' }}>
    //                 {paymentStatus} {/* 상태를 직접 보여줌 */}
    //             </Typography>
    //         </Box>
    //     </Box>

    //     {/* 결제 취소 버튼 */}
    //     <Box
    //         sx={{
    //             textAlign: 'right',
    //             position: 'relative',
    //             top: '-60px',
    //             left: '-180px',
    //         }}
    //     >
    //         <StatusButton
    //             status="결제 취소"
    //             label="결제 취소"
    //             onClick={() => handleCancelPayment()}
    //             // onClick={() => handleCancelPayment(3)} // orderId 전달

    //             sx={{
    //                 backgroundColor: 'white', // 아주 연한 회색 배경색
    //                 color: 'red',
    //                 fontSize: '12px', // 폰트 크기 줄이기
    //                 width: '90px', // 버튼 너비 줄이기
    //                 height: '30px', // 버튼 높이 줄이기
    //             }}
    //         />
    //     </Box>
    // </Box>
};
