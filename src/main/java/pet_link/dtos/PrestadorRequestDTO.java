package pet_link.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import pet_link.enums.PrestadorType;

@Data
public class PrestadorRequestDTO {

    @NotNull
    private PrestadorType type;

    @NotBlank
    private String nomePrestador;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String senha;

    @NotBlank
    private String telefone;

    @NotBlank
    private String servicos;

    private String descricao;

    @NotBlank
    private String cidade;

    @NotBlank
    private String bairro;
}