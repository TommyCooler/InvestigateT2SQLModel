package com.example.demo.service;

import com.example.demo.models.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LoginService {

    @Autowired
    private UserRepository userRepository;

    public User findByUsernameAndPassword(String username, String password){
        Optional<User> user = userRepository.findByUsernameAndPassword(username, password);
        return user.get();
    }
}
