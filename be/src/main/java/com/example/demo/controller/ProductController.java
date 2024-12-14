package com.example.demo.controller;

import com.example.demo.models.GoogleTranslationRequest;
import com.example.demo.models.Product;
import com.example.demo.service.GoogleTranslationService;
import com.example.demo.service.ProductService;
import com.example.demo.service.PythonApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private com.example.demo.service.ProductService ProductService;

    @Autowired
    private GoogleTranslationService googleTranslationService;

    // Endpoint tìm kiếm sản phẩm theo từ khóa
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {
        List<Product> products = ProductService.searchProducts(keyword);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // Endpoint lấy tất cả sản phẩm
    @GetMapping("/getAllProducts")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = ProductService.getAllProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // // Endpoint lấy sản phẩm theo ID
     @GetMapping("/{id}")
     public ResponseEntity<?> getProductById(@PathVariable Long id) {
         Product products = ProductService.getById(id);
         return new ResponseEntity<>(products, HttpStatus.OK);
     }

    @Autowired
    private PythonApiService pythonApiService;

    // Endpoint tìm kiếm sản phẩm theo từ khóa
    @PostMapping("/searchByNLQ")
    public ResponseEntity<List<Product>> searchProductsByQuery(@RequestBody GoogleTranslationRequest request) {
        // Bước 1: Dịch câu truy vấn sang tiếng Anh
        String translatedQuery = googleTranslationService.translate(request.getVietnameseText(), "en").getTranslated();

        // Bước 2: Gửi câu truy vấn đã dịch đến Python để sinh câu SQL
        String sqlQuery = pythonApiService.generateSQLQuery(translatedQuery);

        // Bước 3: Thực thi câu SQL trong cơ sở dữ liệu
        List<Product> products = ProductService.searchProductsBySQL(sqlQuery);

        return new ResponseEntity<>(products, HttpStatus.OK);
    }
}
