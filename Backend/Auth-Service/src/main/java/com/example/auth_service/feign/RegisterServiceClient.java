package com.example.auth_service.feign;

import com.example.auth_service.entities.Abonne;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "register-service")
public interface RegisterServiceClient {

    @PostMapping("/signup")
    ResponseEntity<Abonne> registerAbonne(@RequestBody Abonne abonne);
}