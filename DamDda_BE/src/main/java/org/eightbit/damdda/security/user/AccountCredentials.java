package org.eightbit.damdda.security.user;

import lombok.Data;

@Data
public class AccountCredentials {
    private String loginId;
    private String password;
}
