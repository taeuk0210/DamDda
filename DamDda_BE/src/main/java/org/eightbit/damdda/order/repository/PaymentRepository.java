package org.eightbit.damdda.order.repository;

import org.eightbit.damdda.order.domain.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // 결제 상태에 따른 조회나 특정 조건의 쿼리 메서드를 정의할 수 있음
}
