package com.example.demo.controller;

import java.util.List;

import com.example.demo.models.Product;
import com.example.demo.models.Store;
import com.example.demo.service.ProductService;

import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stores")
@CrossOrigin(origins = "http://localhost:5173")
public class StoresController {

    @Autowired
    private com.example.demo.service.StoreService StoreService;

    @GetMapping("/search")
    public ResponseEntity<List<Store>> searchStores(@RequestParam String keyword) {
        List<Store> stores = StoreService.searchStores(keyword);
        return new ResponseEntity<>(stores, HttpStatus.OK);
    }

    // Endpoint lấy tất cả sản phẩm
    @GetMapping("/getAllStores")
    public ResponseEntity<List<Store>> getAllStores() {
        List<Store> stores = StoreService.getAllStores();
        return new ResponseEntity<>(stores, HttpStatus.OK);
    }

    // // Endpoint lấy sản phẩm theo ID
     @GetMapping("/{id}")
     public ResponseEntity<?> getStoreById(@PathVariable Long id) {
         Store stores = StoreService.getById(id);
         return new ResponseEntity<>(stores, HttpStatus.OK);
     }
}
