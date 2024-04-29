package com.mu.wms.controller;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.conditions.query.QueryChainWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mu.wms.common.ResponseCode;
import com.mu.wms.common.Result;
import com.mu.wms.entity.User;
import com.mu.wms.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

/**
 * <p>
 * 用户表 前端控制器
 * </p>
 *
 * @author Mu
 * @since 2024-04-29
 */
@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;;

    // 增
    @PostMapping("/save")
    public Result save(@ModelAttribute User user){
        if(null == user || StringUtils.isBlank(user.getUserName()) || StringUtils.isBlank(user.getPassword())){
            return Result.fail(ResponseCode.PARAM_ERROR, "用户名或密码不能为空");
        }
        if(userService.save(user)){
            return Result.suc();
        }else{
            log.error(user.toString());
            return Result.fail();
        }
    }

    // 增加or修改
    @PostMapping("/saveOrMod")
    public Result saveOrMod(@ModelAttribute User user){
        if(null == user || (null == user.getId() && (StringUtils.isBlank(user.getUserName()) || StringUtils.isBlank(user.getPassword())))){
            return Result.fail(ResponseCode.PARAM_ERROR, "参数不足");
        }
        if(userService.saveOrUpdate(user)){
            return Result.suc();
        }else{
            log.error(user.toString());
            return Result.fail();
        }
    }

    // 改
    @PostMapping("/update")
    public Result update(@ModelAttribute User user){
        if(null == user || null == user.getId()){
            return Result.fail(ResponseCode.PARAM_ERROR, "参数不足");
        }
        if(userService.updateById(user)){
            return Result.suc();
        }else{
            log.error(user.toString());
            return Result.fail();
        }
    }

    // 删
    @DeleteMapping("/delete")
    public boolean delete(@RequestParam("id") Integer id){
        return userService.removeById(id);
    }

    // 查
    // @PostMapping("/list")
    // public List<User> list(@ModelAttribute User user){
    //     LambdaQueryWrapper<User> lw = new LambdaQueryWrapper();
    //     lw.like(User::getNickName, user.getNickName());
    //     return userService.list(lw);
    // }

    // 查 分页
    @PostMapping("/listPage")
    public Result<List<User>> list(
            @RequestParam(name = "pageNum", required = false, defaultValue = "1") Integer pageNum,
            @RequestParam(name = "pageSize", required = false, defaultValue = "10") Integer pageSize,
            @RequestParam(name = "createLeft", required = false) Date createLeft,
            @RequestParam(name = "createRight", required = false) Date createRight,
            @RequestParam(name = "updateLeft", required = false) Date updateLeft,
            @RequestParam(name = "updateRight", required = false) Date updateRight,
            @ModelAttribute User user){
        // System.out.println("pageNum = " + pageNum);
        // System.out.println("pageSize = " + pageSize);
        // System.out.println("user.getNickName() = " + user.getNickName());
        // return null;
        System.out.println("user = " + user);
        System.out.println("createLeft = " + createLeft);
        System.out.println("createRight = " + createRight);
        System.out.println("updateLeft = " + updateLeft);
        System.out.println("updateRight = " + updateRight);
        log.debug(user.toString());
        IPage<User> res = userService.page(
                new Page<User>(pageNum, pageSize),
                new LambdaQueryWrapper<User>()
                        .setEntity(user)
                        .ge(createLeft != null, User::getCreateTime, createLeft)
                        .le(createRight != null, User::getCreateTime, createRight)
                        .ge(updateLeft != null, User::getUpdateTime, updateLeft)
                        .le(updateRight != null, User::getUpdateTime, updateRight)

                // new LambdaQueryWrapper<User>()
                //         .like(StringUtils.isNotBlank(user.getUserName()), User::getUserName, user.getUserName())
                //         .like(StringUtils.isNotBlank(user.getNickName()),User::getNickName, user.getNickName())
                //         .eq(user.getCreateBy() != null, User::getCreateBy, user.getId())
                //         .eq(user.getUpdateBy() != null, User::getUpdateBy, user.getUpdateBy())
                //         .eq(user.getId() != null, User::getId, user.getId())
                //         .eq(user.getStatus() != null, User::getStatus, user.getStatus())
        );
        return Result.suc(res.getRecords(), res.getTotal());
    }

}
