package fpt.ssps.text2sql.repo;

import fpt.ssps.text2sql.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query(value = "SELECT * FROM user WHERE BINARY username = :username AND BINARY password = :password", nativeQuery = true)
    User findByUsernameAndPassword(String username, String password);
}