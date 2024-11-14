package org.eightbit.damdda.security.util;

import org.eightbit.damdda.common.exception.custom.UnauthorizedAccessException;
import org.eightbit.damdda.security.user.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityContextUtil {

    /**
     * SecurityContext에서 인증된 사용자 ID를 반환하는 메서드.
     * 현재 요청의 인증 정보를 SecurityContextHolder에서 가져와
     * 사용자 ID를 추출합니다. 인증되지 않은 사용자인 경우 예외를 던짐.
     *
     * @return 인증된 사용자의 ID (Long).
     * @throws UnauthorizedAccessException 인증되지 않은 경우 예외 발생.
     */
    public Long getAuthenticatedMemberId() {
        // 현재 요청의 SecurityContext에서 인증 정보 가져오기.
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 인증 정보가 있고, 해당 사용자가 User 타입인 경우 ID를 반환.
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            return ((User) authentication.getPrincipal()).getMemberId();
        }

        // 인증되지 않은 사용자인 경우 예외를 던짐.
        String user = (authentication != null) ? authentication.getName() : "Anonymous";
        throw new UnauthorizedAccessException(String.format("Unauthenticated access attempt by user: %s", user));
    }
}
