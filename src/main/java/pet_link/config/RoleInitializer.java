package pet_link.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import pet_link.models.RolesEntity;
import pet_link.repositories.RolesRepository;

import java.util.List;

@Component
@RequiredArgsConstructor
public class RoleInitializer implements CommandLineRunner {

    private final RolesRepository rolesRepository;

    @Override
    public void run(String... args) {

        if (rolesRepository.count() == 0) {

            RolesEntity tutor = new RolesEntity();
            tutor.setNome("ROLE_TUTOR");

            RolesEntity prestador = new RolesEntity();
            prestador.setNome("ROLE_PRESTADOR");

            RolesEntity admin = new RolesEntity();
            admin.setNome("ROLE_ADMIN");

            rolesRepository.saveAll(
                    List.of(tutor, prestador, admin)
            );
        }
    }
}