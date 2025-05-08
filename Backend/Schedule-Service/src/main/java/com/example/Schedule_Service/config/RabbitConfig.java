package com.example.Schedule_Service.config;

import com.example.Schedule_Service.events.ReservationCreatedEvent;
import com.example.Schedule_Service.events.ReservationConfirmedEvent;
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

import java.util.Map;

@Configuration
public class RabbitConfig {
    public static final String EXCHANGE = "reservation.events";

    //––– This service’s *own* queues (won’t collide) –––
    @Bean Queue scheduleCreatedQueue()   { return new Queue("reservation.created.schedule.queue", true); }
    @Bean Queue scheduleConfirmedQueue() { return new Queue("reservation.confirmed.schedule.queue", true); }
    @Bean DirectExchange exchange()      { return new DirectExchange(EXCHANGE); }

    @Bean Binding bindScheduleCreated(Queue scheduleCreatedQueue, DirectExchange exchange) {
        return BindingBuilder.bind(scheduleCreatedQueue)
                .to(exchange)
                .with("reservation.created");
    }

    @Bean Binding bindScheduleConfirmed(Queue scheduleConfirmedQueue, DirectExchange exchange) {
        return BindingBuilder.bind(scheduleConfirmedQueue)
                .to(exchange)
                .with("reservation.confirmed");
    }

    @Bean
    public Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
        Jackson2JsonMessageConverter converter = new Jackson2JsonMessageConverter();
        DefaultJackson2JavaTypeMapper tm = new DefaultJackson2JavaTypeMapper();
        tm.setTypePrecedence(DefaultJackson2JavaTypeMapper.TypePrecedence.TYPE_ID);

        // Trust only this package, map FQCN → local classes
        tm.setTrustedPackages("com.example.Schedule_Service.events");
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
    public RabbitTemplate rabbitTemplate(ConnectionFactory cf,
                                         Jackson2JsonMessageConverter converter) {
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
