package org.eightbit.damdda.admin.domain;

import lombok.*;

import javax.persistence.*;

/**
 * 캐러셀 이미지(CarouselImage) 엔티티. 'carousel_images' 테이블과 매핑됨.
 */
@Entity
@Table(name = "carousel_images")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CarouselImage {

    /**
     * 캐러셀 이미지 고유 식별자 (ID)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 이미지 파일의 URL 경로
     */
    private String adminImageUrl;
}