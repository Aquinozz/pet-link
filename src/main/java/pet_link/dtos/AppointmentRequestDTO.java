package pet_link.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import pet_link.utils.DataUtils;

import java.time.LocalDateTime;

@Data
public class AppointmentRequestDTO {

    @NotNull
    private Long tutorId;

    @NotNull
    private Long petId;

    @NotNull
    private Long prestadorId;


    private String servico;

    @NotNull
    @Schema(
            example = "20/06/2026 15:30:00",
            description = "Data e hora do agendamento"
    )
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime dataHora;
}
