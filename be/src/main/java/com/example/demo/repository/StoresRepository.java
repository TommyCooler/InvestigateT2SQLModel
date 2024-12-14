package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.models.Store;

@Repository
public interface StoresRepository extends JpaRepository<Store, Long> {
    List<Store> findByTitleContainingIgnoreCase(String keyword);
    
}
