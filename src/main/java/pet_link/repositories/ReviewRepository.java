package pet_link.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pet_link.models.ReviewModel;

import java.util.List;

public interface ReviewRepository extends JpaRepository<ReviewModel, Long> {

    List<ReviewModel> findByPrestadorId(Long prestadorId);
}
