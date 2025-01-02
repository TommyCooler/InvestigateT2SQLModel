package fpt.ssps.text2sql.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import fpt.ssps.text2sql.service.iservice.IPythonApiService;


@Service
public class PythonApiService implements IPythonApiService{

    private final String pythonApiUrl = "http://localhost:5000/generate_sql";  // URL đến Python API

    @Override
    public String generateSQLQuery(String queryCondition) {
        // Tạo đối tượng RestTemplate để gọi API Python
        RestTemplate restTemplate = new RestTemplate();

        // Tạo dữ liệu gửi đến Python API dưới dạng JSON
        String requestPayload = "{\"query\": \"" + queryCondition + "\"}";

        // Tạo HttpHeaders để thiết lập Content-Type là application/json
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Tạo HttpEntity chứa cả headers và body
        HttpEntity<String> entity = new HttpEntity<>(requestPayload, headers);

        // Gửi POST request và nhận lại câu SQL
        ResponseEntity<String> response = restTemplate.exchange(pythonApiUrl, HttpMethod.POST, entity, String.class);

        // Trả về câu SQL nhận được từ Python API
        return response.getBody();
    }


}
