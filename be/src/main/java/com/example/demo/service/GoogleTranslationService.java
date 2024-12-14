package com.example.demo.service;

import com.example.demo.models.GoogleTranslationResponse;
import com.google.cloud.translate.Translate;
import com.google.cloud.translate.TranslateOptions;
import com.google.cloud.translate.Translation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GoogleTranslationService {

    @Value("${google.project.key}")
    private String apiKey;

    public GoogleTranslationResponse translate(String text, String targetLanguage) {
        // Tạo một đối tượng Translate
        Translate translate = TranslateOptions.newBuilder()
                .setApiKey(apiKey)
                .build()
                .getService();
        // Thực hiện dịch
        Translation translation = translate.translate(
                text,
                Translate.TranslateOption.targetLanguage(targetLanguage)
        );
        GoogleTranslationResponse translationResponse = new GoogleTranslationResponse();
        translationResponse.setTranslated(translation.getTranslatedText());
        // Trả về kết quả dịch
        return translationResponse;
    }
}
