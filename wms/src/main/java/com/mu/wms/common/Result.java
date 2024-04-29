package com.mu.wms.common;

import lombok.Data;

@Data
public class Result<T> {
    //编码 200/400
    private int code;
    // 成功 / 失败
    private String msg;
    // 若data 为列表, 则为列表总数(总记录数)
    private Long total;
    // 数据
    private T data;

    public static <T> Result fail(){
        return Result.result(ResponseCode.FAIL, 0L, null);
    }

    public static <T> Result fail(ResponseCode code){
        return result(code, 0L, null);
    }

    public static <T> Result fail(ResponseCode code, T data){
        return result(code, 0L, data);
    }

    public static <T> Result fail(ResponseCode code, T data, Long total){
        return result(code, total, data);
    }

    public static <T> Result suc(){
        return result(ResponseCode.SUCCESS, 0L, null);
    }

    public static <T> Result suc(T data){
        return result(ResponseCode.SUCCESS, 0L, data);
    }

    public static <T> Result suc(T data, Long total){
        return result(ResponseCode.SUCCESS, total, data);
    }

    public static <T> Result suc(ResponseCode code, T data){
        return result(code, 0L, data);
    }

    public static <T> Result suc(ResponseCode code, T data, Long total){
        return result(code, total, data);
    }

    public static <T> Result<T> result(ResponseCode code, Long total, T data){
        Result<T> result = new Result<T>();
        result.setCode(code.getCode());
        result.setMsg(code.getMessage());
        result.setTotal(total);
        result.setData(data);
        return result;
    }
}
