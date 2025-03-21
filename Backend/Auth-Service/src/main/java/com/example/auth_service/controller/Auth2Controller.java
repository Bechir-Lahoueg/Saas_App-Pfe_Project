//package com.example.auth_service.controller;
//
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//@RequestMapping("/login/oauth2/code")
//@RestController
//public class Auth2Controller {
//    @GetMapping("/google")
//    public String grantCode(@RequestParam("code") String code, @RequestParam("scope") String scope, @RequestParam("authuser") String authUser, @RequestParam("prompt") String prompt) {
//        return processGrantCode(code);
//    }
//
//    private String processGrantCode(String code) {
//        System.out.println(code);
//        return code;
//    }
//
//
//}
