package org.eightbit.damdda.common.utils.validation;

import lombok.RequiredArgsConstructor;
import org.eightbit.damdda.common.exception.custom.UnauthorizedAccessException;
import org.eightbit.damdda.security.util.SecurityContextUtil;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MemberValidator {

    private final SecurityContextUtil securityContextUtil;

    /**
     * 주어진 회원 ID가 현재 로그인된 사용자와 일치하는지 검증합니다.
     * 일치하지 않으면 UnauthorizedAccessException 예외를 발생시킵니다.
     *
     * @param memberId 검증할 회원 ID
     * @throws UnauthorizedAccessException 인증된 사용자와 주어진 회원 ID가 일치하지 않는 경우
     */
    public void validateMemberIdForLoginUser(Long memberId) {
        Long authenticatedMemberId = securityContextUtil.getAuthenticatedMemberId();
        if (!authenticatedMemberId.equals(memberId)) {
            throw new UnauthorizedAccessException(
                    "The authenticated user does not match the provided member ID: " + memberId
            );
        }
    }
}
