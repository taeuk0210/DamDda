package org.eightbit.damdda.admin.domain;

import lombok.*;
import org.eightbit.damdda.common.domain.BaseEntity;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "carousel_images")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CarouselImage extends BaseEntity {
    private String adminImageUrl;
}

