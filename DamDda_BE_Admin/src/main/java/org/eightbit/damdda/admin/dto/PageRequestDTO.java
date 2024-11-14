package org.eightbit.damdda.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PageRequestDTO {
    private int page;
    private int size;
    private Integer approval;
    private String query;
    private String keyword;
}
