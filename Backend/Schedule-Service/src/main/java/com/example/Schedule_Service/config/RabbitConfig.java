package com.example.Schedule_Service.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.DefaultJackson2JavaTypeMapper;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    public static final String EXCHANGE = "reservation.events";

    @Bean Queue createdQueue() {
        return new Queue("reservation.created.queue", true);
    }

    @Bean Queue confirmedQueue() {
        return new Queue("reservation.confirmed.queue", true);
    }

    @Bean DirectExchange exchange() {
        return new DirectExchange(EXCHANGE);
    }

    @Bean Binding b1(Queue createdQueue, DirectExchange exchange) {
        return BindingBuilder.bind(createdQueue).to(exchange).with("reservation.created");
    }

    @Bean Binding b2(Queue confirmedQueue, DirectExchange exchange) {
        return BindingBuilder.bind(confirmedQueue).to(exchange).with("reservation.confirmed");
    }

    // 1) register a JSON converter that writes the FQCN as __TypeId__
    @Bean
    public Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
        Jackson2JsonMessageConverter converter = new Jackson2JsonMessageConverter();
        DefaultJackson2JavaTypeMapper tm = new DefaultJackson2JavaTypeMapper();
        tm.setTypePrecedence(DefaultJackson2JavaTypeMapper.TypePrecedence.TYPE_ID);
        // trust only your events package
        tm.setTrustedPackages("com.example.Schedule_Service.events");
        converter.setJavaTypeMapper(tm);
        return converter;
    }

    // 2) use JSON on the RabbitTemplate
    @Bean
    public RabbitTemplate rabbitTemplate(
            ConnectionFactory cf,
            Jackson2JsonMessageConverter converter
    ) {
        RabbitTemplate rt = new RabbitTemplate(cf);
        rt.setMessageConverter(converter);
        return rt;
    }

    // 3) and on all @RabbitListener containers
    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
            ConnectionFactory cf,
            Jackson2JsonMessageConverter converter
    ) {
        SimpleRabbitListenerContainerFactory f = new SimpleRabbitListenerContainerFactory();
        f.setConnectionFactory(cf);
        f.setMessageConverter(converter);
        return f;
    }
}
