package com.example.demo.controller;

import com.example.demo.models.GoogleTranslationRequest;
import com.example.demo.models.GoogleTranslationResponse;
import com.example.demo.service.GoogleTranslationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/translate/google")
public class GoogleTranslationController {

    @Autowired
    private GoogleTranslationService translationService;

    @PostMapping("/googleTranslate")
    public ResponseEntity<GoogleTranslationResponse> translate(@RequestBody GoogleTranslationRequest request) {
        GoogleTranslationResponse response = translationService.translate(request.getVietnameseText(), request.getTargetLanguage());
        return ResponseEntity.ok(response);
    }
}
