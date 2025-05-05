package com.example.notification_service.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class RabbitConfig {
    public static final String EXCHANGE = "reservation.events";

    @Bean Queue createdQueue()   { return new Queue("reservation.created.queue"); }
    @Bean Queue confirmedQueue() { return new Queue("reservation.confirmed.queue"); }
    @Bean DirectExchange exchange() { return new DirectExchange(EXCHANGE); }

    @Bean Binding bindCreated(Queue createdQueue, DirectExchange ex) {
        return BindingBuilder.bind(createdQueue).to(ex).with("reservation.created");
    }

    @Bean Binding bindConfirmed(Queue confirmedQueue, DirectExchange ex) {
        return BindingBuilder.bind(confirmedQueue).to(ex).with("reservation.confirmed");
    }

    // reuse for scheduling email/SMS
    @Bean TaskScheduler taskScheduler() {
        return new ThreadPoolTaskScheduler();
    }

    // —————————————————————————————————————————————————————————————————————————
    // 1) JSON converter with a TypeId mapping from client → notification DTO
    // —————————————————————————————————————————————————————————————————————————
    // 1) register the JSON converter
    @Bean
    public Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    // 2) override the RabbitTemplate so it uses JSON
    @Bean
    public RabbitTemplate rabbitTemplate(
            ConnectionFactory cf,
            Jackson2JsonMessageConverter converter
    ) {
        RabbitTemplate rt = new RabbitTemplate(cf);
        rt.setMessageConverter(converter);
        return rt;
    }

    // 3) tell listener containers to use JSON as well
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
