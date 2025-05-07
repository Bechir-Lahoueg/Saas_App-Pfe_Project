package com.example.reporting_service.config;


import com.example.reporting_service.events.ReservationConfirmedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.DefaultJackson2JavaTypeMapper;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@EnableRabbit
@Configuration
public class RabbitConfig {
    //––– TENANT EVENTS –––
    public static final String TENANT_EXCHANGE = "tenant.events";
    public static final String CATEGORY_EXCHANGE = "category.events";
    public static final String PAYMENT_EXCHANGE = "payment.events";
    public static final String RESERVATION_EXCHANGE = "reservation.events";


    @Bean DirectExchange categoryExchange() {
        return new DirectExchange(CATEGORY_EXCHANGE);
    }

    @Bean DirectExchange tenantExchange() {
        return new DirectExchange(TENANT_EXCHANGE);
    }

    @Bean DirectExchange paymentExchange() {
        return new DirectExchange(PAYMENT_EXCHANGE);
    }

    @Bean DirectExchange reservationExchange() {
        return new DirectExchange(RESERVATION_EXCHANGE);
    }

    @Bean Queue categoryCreatedQueue() {
        return new Queue("category.created.queue", true);
    }

    @Bean Queue paymentCompletedQueue() {
        return new Queue("payment.completed.queue", true);
    }

    @Bean Queue reservationCreatedQueue() {
        return new Queue("reservation.created.queue", true);
    }
    @Bean Queue reservationConfirmedQueue() {
        return new Queue("reservation.confirmed.queue", true);
    }

    @Bean Queue tenantCreatedQueue() {
        return new Queue("tenant.created.queue", true);
    }

    @Bean
    Binding bindCategoryCreated(Queue categoryCreatedQueue, DirectExchange categoryExchange) {
        return BindingBuilder.bind(categoryCreatedQueue).to(categoryExchange).with("category.created");
    }

    @Bean Binding bindTenantCreated(Queue tenantCreatedQueue, DirectExchange tenantExchange) {
        return BindingBuilder.bind(tenantCreatedQueue).to(tenantExchange).with("tenant.created");
    }

    @Bean Binding bindPaymentCompleted(Queue paymentCompletedQueue, DirectExchange paymentExchange) {
        return BindingBuilder.bind(paymentCompletedQueue).to(paymentExchange).with("payment.completed");
    }

    @Bean Binding bindReservationCreated(Queue reservationCreatedQueue, DirectExchange reservationExchange) {
        return BindingBuilder.bind(reservationCreatedQueue).to(reservationExchange).with("reservation.created");
    }

    @Bean
    public Binding bindReservationConfirmed(Queue reservationConfirmedQueue, DirectExchange reservationExchange) {
        return BindingBuilder.bind(reservationConfirmedQueue).to(reservationExchange).with("reservation.confirmed");
    }

    @Bean
    public Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
        Jackson2JsonMessageConverter converter = new Jackson2JsonMessageConverter();
        DefaultJackson2JavaTypeMapper tm = new DefaultJackson2JavaTypeMapper();
        tm.setTypePrecedence(DefaultJackson2JavaTypeMapper.TypePrecedence.TYPE_ID);

        // Map external class to local class
        Map<String, Class<?>> idClassMapping = new HashMap<>();
        idClassMapping.put(
                "com.example.Schedule_Service.events.ReservationCreatedEvent",
                com.example.reporting_service.events.ReservationCreatedEvent.class
        );
        idClassMapping.put(
                "com.example.Schedule_Service.events.ReservationConfirmedEvent",
                com.example.reporting_service.events.ReservationConfirmedEvent.class
        );
        tm.setIdClassMapping(idClassMapping);

        tm.setTrustedPackages("*");
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