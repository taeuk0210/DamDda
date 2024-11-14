package org.eightbit.damdda.common.exception.handler;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eightbit.damdda.common.exception.custom.UnauthorizedAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LogManager.getLogger(GlobalExceptionHandler.class);

    private ResponseEntity<Object> buildResponseEntity(HttpStatus status, String message, Map<String, Object> details) {
        Map<String, Object> responseBody = new HashMap<>(details);
        responseBody.put("timestamp", LocalDateTime.now());
        responseBody.put("status", status.value());
        responseBody.put("error", status.getReasonPhrase());
        responseBody.put("message", message);
        return ResponseEntity.status(status).body(responseBody);
    }

    private Map<String, Object> buildErrorDetails(Exception ex, WebRequest request, HttpServletRequest httpServletRequest) {
        Map<String, Object> details = new HashMap<>();
        details.put("path", httpServletRequest.getRequestURI());
        details.put("httpMethod", httpServletRequest.getMethod());
        details.put("clientIp", httpServletRequest.getRemoteAddr());
        details.put("exception", ex.getClass().getName());
        details.put("timestamp", LocalDateTime.now());

        // Extract the location of the exception from the stack trace
        StackTraceElement[] stackTrace = ex.getStackTrace();
        if (stackTrace.length > 0) {
            StackTraceElement element = stackTrace[0];
            details.put("occurredInClass", element.getClassName());
            details.put("occurredInMethod", element.getMethodName());
            details.put("lineNumber", element.getLineNumber());
        }

        return details;
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Object> handleNoSuchElementException(NoSuchElementException ex, WebRequest request, HttpServletRequest httpServletRequest) {
        Map<String, Object> details = buildErrorDetails(ex, request, httpServletRequest);
        String logMessage = String.format("[%s] %s: %s occurred. Request: %s %s, Client IP: %s, At %s : %s",
                details.get("occurredInClass"),
                details.get("timestamp"),
                "NoSuchElementException",
                httpServletRequest.getMethod(),
                httpServletRequest.getRequestURI(),
                httpServletRequest.getRemoteAddr(),
                details.get("occurredInMethod"),
                details.get("lineNumber"));

        log.error(logMessage, ex);
        return buildResponseEntity(HttpStatus.NOT_FOUND, "Resource not found.", details);
    }

    @ExceptionHandler(UnauthorizedAccessException.class)
    public ResponseEntity<Object> handleUnauthorizedAccessException(UnauthorizedAccessException ex, WebRequest request, HttpServletRequest httpServletRequest) {
        Map<String, Object> details = buildErrorDetails(ex, request, httpServletRequest);
        String logMessage = String.format("[%s] %s: %s occurred. Request: %s %s, Client IP: %s, At %s : %s",
                details.get("occurredInClass"),
                details.get("timestamp"),
                "UnauthorizedAccessException",
                httpServletRequest.getMethod(),
                httpServletRequest.getRequestURI(),
                httpServletRequest.getRemoteAddr(),
                details.get("occurredInMethod"),
                details.get("lineNumber"));

        log.error(logMessage, ex);
        return buildResponseEntity(HttpStatus.FORBIDDEN, "Access denied.", details);
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<Object> handleIOException(IOException ex, WebRequest request, HttpServletRequest httpServletRequest) {
        Map<String, Object> details = buildErrorDetails(ex, request, httpServletRequest);
        String logMessage = String.format("[%s] %s: %s occurred. Request: %s %s, Client IP: %s, At %s : %s",
                details.get("occurredInClass"),
                details.get("timestamp"),
                "IOException",
                httpServletRequest.getMethod(),
                httpServletRequest.getRequestURI(),
                httpServletRequest.getRemoteAddr(),
                details.get("occurredInMethod"),
                details.get("lineNumber"));

        log.error(logMessage, ex);
        return buildResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR, "File processing error.", details);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationExceptions(MethodArgumentNotValidException ex, WebRequest request, HttpServletRequest httpServletRequest) {
        Map<String, Object> details = buildErrorDetails(ex, request, httpServletRequest);
        String logMessage = String.format("[%s] %s: %s occurred. Request: %s %s, Client IP: %s, At %s : %s",
                details.get("occurredInClass"),
                details.get("timestamp"),
                "MethodArgumentNotValidException",
                httpServletRequest.getMethod(),
                httpServletRequest.getRequestURI(),
                httpServletRequest.getRemoteAddr(),
                details.get("occurredInMethod"),
                details.get("lineNumber"));

        log.error(logMessage, ex);
        return buildResponseEntity(HttpStatus.BAD_REQUEST, "Validation failed.", details);
    }

    @ExceptionHandler(JsonProcessingException.class)
    public ResponseEntity<Object> handleJsonProcessingException(JsonProcessingException ex, WebRequest request, HttpServletRequest httpServletRequest) {
        Map<String, Object> details = buildErrorDetails(ex, request, httpServletRequest);
        String logMessage = String.format("[%s] %s: %s occurred. Request: %s %s, Client IP: %s, At %s : %s",
                details.get("occurredInClass"),
                details.get("timestamp"),
                "JsonProcessingException",
                httpServletRequest.getMethod(),
                httpServletRequest.getRequestURI(),
                httpServletRequest.getRemoteAddr(),
                details.get("occurredInMethod"),
                details.get("lineNumber"));

        log.error(logMessage, ex);
        return buildResponseEntity(HttpStatus.BAD_REQUEST, "Error processing JSON data.", details);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleAllExceptions(Exception ex, WebRequest request, HttpServletRequest httpServletRequest) {
        Map<String, Object> details = buildErrorDetails(ex, request, httpServletRequest);
        String logMessage = String.format("[%s] %s: %s occurred. Request: %s %s, Client IP: %s, At %s : %s",
                details.get("occurredInClass"),
                details.get("timestamp"),
                ex.getClass().getSimpleName(),
                httpServletRequest.getMethod(),
                httpServletRequest.getRequestURI(),
                httpServletRequest.getRemoteAddr(),
                details.get("occurredInMethod"),
                details.get("lineNumber"));

        log.error(logMessage, ex);
        return buildResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred.", details);
    }
}
