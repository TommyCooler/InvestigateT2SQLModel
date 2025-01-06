package fpt.ssps.text2sql.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import fpt.ssps.text2sql.model.User;
import fpt.ssps.text2sql.repo.UserRepository;
import fpt.ssps.text2sql.service.iservice.IUserService;

@Service
public class UserService implements IUserService {
    
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Override
    public User login(String username, String password) {
        logger.info("Attempting login for username: {}", username);
        try {
            User user = userRepository.findByUsernameAndPassword(username, password);
            logger.info("Login result for {}: {}", username, user != null ? "success" : "failed");
            return user;
        } catch (Exception e) {
            logger.error("Error during login: ", e);
            throw e;
        }
    }
}