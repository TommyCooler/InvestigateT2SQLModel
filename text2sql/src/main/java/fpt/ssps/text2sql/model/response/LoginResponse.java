package fpt.ssps.text2sql.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import fpt.ssps.text2sql.model.Role;

@Data
@AllArgsConstructor
public class LoginResponse {
    private Long id;
    private String username;
    private Role role;
    private boolean vip;
    private String message;
}