package pet_link.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponseDTO {

    private Long id;
    private LocalDateTime dataHora;
    private String status;
    private String servico;
    private TutorResponseDTO tutor;
    private PetResponseDTO pet;
    private PrestadorResponseDTO prestador;
}