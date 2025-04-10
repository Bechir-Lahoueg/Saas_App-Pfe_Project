package com.example.notification_service.config;

import com.example.notification_service.filter.TenantContextFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<TenantContextFilter> tenantContextFilter() {
        FilterRegistrationBean<TenantContextFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new TenantContextFilter());
        registrationBean.addUrlPatterns("/*");
        registrationBean.setOrder(1);
        return registrationBean;
    }
}