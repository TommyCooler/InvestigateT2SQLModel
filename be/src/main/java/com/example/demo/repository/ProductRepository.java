package com.example.demo.repository;

import com.example.demo.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Tìm kiếm sản phẩm theo tiêu đề
    @Query(value = "", nativeQuery = true)
    List<Product> findByTitleContainingIgnoreCase(String keyword);
}

