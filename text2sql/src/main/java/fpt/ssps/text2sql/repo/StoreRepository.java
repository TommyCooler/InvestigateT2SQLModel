package fpt.ssps.text2sql.repo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import fpt.ssps.text2sql.model.Store;

@Repository
public interface StoreRepository extends JpaRepository<Store, Long> {
    
    // Search by name, address, city or district
    List<Store> findByNameContainingIgnoreCaseOrAddressContainingIgnoreCaseOrCityContainingIgnoreCaseOrDistrictContainingIgnoreCase(
        String name, String address, String city, String district
    );

    // Find by city
    List<Store> findByCityIgnoreCase(String city);

    // Find by district
    List<Store> findByDistrictIgnoreCase(String district);

    // Find by city and district
    List<Store> findByCityIgnoreCaseAndDistrictIgnoreCase(String city, String district);
}