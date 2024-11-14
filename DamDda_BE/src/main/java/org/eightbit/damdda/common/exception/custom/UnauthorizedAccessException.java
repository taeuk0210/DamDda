package org.eightbit.damdda.common.exception.custom;

// 허가되지 않은 접근을 시도할 때 발생하는 커스텀 예외.
public class UnauthorizedAccessException extends RuntimeException {

    // 예외 메시지를 받는 생성자.
    public UnauthorizedAccessException(String message) {
        super(message); // 상위 클래스인 RuntimeException에 메시지를 전달.
    }
}