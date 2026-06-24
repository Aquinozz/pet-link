
package pet_link.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewRequestDTO {

    @NotNull
    private Long tutorId;

    @NotNull
    private Long prestadorId;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer nota;

    private String comentario;
}