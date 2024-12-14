package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowire;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Store;

@Service
public class StoreService {

    @Autowired
    private com.example.demo.repository.StoresRepository StoresRepository;

    public List<Store> searchStores(String keyword) {
        return StoresRepository.findByTitleContainingIgnoreCase(keyword);
    }
    // Phương thức lấy tất cả các cửa hàng
    public List<Store> getAllStores() {
        return StoresRepository.findAll();
    }
    
    public Store getById(Long id){
        return StoresRepository.findById(id).get();
    }

}
