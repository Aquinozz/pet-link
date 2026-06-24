package pet_link.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import pet_link.enums.AppointmentStatus;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class AppointmentModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "tutor_id")
    private Users tutor;

    @ManyToOne
    @JoinColumn(name = "pet_id")
    private PetModel pet;

    @ManyToOne
    @JoinColumn(name = "prestador_id")
    private Users prestador;

    private LocalDateTime dataHora;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    @Column
    private String servico;
}