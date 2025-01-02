package fpt.ssps.text2sql.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fpt.ssps.text2sql.model.User;
import fpt.ssps.text2sql.model.request.Login;
import fpt.ssps.text2sql.service.iservice.IUserService;

@RestController
@RequestMapping(name = "user")
public class UserController {

    @Autowired
    private IUserService iUserService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Login login){
        User userLogin = iUserService.login(login.getUsername(), login.getPassword());
        if(userLogin!=null){
            return ResponseEntity.ok("success");
        }
        return null;
    }

}
