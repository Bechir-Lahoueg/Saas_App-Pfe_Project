package com.example.reporting_service.config;


import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@RequiredArgsConstructor
@EnableRabbit
@Configuration
public class RabbitConfig {
    //––– TENANT EVENTS –––
    public static final String TENANT_EXCHANGE = "tenant.events";
    public static final String CATEGORY_EXCHANGE = "category.events";
    public static final String PAYMENT_EXCHANGE = "payment.events";


    @Bean DirectExchange categoryExchange() {
        return new DirectExchange(CATEGORY_EXCHANGE);
    }

    @Bean DirectExchange tenantExchange() {
        return new DirectExchange(TENANT_EXCHANGE);
    }

    @Bean DirectExchange paymentExchange() {
        return new DirectExchange(PAYMENT_EXCHANGE);
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

    @Bean Queue tenantCreatedQueue() {
        return new Queue("tenant.created.queue", true);
    }

    @Bean
    Binding bindCategoryCreated(Queue categoryCreatedQueue, DirectExchange categoryExchange) {
        return BindingBuilder
                .bind(categoryCreatedQueue)
                .to(categoryExchange)
                .with("category.created");
    }

    @Bean Binding bindTenantCreated(Queue tenantCreatedQueue, DirectExchange tenantExchange) {
        return BindingBuilder
                .bind(tenantCreatedQueue)
                .to(tenantExchange)
                .with("tenant.created");
    }

    @Bean Binding bindPaymentCompleted(Queue paymentCompletedQueue, DirectExchange paymentExchange) {
        return BindingBuilder
                .bind(paymentCompletedQueue)
                .to(paymentExchange)
                .with("payment.completed");
    }

    @Bean Binding bindReservationCreated(Queue reservationCreatedQueue, DirectExchange paymentExchange) {
        return BindingBuilder
                .bind(reservationCreatedQueue)
                .to(paymentExchange)
                .with("reservation.created");
    }

    @Bean
    public Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(
            ConnectionFactory connectionFactory,
            Jackson2JsonMessageConverter converter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(converter);
        return template;
    }

    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
            ConnectionFactory connectionFactory,
            Jackson2JsonMessageConverter converter) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(converter);
        return factory;
    }
}