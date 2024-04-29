package com.mu.wms.entity.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * {@code @project} spring_vue3_wms
 * {@code @description} 用户帐号状态(0正常, 1停用) 枚举类
 * @author Mu
 * {@code @date} 2024-04-29 05:09:33
 * @version 1.0
 */
@Getter
public enum UserStatus {
    NORMAL(0, "正常"), DISABLED(1, "停用");
    UserStatus(int code, String desc) {
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
