package org.eightbit.damdda.project.repository;

import org.eightbit.damdda.project.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
