package com.example.ClientBooking_service.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;       // <-- Spring’s CF
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    public static final String EXCHANGE = "reservation.events";

    @Bean Queue createdQueue() {
        return new Queue("reservation.created.queue");
    }

    @Bean Queue confirmedQueue() {
        return new Queue("reservation.confirmed.queue");
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
