package pet_link.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pet_link.models.AppointmentModel;

public interface AppointmentRepository extends JpaRepository<AppointmentModel, Long> {
}
