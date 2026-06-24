package pet_link.dtos;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewResponseDTO {

    private Long id;
    private Integer nota;
    private String comentario;
    private LocalDateTime dataCriacao;

    private Long tutorId;
    private String tutorNome;

    private Long prestadorId;
    private String prestadorNome;
    private String prestadorCidade;
    private String prestadorBairro;

    public ReviewResponseDTO(pet_link.models.ReviewModel review) {
        this.id = review.getId();
        this.nota = review.getNota();
        this.comentario = review.getComentario();
        this.dataCriacao = review.getDataCriacao();

        if (review.getTutor() != null) {
            this.tutorId = review.getTutor().getId();
            this.tutorNome = review.getTutor().getNome();
        }

        if (review.getPrestador() != null) {
            this.prestadorId = review.getPrestador().getId();
            this.prestadorNome = review.getPrestador().getNome();
            this.prestadorCidade = review.getPrestador().getCidade();
            this.prestadorBairro = review.getPrestador().getBairro();
        }
    }
}