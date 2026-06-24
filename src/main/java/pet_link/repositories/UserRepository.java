package pet_link.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pet_link.models.Users;

import java.util.Optional;

public interface UserRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByEmail(String email);

    boolean existsByEmail(String email);
}