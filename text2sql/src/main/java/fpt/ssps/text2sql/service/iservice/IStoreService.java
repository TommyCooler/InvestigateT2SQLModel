package fpt.ssps.text2sql.service.iservice;

import fpt.ssps.text2sql.model.Store;
import java.util.List;

public interface IStoreService {
    List<Store> getAllStores(String city, String district);
    List<Store> searchStores(String keyword);
    Store getStoreById(Long id);
}