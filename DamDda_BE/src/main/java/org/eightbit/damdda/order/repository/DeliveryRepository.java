package org.eightbit.damdda.order.repository;

import org.eightbit.damdda.order.domain.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    // 배송 관련 데이터를 처리할 수 있는 추가 메서드 정의 가능
}
