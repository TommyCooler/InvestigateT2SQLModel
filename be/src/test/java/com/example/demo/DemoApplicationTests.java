package com.example.demo;

import com.example.demo.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class DemoApplicationTests {

	@Autowired
	UserRepository userRepository;

	@Test
	void testGetUser() {
		var user = userRepository.findByUsernameAndPassword("user", "1");
		System.out.println(user.get());
		Assertions.assertNull(user.get());
	}

}
