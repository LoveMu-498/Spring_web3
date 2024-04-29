package com.mu.wms.handler;

import com.mu.wms.common.ResponseCode;
import com.mu.wms.common.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * {@code @project} spring_vue3_wms
 * {@code @description} 对异常情况进行处理，以保证系统的稳定性和可控性。因此，我们可以在对外暴露的 API 接口中添加异常处理机制，以统一处理系统抛出的异常情况，并防止系统挂掉。
 * @author Mu
 * {@code @date} 2024-04-29 02:22:23
 * @version 1.0
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public Result handleException(Exception e) {
        log.error("系统异常：{}", e.getMessage());
        return Result.fail(ResponseCode.SYS_ERROR);
    }

    @ExceptionHandler(DataAccessException.class)
    public Result handleDataAccessException(DataAccessException e) {
        log.error("数据异常：{}", e.getMessage());
        return Result.fail(ResponseCode.PARAM_ERROR);
    }

}
