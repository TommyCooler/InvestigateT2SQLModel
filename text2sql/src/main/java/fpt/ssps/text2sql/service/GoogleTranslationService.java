package fpt.ssps.text2sql.service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.google.cloud.translate.Translate;
import com.google.cloud.translate.TranslateOptions;
import com.google.cloud.translate.Translation;

import fpt.ssps.text2sql.model.response.GoogleTranslationResponse;
import fpt.ssps.text2sql.service.iservice.IGoogleTranslationService;

@Service
public class GoogleTranslationService implements IGoogleTranslationService{

    @Value("${google.project.key}")
    private String apiKey;

    @Override
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