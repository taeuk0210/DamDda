import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { SERVER_URL } from 'constants/URLs';

export function MyOrders() {
    const { userId } = useParams(); // URL 경로에서 userId를 추출
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (userId) {
            // API를 통해 사용자 주문 목록을 가져옵니다.
            // axios.get(`${SERVER_URL}/order/myOrders/${userId}`, {
            axios
                .get(`${SERVER_URL}/order/myOrders`, {
                    headers: {
                        // Authorization: `Bearer ${localStorage.getItem("token")}`  // JWT 토큰을 헤더에 추가
                        ...(Cookies.get('accessToken') && {
                            Authorization: `Bearer ${Cookies.get('accessToken')}`,
                        }),
                    },
                })
                .then((response) => {
                    setOrders(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching orders:', error);
                });
        }
    }, [userId]);

    //JWT 사용
    // useEffect(() => {
    //   const token = localStorage.getItem('token'); // JWT 토큰을 로컬스토리지에서 가져옴

    //   axios.get('/api/orders/user/me', {
    //     headers: {
    //       Authorization: `Bearer ${token}`  // 토큰을 Authorization 헤더에 포함시켜 요청
    //     }
    //   })
    //   .then(response => {
    //     setOrders(response.data);
    //   })
    //   .catch(error => {
    //     console.error("Error fetching orders:", error);
    //   });
    // }, []);

    return (
        <div>
            <h2>내 주문 목록</h2>
            {orders.length === 0 ?
                <p>주문이 없습니다.</p>
            :   <ul>
                    {orders.map((order, index) => (
                        <li key={index}>
                            <h3>주문 번호: {order.supportingProject.supportNumber}</h3>
                            <p>
                                <strong>프로젝트 제목:</strong> {order.supportingProject.title}
                            </p>
                            <p>
                                <strong>선물 구성:</strong> {order.supportingPackage.packageName}
                            </p>
                            <p>
                                <strong>후원 금액:</strong> {order.supportingPackage.packagePrice}
                            </p>
                            <p>
                                <strong>수량:</strong> {order.packageCount}
                            </p>
                            <p>
                                <strong>결제 방법:</strong> {order.payment.paymentMethod}
                            </p>
                            <p>
                                <strong>결제 상태:</strong> {order.payment.paymentStatus}
                            </p>
                            <p>
                                <strong>배송 요청 사항:</strong> {order.delivery.deliveryMessage}
                            </p>
                        </li>
                    ))}
                </ul>
            }
        </div>
    );
}
