package fpt.ssps.text2sql.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fpt.ssps.text2sql.model.Laptop;

import java.util.List;

@Repository
public interface LaptopRepository extends JpaRepository<Laptop, Long> {
    List<Laptop> findByTypeContainingIgnoreCase(String keyword);
}

