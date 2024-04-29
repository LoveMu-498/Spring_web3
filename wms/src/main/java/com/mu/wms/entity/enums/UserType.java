package com.mu.wms.entity.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * {@code @project} spring_vue3_wms
 * {@code @description} 用户类型(0管理员, 1普通用户) 枚举类
 * @author Mu
 * {@code @date} 2024-04-29 04:53:05
 * @version 1.0
 */
@Getter
public enum UserType {
    ADMINISTRATOR(0, "管理员"), USER(1, "普通用户");

    UserType(int code, String desc) {
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
