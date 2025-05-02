package com.example.notification_service.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
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
    @Bean
    public Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
        Jackson2JsonMessageConverter converter = new Jackson2JsonMessageConverter();

        DefaultJackson2JavaTypeMapper typeMapper = new DefaultJackson2JavaTypeMapper();
        typeMapper.setTypePrecedence(Jackson2JavaTypeMapper.TypePrecedence.TYPE_ID);

        Map<String, Class<?>> idClassMapping = new HashMap<>();
        // keys must match the __TypeId__ header that the producer sets:
        idClassMapping.put(
                "com.example.ClientBooking_service.events.ReservationCreatedEvent",
                com.example.notification_service.events.ReservationCreatedEvent.class
        );
        idClassMapping.put(
                "com.example.ClientBooking_service.events.ReservationConfirmedEvent",
                com.example.notification_service.events.ReservationConfirmedEvent.class
        );

        typeMapper.setIdClassMapping(idClassMapping);
        converter.setJavaTypeMapper(typeMapper);
        return converter;
    }


    // 2) Tell RabbitTemplate to use JSON
    @Bean
    public RabbitTemplate rabbitTemplate(
            org.springframework.amqp.rabbit.connection.ConnectionFactory cf,
            Jackson2JsonMessageConverter converter
    ) {
        RabbitTemplate rt = new RabbitTemplate(cf);
        rt.setMessageConverter(converter);
        return rt;
    }

    // 3) Tell @RabbitListener containers to use the same JSON converter
    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
            org.springframework.amqp.rabbit.connection.ConnectionFactory cf,
            Jackson2JsonMessageConverter converter
    ) {
        SimpleRabbitListenerContainerFactory f = new SimpleRabbitListenerContainerFactory();
        f.setConnectionFactory(cf);
        f.setMessageConverter(converter);
        return f;
    }
}
