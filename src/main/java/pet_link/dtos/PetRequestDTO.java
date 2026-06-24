package pet_link.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PetRequestDTO {

    @NotBlank
    private String nome;

    @NotBlank
    private String especie;

    @NotBlank
    private String raca;

    @NotNull
    private Integer idade;

    @NotNull
    private Long tutorId;
}
