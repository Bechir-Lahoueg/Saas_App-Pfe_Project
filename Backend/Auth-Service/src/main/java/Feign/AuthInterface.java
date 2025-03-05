package Feign;

import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(name="BOOKINGANDSTATISTICS-SERVICE")
public interface AuthInterface {

    //METHODS TO BE IMPLEMENTED
}
