package fpt.ssps.text2sql.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import fpt.ssps.text2sql.model.response.GoogleTranslationRequest;
import fpt.ssps.text2sql.model.response.GoogleTranslationResponse;

@RestController
//@RequestMapping("/api/translate/google")
public class GoogleTranslationController {

    @Autowired
    private fpt.ssps.text2sql.service.GoogleTranslationService translationService;

    @PostMapping("/googleTranslate")
    public ResponseEntity<GoogleTranslationResponse> translate(@RequestBody GoogleTranslationRequest request) {
        GoogleTranslationResponse response = translationService.translate(request.getVietnameseText(), request.getTargetLanguage());
        return ResponseEntity.ok(response);
    }
}
