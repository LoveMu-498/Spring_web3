// package com.mu.wms.config;
//
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.web.authentication.AuthenticationFailureHandler;
// import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
// import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
//
// /**
//  * {@code @project} spring_vue3_wms
//  * {@code @description} SecurityApplication
//  * @author Mu
//  * {@code @date} 2024-04-27 16:45:27
//  * @version 1.0
//  */
// @Configuration
// public class SecurityConfig extends WebSecurityConfigurerAdapter {
//
//     @Autowired
//     private AuthenticationSuccessHandler successHandler;
//
//     @Autowired
//     private AuthenticationFailureHandler failureHandler;
//
//     @Autowired
//     private LogoutSuccessHandler logoutSuccessHandler;
//
//     @Override
//     protected void configure(HttpSecurity http) throws Exception {
//         http.formLogin()
// //                配置认证成功处理器
//                 .successHandler(successHandler)
// //                配置认证失败处理器
//                 .failureHandler(failureHandler);
//
//         http.logout()
//                 //配置注销成功处理器
//                 .logoutSuccessHandler(logoutSuccessHandler);
//
//         http.authorizeRequests().anyRequest().authenticated();
//     }
// }
