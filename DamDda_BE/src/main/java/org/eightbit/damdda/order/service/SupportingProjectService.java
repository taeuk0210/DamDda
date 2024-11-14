package org.eightbit.damdda.order.service;

import java.util.List;

public interface SupportingProjectService {

    // 일별 후원액 가져오는 쿼리
    List<?> getDailySupportingByProjectId(Long projectId);
}
