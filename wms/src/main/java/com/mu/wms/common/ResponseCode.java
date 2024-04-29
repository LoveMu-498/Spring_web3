package com.mu.wms.common;

/**
 * {@code @project} spring_vue3_wms
 * {@code @description} 统一管理响应状态码
 * @author Mu
 * {@code @date} 2024-04-29 02:19:09
 * @version 1.0
 */
public enum ResponseCode {
    SUCCESS(200, "操作成功"),
    FAIL(400, "操作失败"),
    PARAM_ERROR(401, "数据异常"),
    SYS_ERROR(500, "系统异常");

    private final int code;
    private final String message;

    ResponseCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
