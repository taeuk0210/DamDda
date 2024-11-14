package org.eightbit.damdda.project.repository;

import org.eightbit.damdda.project.domain.ProjectRewards;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RewardRepository extends JpaRepository<ProjectRewards, Long> {
}
