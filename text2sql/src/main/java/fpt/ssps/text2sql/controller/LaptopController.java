package fpt.ssps.text2sql.controller;

import fpt.ssps.text2sql.model.Laptop;
import fpt.ssps.text2sql.model.response.GoogleTranslationRequest;
import fpt.ssps.text2sql.service.GoogleTranslationService;
import fpt.ssps.text2sql.service.PythonApiService;
import fpt.ssps.text2sql.service.iservice.ILaptopService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
//@RequestMapping(name = "/api/laptops")
public class LaptopController {

    @Autowired
    private ILaptopService iLaptopService;

    @GetMapping("/laptops")
    public ResponseEntity<List<Laptop>> getAllLaptops() {
        List<Laptop> laptopList = iLaptopService.getLaptops();
        return ResponseEntity.ok(laptopList);
    }

    @Autowired
    private fpt.ssps.text2sql.service.LaptopService LaptopService;

    @Autowired
    private GoogleTranslationService googleTranslationService;

    // Endpoint tìm kiếm sản phẩm theo từ khóa
    @GetMapping("/search")
    public ResponseEntity<List<Laptop>> searchLaptops(@RequestParam String keyword) {
        List<Laptop> laptops = LaptopService.searchLaptops(keyword);
        return new ResponseEntity<>(laptops, HttpStatus.OK);
    }


    // // Endpoint lấy sản phẩm theo ID
     @GetMapping("/{id}")
     public ResponseEntity<?> getProductById(@PathVariable Long id) {
        Laptop laptops = LaptopService.getById(id);
         return new ResponseEntity<>(laptops, HttpStatus.OK);
     }

    @Autowired
    private PythonApiService pythonApiService;

    // Endpoint tìm kiếm sản phẩm theo từ khóa
    @PostMapping("/searchByNLQ")
    public ResponseEntity<List<Laptop>> searchProductsByQuery(@RequestBody GoogleTranslationRequest request) {
        // Bước 1: Dịch câu truy vấn sang tiếng Anh
        String translatedQuery = googleTranslationService.translate(request.getVietnameseText(), "en").getTranslated();

        // Bước 2: Gửi câu truy vấn đã dịch đến Python để sinh câu SQL
        String sqlQuery = pythonApiService.generateSQLQuery(translatedQuery);

        // Bước 3: Thực thi câu SQL trong cơ sở dữ liệu
        List<Laptop> laptops = LaptopService.searchLaptopsBySQL(sqlQuery);

        return new ResponseEntity<>(laptops, HttpStatus.OK);
    }
}

