package pet_link.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pet_link.models.PetModel;

public interface PetRepository extends JpaRepository<PetModel, Long> {
}
