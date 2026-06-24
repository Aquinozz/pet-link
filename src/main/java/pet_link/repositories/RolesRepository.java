package pet_link.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pet_link.models.RolesEntity; // Importa a sua nova entidade

import java.util.Optional;


public interface RolesRepository extends JpaRepository<RolesEntity, Long> {


    Optional<RolesEntity> findByNome(String nome);

    boolean existsByNome(String nome);
}
