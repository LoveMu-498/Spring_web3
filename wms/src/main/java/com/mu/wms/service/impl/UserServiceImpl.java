package com.mu.wms.service.impl;

import com.mu.wms.entity.User;
import com.mu.wms.mapper.UserMapper;
import com.mu.wms.service.UserService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 用户表 服务实现类
 * </p>
 *
 * @author Mu
 * @since 2024-04-29
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

}
