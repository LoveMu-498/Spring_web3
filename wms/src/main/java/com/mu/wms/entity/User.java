package com.mu.wms.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.mu.wms.entity.enums.Sex;
import com.mu.wms.entity.enums.UserStatus;
import com.mu.wms.entity.enums.UserType;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 用户表
 * </p>
 *
 * @author Mu
 * @since 2024-04-29
 */
@Getter
@Setter
@TableName("sys_user")
@ApiModel(value = "User对象", description = "用户表")
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty("主键")
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @ApiModelProperty("用户名")
    @TableField(value = "user_name", condition = SqlCondition.LIKE)
    private String userName;

    @ApiModelProperty("昵称")
    @TableField(value = "nick_name", condition = SqlCondition.LIKE)
    private String nickName;

    @ApiModelProperty("密码")
    @TableField("password")
    private String password;

    @ApiModelProperty("帐号状态(0正常, 1停用)")
    @TableField("status")
    private UserStatus status;

    @ApiModelProperty("邮箱")
    @TableField(value = "email", condition = SqlCondition.LIKE)
    private String email;

    @ApiModelProperty("手机号")
    @TableField(value = "phone_number", condition = SqlCondition.LIKE)
    private String phoneNumber;

    @ApiModelProperty("用户性别(0男, 1女, 2未知)")
    @TableField("sex")
    private Sex sex;

    @ApiModelProperty("头像")
    @TableField("avatar")
    private String avatar;

    @ApiModelProperty("用户类型(0管理员, 1普通用户)")
    @TableField("user_type")
    private UserType userType;

    @ApiModelProperty("创建人的用户id")
    @TableField("create_by")
    private Long createBy;

    @ApiModelProperty("创建时间")
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @ApiModelProperty("更新人")
    @TableField("update_by")
    private Long updateBy;

    @ApiModelProperty("更新时间")
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @ApiModelProperty("删除标值(0代表未删除,1代表已删除)")
    @TableField(value = "del_flag", select = false)
    @TableLogic
    private Integer delFlag;

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", userName='" + userName + '\'' +
                ", nickName='" + nickName + '\'' +
                ", password='" + password + '\'' +
                ", status=" + status +
                ", email='" + email + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", sex=" + sex +
                ", avatar='" + avatar + '\'' +
                ", userType=" + userType +
                ", createBy=" + createBy +
                ", createTime=" + createTime +
                ", updateBy=" + updateBy +
                ", updateTime=" + updateTime +
                ", delFlag=" + delFlag +
                '}';
    }

}
