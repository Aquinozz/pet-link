package pet_link.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pet_link.models.AppointmentModel;

import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<AppointmentModel, Long> {

    List<AppointmentModel> findByTutor_Id(Long tutorId);

    List<AppointmentModel> findByPrestador_Id(Long prestadorId);

    Optional<AppointmentModel> findByIdAndTutor_Id(Long id, Long tutorId);
}