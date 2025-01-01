package fpt.ssps.text2sql.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import fpt.ssps.text2sql.model.response.GoogleTranslationRequest;

@RestController
//@RequestMapping("/api/translate/google")
public class GoogleTranslationController {

    @Autowired
    private fpt.ssps.text2sql.service.GoogleTranslationService translationService;

    @PostMapping("/googleTranslate")
    public ResponseEntity<fpt.ssps.text2sql.model.response.GoogleTranslationResponse> translate(@RequestBody GoogleTranslationRequest request) {
        fpt.ssps.text2sql.model.response.GoogleTranslationResponse response = translationService.translate(request.getVietnameseText(), request.getTargetLanguage());
        return ResponseEntity.ok(response);
    }
}
