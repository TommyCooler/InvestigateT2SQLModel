package fpt.ssps.text2sql.service;

import fpt.ssps.text2sql.model.Laptop;
import fpt.ssps.text2sql.repo.LaptopRepository;
import fpt.ssps.text2sql.service.iservice.ILaptopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.List;

@Service
public class LaptopService implements ILaptopService {

    @Autowired
    private LaptopRepository laptopRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public List<Laptop> getLaptops() {
        return laptopRepository.findAll();
    }

    @Override
    public List<Laptop> searchLaptops(String keyword) {
        return laptopRepository.findByNameContainingIgnoreCase(keyword);
    }

    @Override
    public Laptop getById(Long id) {
        return laptopRepository.findById(id).get();
    }

    @Override
    public List<Laptop> searchLaptopsBySQL(String sqlQuery) {
        System.out.println("Original query: " + sqlQuery);
        
        String sqlClean = extractSqlQuery(sqlQuery);
        System.out.println("Cleaned query: " + sqlClean);

        if (!isValidQuery(sqlClean)) {
            throw new IllegalArgumentException("Invalid or unsafe query");
        }

        try {
            return jdbcTemplate.query(sqlClean, (rs, rowNum) -> mapRowToLaptopDynamic(rs));
        } catch (Exception e) {
            throw new RuntimeException("Error executing query: " + e.getMessage());
        }
    }

    private Laptop mapRowToLaptopDynamic(ResultSet rs) throws SQLException {
        Laptop laptop = new Laptop();
        ResultSetMetaData metaData = rs.getMetaData();
        int columnCount = metaData.getColumnCount();

        for (int i = 1; i <= columnCount; i++) {
            String columnName = metaData.getColumnName(i).toLowerCase();
            try {
                // Lấy field từ model Laptop dựa trên tên cột
                Field field = findField(Laptop.class, columnName);
                if (field != null) {
                    field.setAccessible(true);
                    Object value = getValueByType(rs, i, field.getType());
                    field.set(laptop, value);
                }
            } catch (Exception e) {
                System.out.println("Could not map column: " + columnName);
            }
        }
        return laptop;
    }

    private Field findField(Class<?> clazz, String fieldName) {
        // Tìm kiếm field trong class và superclass
        while (clazz != null) {
            for (Field field : clazz.getDeclaredFields()) {
                if (field.getName().equalsIgnoreCase(fieldName)) {
                    return field;
                }
            }
            clazz = clazz.getSuperclass();
        }
        return null;
    }

    private Object getValueByType(ResultSet rs, int index, Class<?> type) throws SQLException {
        if (type.equals(Long.class) || type.equals(long.class)) {
            return rs.getLong(index);
        } else if (type.equals(Integer.class) || type.equals(int.class)) {
            return rs.getInt(index);
        } else if (type.equals(Double.class) || type.equals(double.class)) {
            return rs.getDouble(index);
        } else if (type.equals(Float.class) || type.equals(float.class)) {
            return rs.getFloat(index);
        } else if (type.equals(Boolean.class) || type.equals(boolean.class)) {
            return rs.getBoolean(index);
        } else {
            return rs.getString(index);
        }
    }

    private String extractSqlQuery(String input) {
        try {
            int thirdQuoteIndex = findNthOccurrence(input, '"', 3);
            int fourthQuoteIndex = findNthOccurrence(input, '"', 4);

            if (thirdQuoteIndex == -1 || fourthQuoteIndex == -1) {
                throw new IllegalArgumentException("Invalid SQL query format");
            }

            String query = input.substring(thirdQuoteIndex + 1, fourthQuoteIndex).trim();
            System.out.println("Extracted query: " + query);
            return query;
        } catch (Exception e) {
            throw new IllegalArgumentException("Error extracting SQL query: " + e.getMessage());
        }
    }

    private boolean isValidQuery(String query) {
        if (query == null || query.trim().isEmpty()) {
            return false;
        }

        String upperQuery = query.toUpperCase().trim();
        
        if (!upperQuery.startsWith("SELECT")) {
            System.out.println("Query must start with SELECT");
            return false;
        }

        String[] unsafeKeywords = {
            "DELETE", "DROP", "INSERT", "UPDATE", "TRUNCATE", 
            "ALTER", "CREATE", "RENAME", "REPLACE"
        };

        for (String keyword : unsafeKeywords) {
            if (upperQuery.contains(keyword)) {
                System.out.println("Query contains unsafe keyword: " + keyword);
                return false;
            }
        }

        return true;
    }

    private int findNthOccurrence(String str, char c, int n) {
        int pos = -1;
        for (int i = 0; i < n && pos < str.length(); i++) {
            pos = str.indexOf(c, pos + 1);
            if (pos == -1) {
                System.out.println("Could not find occurrence " + n + " of character '" + c + "'");
                return -1;
            }
        }
        return pos;
    }
}