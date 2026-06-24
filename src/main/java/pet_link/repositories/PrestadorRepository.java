package pet_link.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
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
}
