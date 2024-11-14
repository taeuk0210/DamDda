package org.eightbit.damdda.admin.dto;

import lombok.Data;

@Data
public class RefreshDTO {
    private String username;
    private String refreshToken;
}
