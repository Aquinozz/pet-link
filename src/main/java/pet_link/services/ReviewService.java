package pet_link.services;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pet_link.dtos.ReviewRequestDTO;
import pet_link.dtos.ReviewResponseDTO;
import pet_link.exceptions.ResourceNotFoundException;
import pet_link.models.PrestadorModel;
import pet_link.models.ReviewModel;
import pet_link.models.Users;
import pet_link.repositories.PrestadorRepository;
import pet_link.repositories.ReviewRepository;
import pet_link.repositories.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final PrestadorRepository prestadorRepository;

    public ReviewResponseDTO criar(@Valid ReviewRequestDTO dto) {
        log.info("Criando avaliação para prestador {}", dto.getPrestadorId());

        Users tutor = userRepository.findById(dto.getTutorId())
                .orElseThrow(() -> new ResourceNotFoundException("Tutor com ID " + dto.getTutorId() + " não encontrado."));

        Users prestadorUsuario = userRepository.findById(dto.getPrestadorId())
                .orElseThrow(() -> new ResourceNotFoundException("Profissional com ID " + dto.getPrestadorId() + " não encontrado."));

        if (prestadorUsuario.getPrestador() == null) {
            throw new ResourceNotFoundException("Prestador vinculado ao usuário com ID " + dto.getPrestadorId() + " não encontrado.");
        }

        ReviewModel review = new ReviewModel();
        review.setTutor(tutor);
        review.setPrestador(prestadorUsuario.getPrestador());
        review.setNota(dto.getNota());
        review.setComentario(dto.getComentario());
        review.setDataCriacao(LocalDateTime.now());

        ReviewModel reviewSalva = reviewRepository.save(review);

        atualizarMediaPrestador(prestadorUsuario.getPrestador());

        log.info("Review criada com sucesso. Id={}", reviewSalva.getId());

        return new ReviewResponseDTO(reviewSalva);
    }

    public List<ReviewResponseDTO> listarTodos() {
        return reviewRepository.findAll().stream()
                .map(ReviewResponseDTO::new)
                .toList();
    }

    public void deletar(Long id) {
        ReviewModel review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Avaliação com ID " + id + " não encontrada."));

        PrestadorModel prestador = review.getPrestador();

        reviewRepository.delete(review);

        atualizarMediaPrestador(prestador);
        log.info("Review ID {} deletada com sucesso.", id);
    }

    private void atualizarMediaPrestador(PrestadorModel prestador) {
        List<ReviewModel> reviews = reviewRepository.findByPrestadorId(prestador.getId());

        double media = reviews.stream()
                .mapToInt(ReviewModel::getNota)
                .average()
                .orElse(0.0);

        prestador.setAvaliacaoMedia(media);
        prestadorRepository.save(prestador);

        log.info("Média do prestador {} atualizada para {}", prestador.getId(), media);
    }
}