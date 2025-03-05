package Feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name="BOOKINGANDSTATISTICS-SERVICE")
public interface AuthInterface {

    //METHODS TO BE IMPLEMENTED
    @PostMapping("/auth")
    public String auth();
}
