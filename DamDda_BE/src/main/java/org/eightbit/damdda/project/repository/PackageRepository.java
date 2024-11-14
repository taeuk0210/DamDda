package org.eightbit.damdda.project.repository;


import org.eightbit.damdda.project.domain.ProjectPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PackageRepository extends JpaRepository<ProjectPackage, Long> {
    @Modifying
    @Query("UPDATE ProjectPackage pp SET pp.salesQuantity=pp.salesQuantity+:salesQuantity, pp.quantityLimited = pp.quantityLimited-:salesQuantity WHERE pp.id=:packageId")
    void updateQuantities(@Param("salesQuantity") Integer salesQuantity, @Param("packageId") Long packageId);
}
