package fpt.ssps.text2sql.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import fpt.ssps.text2sql.model.Store;
import fpt.ssps.text2sql.repo.StoreRepository;
import fpt.ssps.text2sql.service.iservice.IStoreService;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StoreService implements IStoreService {

    @Autowired
    private StoreRepository storeRepository;

    @Override
    public List<Store> getAllStores(String city, String district) {
        List<Store> stores = storeRepository.findAll();
        
        // Apply filters if provided
        if (city != null && !city.isEmpty()) {
            stores = stores.stream()
                .filter(store -> store.getCity().equalsIgnoreCase(city))
                .collect(Collectors.toList());
        }
        
        if (district != null && !district.isEmpty()) {
            stores = stores.stream()
                .filter(store -> store.getDistrict().equalsIgnoreCase(district))
                .collect(Collectors.toList());
        }
        
        return stores;
    }

    @Override
    public List<Store> searchStores(String keyword) {
        return storeRepository.findByNameContainingIgnoreCaseOrAddressContainingIgnoreCaseOrCityContainingIgnoreCaseOrDistrictContainingIgnoreCase(
            keyword, keyword, keyword, keyword
        );
    }

    @Override
    public Store getStoreById(Long id) {
        return storeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Store not found with id: " + id));
    }
}