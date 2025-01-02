package fpt.ssps.text2sql.service.iservice;

import fpt.ssps.text2sql.model.response.GoogleTranslationResponse;

public interface IGoogleTranslationService {
    GoogleTranslationResponse translate(String text, String targetLanguage);
}
