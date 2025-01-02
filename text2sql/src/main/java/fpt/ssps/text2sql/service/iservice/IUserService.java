package fpt.ssps.text2sql.service.iservice;

import fpt.ssps.text2sql.model.User;

public interface IUserService {
    User login(String username, String password);
}
