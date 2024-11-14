package org.eightbit.damdda.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PageResponseDTO<T> {
    private int page;
    private int size;
    private int totalPages;
    private int totalCounts;
    private List<T> dtoList;
}
