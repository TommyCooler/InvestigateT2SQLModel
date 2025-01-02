package fpt.ssps.text2sql.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import fpt.ssps.text2sql.model.User;
import fpt.ssps.text2sql.repo.UserRepository;
import fpt.ssps.text2sql.service.iservice.IUserService;

@Service
public class UserService implements IUserService{

    @Autowired
    private UserRepository userRepository;

    @Override
    public User login(String username, String password) {
        return userRepository.findByUsernameAndPassword(username, password);
    }
}
