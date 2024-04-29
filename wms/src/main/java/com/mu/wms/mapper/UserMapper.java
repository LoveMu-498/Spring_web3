package com.mu.wms.mapper;

import com.mu.wms.entity.User;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * <p>
 * 用户表 Mapper 接口
 * </p>
 *
 * @author Mu
 * @since 2024-04-29
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {

}
