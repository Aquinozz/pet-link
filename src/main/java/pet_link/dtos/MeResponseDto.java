package pet_link.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pet_link.enums.PrestadorType;
import pet_link.models.Users;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MeResponseDto {
    private Long id;
    private String nome;
    private String email;
    private String role;
    private Long prestadorModelId;
    private String telefone;
    private String servicos;
    private String descricao;
    private String cidade;
    private String bairro;
    private PrestadorType type;
    private String horarioFuncionamento;

    public MeResponseDto(Users user) {
        this.id = user.getId();
        this.nome = user.getNome();
        this.email = user.getEmail();
        this.role = user.getRoles().iterator().next().getNome();

        if (user.getPrestador() != null) {
            this.prestadorModelId = user.getPrestador().getId();
            this.telefone = user.getPrestador().getTelefone();
            this.servicos = user.getPrestador().getServicos();
            this.descricao = user.getPrestador().getDescricao();
            this.cidade = user.getPrestador().getCidade();
            this.bairro = user.getPrestador().getBairro();
            this.type = user.getPrestador().getType();
            this.horarioFuncionamento = user.getPrestador().getHorarioFuncionamento();
        }
    }
}