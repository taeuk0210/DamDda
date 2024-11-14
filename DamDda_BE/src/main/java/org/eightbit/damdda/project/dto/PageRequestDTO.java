package org.eightbit.damdda.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageRequestDTO {
    @Builder.Default
    private int page = 1;       // 페이지 번호

    @Builder.Default
    private int size = 10;      // 1개 페이지의 개수

    private String type;        // 검색종류 : t, c, w, tc, tw, twc

    private String keyword;     // 검색어

    private String link;

    public String[] getTypes() {
        if (type == null || type.isEmpty())
            return null;

        return type.split("");
    }

    public Pageable getPageable(String... props) {
        if (props == null || props.length == 0) {
            return PageRequest.of(this.page - 1, this.size);  // 기본 정렬 없음
        }
        return PageRequest.of(this.page - 1, this.size, Sort.by(props).descending());
    }

}