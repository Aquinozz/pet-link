package pet_link.controllers;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Arrays;

final class ControllerTestSupport {

    private ControllerTestSupport() {
    }

    static UserDetails userDetails(String email, String... roles) {
        return new User(email, "{noop}123456",
                Arrays.stream(roles).map(SimpleGrantedAuthority::new).toList());
    }
}