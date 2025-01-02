package fpt.ssps.text2sql.service.iservice;

import fpt.ssps.text2sql.model.Laptop;

import java.util.List;

public interface ILaptopService {

    List<Laptop> getLaptops();

    List<Laptop> searchLaptops(String keyword);

    Laptop getById(Long id);

    List<Laptop> searchLaptopsBySQL(String sqlQuery);
}
