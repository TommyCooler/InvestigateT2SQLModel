package fpt.ssps.text2sql.repo;

import fpt.ssps.text2sql.model.StoreLaptop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoreLaptopRepository extends JpaRepository<StoreLaptop, Long> {
}
