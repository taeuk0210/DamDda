package org.eightbit.damdda.admin.repository;

import org.eightbit.damdda.admin.domain.CarouselImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CarouselImageRepository extends JpaRepository<CarouselImage, Long> {
    Optional<CarouselImage> findByAdminImageUrlContaining(String fileName);

}
