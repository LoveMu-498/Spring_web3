// package com.mu.wms.config;
//
// import com.mu.wms.common.MultiRequestBodyArgumentResolver;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.http.converter.HttpMessageConverter;
// import org.springframework.http.converter.StringHttpMessageConverter;
// import org.springframework.web.method.support.HandlerMethodArgumentResolver;
//
// import java.nio.charset.Charset;
// import java.util.List;
//
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.http.converter.HttpMessageConverter;
// import org.springframework.http.converter.StringHttpMessageConverter;
// import org.springframework.web.method.support.HandlerMethodArgumentResolver;
// import org.springframework.web.servlet.config.annotation.EnableWebMvc;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;
//
// import java.nio.charset.Charset;
// import java.util.List;
//
// /**
//  * {@code @project} spring_vue3_wms
//  * {@code @description} 添加MultiRequestBody 解析器
//  * @author Mu
//  * {@code @date} 2024-04-29 06:47:36
//  * @version 1.0
//  */
// @Configuration
// @EnableWebMvc
// public class WebConfig extends WebMvcConfigurationSupport {
//     @Override
//     public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
//         // 添加MultiRequestBody参数解析器
//         argumentResolvers.add(new MultiRequestBodyArgumentResolver());
//     }
//
//     @Bean
//     public HttpMessageConverter<String> responseBodyConverter() {
//         // 解决中文乱码问题
//         return new StringHttpMessageConverter(Charset.forName("UTF-8"));
//     }
//
//     @Override
//     public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
//         super.configureMessageConverters(converters);
//         converters.add(responseBodyConverter());
//     }
// }