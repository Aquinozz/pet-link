package pet_link.repositories;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import pet_link.models.ReviewModel;

import java.util.List;

public interface ReviewRepository extends JpaRepository<ReviewModel, Long> {

    @EntityGraph(attributePaths = {"tutor", "prestador", "agendamento"})
    List<ReviewModel> findByPrestadorId(Long prestadorId);

    @EntityGraph(attributePaths = {"tutor", "prestador", "agendamento"})
    List<ReviewModel> findByTutor_Id(Long tutorId);

    @EntityGraph(attributePaths = {"tutor", "prestador", "agendamento"})
    List<ReviewModel> findByPrestador_User_Id(Long userId);

    @Override
    @EntityGraph(attributePaths = {"tutor", "prestador", "agendamento"})
    List<ReviewModel> findAll();

    boolean existsByAgendamento_Id(Long agendamentoId);
}