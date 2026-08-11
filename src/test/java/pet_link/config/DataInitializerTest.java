package pet_link.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import pet_link.models.Users;
import pet_link.repositories.UserRepository;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest(properties = "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect")
@Import(DataInitializer.class)
class DataInitializerTest {

    @Autowired
    private DataInitializer dataInitializer;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @TestConfiguration
    static class Config {
        @Bean
        PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }
    }

    @Test
    void run_criaUsuarioAdminComRoleAdmin() throws Exception {
        dataInitializer.run();

        Users admin = userRepository.findByEmail("admin@petlink.com").orElseThrow();

        assertThat(admin.getRoles())
                .hasSize(1)
                .anyMatch(r -> r.getAuthority().equals("ROLE_ADMIN"));
        assertThat(passwordEncoder.matches("admin123", admin.getSenha())).isTrue();
    }
}