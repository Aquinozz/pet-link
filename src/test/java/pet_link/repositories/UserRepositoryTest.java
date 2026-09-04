package pet_link.repositories;

import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import pet_link.models.PrestadorModel;
import pet_link.models.RolesEntity;
import pet_link.models.Users;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest(properties = {
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "spring.flyway.enabled=false"
})
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RolesRepository rolesRepository;

    @Autowired
    private PrestadorRepository prestadorRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void findAllByRoleComPrestador_retornaApenasProfissionaisComPerfil() {
        RolesEntity roleTutor = rolesRepository.save(new RolesEntity("ROLE_TUTOR"));
        RolesEntity roleProfissional = rolesRepository.save(new RolesEntity("ROLE_PROFISSIONAL"));

        userRepository.save(Users.builder()
                .nome("Tutor")
                .email("tutor@test.com")
                .senha("x")
                .roles(Set.of(roleTutor))
                .build());

        Users profissional = userRepository.save(Users.builder()
                .nome("Clínica Teste")
                .email("clinica@test.com")
                .senha("x")
                .roles(Set.of(roleProfissional))
                .build());

        PrestadorModel perfil = new PrestadorModel();
        perfil.setNome("Clínica Teste");
        perfil.setAvaliacaoMedia(0.0);
        perfil.setUser(profissional);
        prestadorRepository.save(perfil);

        entityManager.flush();
        entityManager.clear();

        List<Users> resultado = userRepository.findAllByRoleComPrestador("ROLE_PROFISSIONAL");

        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).getEmail()).isEqualTo("clinica@test.com");
        assertThat(resultado.get(0).getPrestador()).isNotNull();
        assertThat(resultado.get(0).getPrestador().getNome()).isEqualTo("Clínica Teste");
    }
}