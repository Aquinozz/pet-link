package pet_link.repositories;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import pet_link.models.PetModel;

import java.util.List;
import java.util.Optional;

public interface PetRepository extends JpaRepository<PetModel, Long> {

    List<PetModel> findByTutor_Id(Long tutorId);

    @Override
    @EntityGraph(attributePaths = {"tutor"})
    List<PetModel> findAll();

    Optional<PetModel> findByIdAndTutor_Id(Long id, Long tutorId);
}