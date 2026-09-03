package pet_link.controllers;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Arrays;
import java.util.List;

final class ControllerTestSupport {

    private ControllerTestSupport() {
    }

    static UserDetails userDetails(String email, String... roles) {
        return new User(email, "{noop}123456",
                Arrays.stream(roles).map(SimpleGrantedAuthority::new).toList());
    }

    static List<GrantedAuthority> roles(String... roles) {
        return Arrays.stream(roles)
                .<GrantedAuthority>map(SimpleGrantedAuthority::new)
                .toList();
    }
}