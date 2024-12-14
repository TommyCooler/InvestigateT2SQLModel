package com.example.demo.controller;

import com.example.demo.models.LoginRequest;
import com.example.demo.models.LoginResponse;
import com.example.demo.models.User;
import com.example.demo.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/login")
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping
    public ResponseEntity<?> login(@RequestBody LoginRequest request){
        User user = loginService.findByUsernameAndPassword(request.getUsername(), request.getPassword());
        LoginResponse response = new LoginResponse();
        response.setUsername(user.getUsername());
        response.setVip(user.isVIP());
        response.setStaff(user.isStaff());
        return ResponseEntity.ok(user);
    }
}
