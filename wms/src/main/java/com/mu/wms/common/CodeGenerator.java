package com.mu.wms.common;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.generator.FastAutoGenerator;
import com.baomidou.mybatisplus.generator.config.*;
import com.baomidou.mybatisplus.generator.config.rules.DateType;
import com.baomidou.mybatisplus.generator.engine.FreemarkerTemplateEngine;
import com.baomidou.mybatisplus.generator.fill.Column;
import com.baomidou.mybatisplus.generator.fill.Property;
import org.apache.ibatis.annotations.Mapper;

import java.util.*;

// 演示例子，执行 main 方法控制台输入模块表名回车自动生成对应项目目录中


public class CodeGenerator {
    public static void main(String[] args) {
        FastAutoGenerator.create("jdbc:mysql://localhost:3306/wms_web3?useUnicode=true&characterEncoding=utf-8&serverTimezone=UTC", "root", "12312300a")
                .globalConfig(builder -> {
                    builder.author("Mu") // 设置作者
                            .enableSwagger()
                            .dateType(DateType.TIME_PACK)//时间策略
                            .commentDate("yyyy-MM-dd")//注释日期
                            .outputDir(System.getProperty("user.dir")+"\\wms\\src\\main\\java"); // 指定输出目录
                })
                .packageConfig(builder -> {
                    builder
                            // .moduleName("wms") // 模块名
                            .parent("com.mu.wms") // 设置父包名
                            .entity("entity")
                            .service("service")
                            .serviceImpl("service.impl")
                            .mapper("mapper")
                            .xml("mapper.xml")
                            .controller("controller")
                            .pathInfo(Collections.singletonMap(OutputFile.xml, System.getProperty("user.dir")+"\\wms\\src\\main\\resources\\mapper")); // 设置mapperXml生成路径
                })
                .strategyConfig(builder -> {
                    builder.addInclude("sys_user") // 设置需要生成的表名
                            .addTablePrefix("sys_") // 设置过滤表前缀
                            .controllerBuilder()
                            // .enableRestStyle()
                            .enableRestStyle()//开启restful风格
                            .enableFileOverride() // 开启文件覆盖
                            .entityBuilder()
                            .addTableFills(new Column("create_time", FieldFill.INSERT)) // 自动填充策略
                            .addTableFills(new Property("updateTime", FieldFill.INSERT_UPDATE)) // 自动填充策略
                            .logicDeleteColumnName("del_flag") //逻辑删除字段
                            .enableLombok()//开启 Lombok
                            .enableFileOverride() // 开启文件覆盖
                            .enableTableFieldAnnotation() // 属性加上注解说明
                            .mapperBuilder()
                            .enableFileOverride() // 开启文件覆盖
                            .mapperAnnotation(Mapper.class)//开启 @Mapper
                            .serviceBuilder()
                            .formatServiceFileName("%sService") // 设置生成的Service接口名首字母不带I
                            .formatServiceImplFileName("%sServiceImpl") // 设置生成的Service实现类名首字母不带I
                            .enableFileOverride();
                })
                .templateEngine(new FreemarkerTemplateEngine()) // 使用Freemarker引擎模板，默认的是Velocity引擎模板
                .execute();
    }

}
