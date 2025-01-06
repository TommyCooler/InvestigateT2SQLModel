package fpt.ssps.text2sql.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import fpt.ssps.text2sql.model.Store;
import fpt.ssps.text2sql.service.iservice.IStoreService;

@RestController
@RequestMapping("/store")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class StoreController {

    @Autowired
    private IStoreService storeService;

    @GetMapping("/all")
    public ResponseEntity<List<Store>> getAllStores(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String district
    ) {
        List<Store> stores = storeService.getAllStores(city, district);
        return ResponseEntity.ok(stores);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Store>> searchStores(@RequestParam String keyword) {
        List<Store> stores = storeService.searchStores(keyword);
        return ResponseEntity.ok(stores);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Store> getStoreById(@PathVariable Long id) {
        Store store = storeService.getStoreById(id);
        return ResponseEntity.ok(store);
    }
}