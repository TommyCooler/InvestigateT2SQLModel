package fpt.ssps.text2sql.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import fpt.ssps.text2sql.model.User;
import fpt.ssps.text2sql.model.Role;
import fpt.ssps.text2sql.model.request.Login;
import fpt.ssps.text2sql.model.response.LoginResponse;
import fpt.ssps.text2sql.service.iservice.IUserService;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class UserController {

    @Autowired
    private IUserService iUserService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Login login) {
        try {
            User userLogin = iUserService.login(login.getUsername(), login.getPassword());
            
            if (userLogin != null) {
                LoginResponse response = new LoginResponse(
                    userLogin.getId(),
                    userLogin.getUsername(),
                    userLogin.getRole(),
                    userLogin.getRole() == Role.vip,
                    "Login successful!"
                );
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(
                    new LoginResponse(null, null, null, false, "Invalid credentials!")
                );
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                new LoginResponse(null, null, null, false, "An error occurred during login!")
            );
        }
    }
}