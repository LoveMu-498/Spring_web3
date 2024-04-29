package com.mu.wms.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mu.wms.common.Result;
import com.mu.wms.entity.User;
import com.mu.wms.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * {@code @project} spring_vue3_wms
 * {@code @description} 测试类 前端控制器
 * @author Mu
 * {@code @date} 2024-04-27 16:27:32
 * @version 1.0
 */
@Slf4j
@RestController
@RequestMapping("/hello")
public class HelloController {
    @Autowired
    private UserService userService;

    // 增
    @PostMapping("/save")
    public boolean save(@ModelAttribute User user){

        return userService.save(user);
    }

    // 增加or修改
    @PostMapping("/saveOrMod")
    public boolean saveOrMod(@ModelAttribute User user){
        return userService.saveOrUpdate(user);
    }
    // 改
    @PostMapping("/update")
    public boolean update(@ModelAttribute User user){
        return userService.updateById(user);
    }
    // 删
    @DeleteMapping("/delete")
    public boolean delete(@RequestParam("id") Integer id){
        return userService.removeById(id);
    }
    // 查
    @PostMapping("/list")
    public List<User> list(@ModelAttribute User user){
        LambdaQueryWrapper<User> lw = new LambdaQueryWrapper();
        lw.like(User::getNickName, user.getNickName());
        return userService.list(lw);
    }
    // 查 分页
    @PostMapping("/listPage")
    public Result<List<User>> list(
            @RequestParam(name = "pageNum", required = false, defaultValue = "1") Integer pageNum,
            @RequestParam(name = "pageSize", required = false, defaultValue = "10") Integer pageSize,
            @ModelAttribute User user){
        // System.out.println("pageNum = " + pageNum);
        // System.out.println("pageSize = " + pageSize);
        // System.out.println("user.getNickName() = " + user.getNickName());
        // return null;
        IPage<User> res = userService.page(
                new Page<User>(pageNum, pageSize),
                new LambdaQueryWrapper<User>()
                        .like(User::getNickName, user.getNickName()));
        return Result.suc(res.getRecords(), res.getTotal());
    }
/*    // 查 分页
    @PostMapping("/listPageJson")
    public Result<List<User>> listJson(
            @MultiRequestBody Integer pageNum,
            @MultiRequestBody Integer pageSize,
            @MultiRequestBody User user){
        System.out.println("pageNum = " + pageNum);
        System.out.println("pageSize = " + pageSize);
        System.out.println("user.getNickName() = " + user.getNickName());
        // return null;
        IPage<User> res = userService.page(
                new Page<User>(pageNum, pageSize),
                new LambdaQueryWrapper<User>()
                        .like(User::getNickName, user.getNickName()));
        return Result.suc(res.getRecords(), res.getTotal());
    }*/
}
