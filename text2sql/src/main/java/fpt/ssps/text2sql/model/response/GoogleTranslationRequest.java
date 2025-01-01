package fpt.ssps.text2sql.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GoogleTranslationRequest {
    private String vietnameseText;
    private String targetLanguage;
}