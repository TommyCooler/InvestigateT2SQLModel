package fpt.ssps.text2sql.service;

import fpt.ssps.text2sql.model.Laptop;
import fpt.ssps.text2sql.repo.LaptopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LaptopService implements ILaptopService{

    @Autowired
    private LaptopRepository laptopRepository;

    @Override
    public List<Laptop> getLaptops() {
        return laptopRepository.findAll();
    }

    
    public List<Laptop> searchLaptops(String keyword) {
        return laptopRepository.findByTypeContainingIgnoreCase(keyword);
    }

    public Laptop getById(Long id){
        return laptopRepository.findById(id).get();
    }

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Tìm sản phẩm theo câu SQL
    public List<Laptop> searchLaptopsBySQL(String sqlQuery) {
        System.out.println(sqlQuery);
        String sqlClean = extractSqlQuery1(sqlQuery);
        System.out.println(sqlClean);
        if (!sqlClean.toUpperCase().startsWith("SELECT")) {
            throw new IllegalArgumentException("Only SELECT queries are allowed.");
        }
        System.out.println("SELECT * FROM " + sqlClean.split(" FROM ", 2)[1]);
        return jdbcTemplate.query(
                "SELECT * FROM " + sqlClean.split(" FROM ", 2)[1],
                (rs, rowNum) -> new Laptop(
                        rs.getLong("id"),
                        rs.getString("name"),
                        rs.getString("type"),
                        rs.getDouble("price"),
                        rs.getString("cpu"),
                        rs.getString("gpu"),
                        rs.getString("ram"),
                        rs.getString("ssd"),
                        rs.getString("description")
                )
        );
    }

    // Phương thức lọc câu SQL hợp lệ
    private String extractSqlQuery(String input) {
        int thirdQuoteIndex = findNthOccurrence(input, '"', 3);
        if (thirdQuoteIndex == -1) {
            return "Invalid SQL query format";
        }
        int semicolonIndex = input.indexOf(";", thirdQuoteIndex);
        if (semicolonIndex == -1) {
            return "No semicolon found after third quote";
        }
        return input.substring(thirdQuoteIndex + 1, semicolonIndex).trim();
    }

    // Phương thức tìm chỉ mục của dấu ký tự nth trong chuỗi
    private int findNthOccurrence(String str, char c, int n) {
        int pos = -1;
        for (int i = 0; i < n; i++) {
            pos = str.indexOf(c, pos + 1);
            if (pos == -1) {
                return -1;
            }
        }
        return pos;
    }

    // Phương thức lọc câu SQL hợp lệ từ dấu " thứ 3 đến dấu " thứ 4
    private String extractSqlQuery1(String input) {
        // Tìm vị trí của dấu " thứ 3
        int thirdQuoteIndex = findNthOccurrence1(input, '"', 3);
        if (thirdQuoteIndex == -1) {
            return "Invalid SQL query format: No third quote found";
        }

        // Tìm vị trí của dấu " thứ 4
        int fourthQuoteIndex = findNthOccurrence1(input, '"', 4);
        if (fourthQuoteIndex == -1) {
            return "Invalid SQL query format: No fourth quote found";
        }

        // Trả về chuỗi từ dấu " thứ 3 đến dấu " thứ 4
        return input.substring(thirdQuoteIndex + 1, fourthQuoteIndex).trim();
    }

    // Phương thức tìm chỉ mục của dấu ký tự nth trong chuỗi
    private int findNthOccurrence1(String str, char c, int n) {
        int pos = -1;
        for (int i = 0; i < n; i++) {
            pos = str.indexOf(c, pos + 1);
            if (pos == -1) {
                return -1;
            }
        }
        return pos;
    }

}

