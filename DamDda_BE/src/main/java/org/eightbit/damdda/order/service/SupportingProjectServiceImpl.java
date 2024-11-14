package org.eightbit.damdda.order.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.eightbit.damdda.order.repository.SupportingProjectRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class SupportingProjectServiceImpl implements SupportingProjectService {

    private final SupportingProjectRepository supportingProjectRepository;

    // 일별 후원액 가져오는 쿼리
    @Override
    public List<?> getDailySupportingByProjectId(Long projectId) {
        return supportingProjectRepository.getDailySupportingByProjectId(projectId);
    }

}
