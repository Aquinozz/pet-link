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

    // Retorna usuários ordenados do mais próximo ao mais distante dentro de um raio (em metros)
    @Query(value = "SELECT * FROM users u WHERE " +
            "ST_DWithin(u.localizacao, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326), :raioMetros) " +
            "ORDER BY ST_Distance(u.localizacao, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326))",
            nativeQuery = true)
    List<Users> buscarPessoasProximas(@Param("lat") double lat,
                                      @Param("lng") double lng,
                                      @Param("raioMetros") double raioMetros);
}