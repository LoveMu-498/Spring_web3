package com.mu.wms.entity.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * {@code @project} spring_vue3_wms
 * {@code @description} 性别枚举类
 * @author Mu
 * {@code @date} 2024-04-29 04:45:54
 * @version 1.0
 */
@Getter
public enum Sex {
    MALE(0, "男"), FEMALE(1, "女"), UNKNOWN(2, "未知");

    Sex(int code, String desc) {
        this.code = code;
        this.desc = desc;
    }
    //标记数据库存的值 时 code
    @EnumValue
    @JsonValue
    // @JSONField(serialzeFeatures= SerializerFeature.WriteEnumUsingToString)
    private final int code;
    private final String desc;
}
