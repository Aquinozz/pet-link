package pet_link.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pet_link.models.Users;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<Users, Long> {

    Optional<Users> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("""
            select distinct u from Users u
            left join fetch u.prestador
            where u.id in (select uu.id from Users uu join uu.roles r where r.nome = :role)
            """)
    List<Users> findAllByRoleComPrestador(@Param("role") String role);
}