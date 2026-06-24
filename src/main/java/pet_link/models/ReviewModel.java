package pet_link.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "reviews")
public class ReviewModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "tutor_id", nullable = false)
    private Users tutor;

    @ManyToOne
    @JoinColumn(name = "prestador_id", nullable = false)
    private PrestadorModel prestador;

    @Column(nullable = false)
    private Integer nota;

    private String comentario;

    private LocalDateTime dataCriacao;
}