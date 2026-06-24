package pet_link.dtos;

import lombok.Data;

@Data
public class AtualizarPrestadorDto {
    private String telefone;
    private String descricao;
    private String cidade;
    private String bairro;
    private String servicos;
    private String horarioFuncionamento;
}