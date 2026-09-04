package pet_link.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pet_link.enums.PrestadorType;
import pet_link.models.PrestadorModel;

import java.util.List;

public interface PrestadorRepository extends JpaRepository<PrestadorModel, Long> {

    List<PrestadorModel> findByCidadeIgnoreCase(String cidade);

    List<PrestadorModel> findByCidadeIgnoreCaseAndBairroIgnoreCase(
            String cidade,
            String bairro
    );

    List<PrestadorModel> findByType(PrestadorType type);

    List<PrestadorModel> findByCidadeIgnoreCaseAndType(
            String cidade,
            PrestadorType type
    );

    List<PrestadorModel> findByCidadeIgnoreCaseAndBairroIgnoreCaseAndType(
            String cidade,
            String bairro,
            PrestadorType type
    );

    List<PrestadorModel> findByLatitudeIsNull();

    @Query("""
        select p from PrestadorModel p
        where p.latitude is not null
          and p.longitude is not null
          and p.latitude between :latMin and :latMax
          and p.longitude between :lngMin and :lngMax
          """)
    List<PrestadorModel> findByBoundingBox(
            @Param("latMin") double latMin,
            @Param("latMax") double latMax,
            @Param("lngMin") double lngMin,
            @Param("lngMax") double lngMax
    );

    @Query(value = """
        select p.* from prestador_model p
        where p.avaliacao_media is not null and p.avaliacao_media > 0
        order by p.avaliacao_media desc
        limit :limit
        """, nativeQuery = true)
    List<PrestadorModel> findTopByAvaliacaoMediaDesc(@Param("limit") int limit);
}
