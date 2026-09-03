package pet_link.repositories;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import pet_link.models.AppointmentModel;

import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<AppointmentModel, Long> {

    @EntityGraph(attributePaths = {"tutor", "pet", "pet.tutor", "prestador"})
    List<AppointmentModel> findByTutor_Id(Long tutorId);

    @EntityGraph(attributePaths = {"tutor", "pet", "pet.tutor", "prestador"})
    List<AppointmentModel> findByPrestador_Id(Long prestadorId);

    @Override
    @EntityGraph(attributePaths = {"tutor", "pet", "pet.tutor", "prestador"})
    List<AppointmentModel> findAll();

    Optional<AppointmentModel> findByIdAndTutor_Id(Long id, Long tutorId);
}