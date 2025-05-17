package com.example.notification_service.config;

import com.example.notification_service.events.ReservationCreatedEvent;
import com.example.notification_service.events.ReservationConfirmedEvent;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.DefaultJackson2JavaTypeMapper;
import org.springframework.amqp.support.converter.Jackson2JavaTypeMapper;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

import java.util.Map;

@Configuration
public class RabbitConfig {

    public static final String EXCHANGE = "reservation.events";

    @Bean Queue reservationCreatedNotificationQueue()   { return new Queue("reservation.created.notification.queue", true); }
    @Bean Queue reservationConfirmedNotificationQueue() { return new Queue("reservation.confirmed.notification.queue", true); }

    @Bean
    public DirectExchange exchange() {
        return new DirectExchange(EXCHANGE);
    }

    @Bean Binding bindNotificationCreated(Queue reservationCreatedNotificationQueue, DirectExchange exchange) {
        return BindingBuilder.bind(reservationCreatedNotificationQueue)
                .to(exchange)
                .with("reservation.created");
    }

    @Bean Binding bindNotificationConfirmed(Queue reservationConfirmedNotificationQueue, DirectExchange exchange) {
        return BindingBuilder.bind(reservationConfirmedNotificationQueue)
                .to(exchange)
                .with("reservation.confirmed");
    }


    @Bean
    public TaskScheduler taskScheduler() {
        return new ThreadPoolTaskScheduler();
    }

    @Bean
    public Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
        Jackson2JsonMessageConverter converter = new Jackson2JsonMessageConverter();
        DefaultJackson2JavaTypeMapper tm = new DefaultJackson2JavaTypeMapper();
        tm.setTypePrecedence(Jackson2JavaTypeMapper.TypePrecedence.TYPE_ID);

        tm.setTrustedPackages(
                "com.example.Schedule_Service.events",
                "com.example.notification_service.events"
        );

        tm.setIdClassMapping(Map.of(
                "com.example.Schedule_Service.events.ReservationCreatedEvent",
                ReservationCreatedEvent.class,
                "com.example.Schedule_Service.events.ReservationConfirmedEvent",
                ReservationConfirmedEvent.class
        ));

        converter.setJavaTypeMapper(tm);
        return converter;
    }

    @Bean
    public RabbitTemplate rabbitTemplate(
            ConnectionFactory cf,
            Jackson2JsonMessageConverter converter
    ) {
        RabbitTemplate rt = new RabbitTemplate(cf);
        rt.setMessageConverter(converter);
        return rt;
    }

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
