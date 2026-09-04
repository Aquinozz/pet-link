package pet_link.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pet_link.enums.PrestadorType;
import pet_link.models.PrestadorModel;
import pet_link.models.Users;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PrestadorResponseDTO {

    private Long id;
    private String nomePrestador;
    private String email;
    private String telefone;
    private Double avaliacaoMedia;
    private String servicos;
    private String descricao;
    private String cidade;
    private String bairro;
    private PrestadorType type;
    private String horarioFuncionamento;
    private Double latitude;
    private Double longitude;
    private Double distanciaKm;
    private String fotoUrl;
    private String bannerUrl;

    public PrestadorResponseDTO(Users prestador) {
        if (prestador != null) {
            this.id = prestador.getId();
            this.nomePrestador = prestador.getNome();
            this.email = prestador.getEmail();

            if (prestador.getPrestador() != null) {
                this.avaliacaoMedia = prestador.getPrestador().getAvaliacaoMedia();
                this.telefone = prestador.getPrestador().getTelefone();
                this.servicos = prestador.getPrestador().getServicos();
                this.descricao = prestador.getPrestador().getDescricao();
                this.cidade = prestador.getPrestador().getCidade();
                this.bairro = prestador.getPrestador().getBairro();
                this.type = prestador.getPrestador().getType();
                this.horarioFuncionamento = prestador.getPrestador().getHorarioFuncionamento();
                this.latitude = prestador.getPrestador().getLatitude();
                this.longitude = prestador.getPrestador().getLongitude();
                this.fotoUrl = prestador.getPrestador().getFotoUrl();
                this.bannerUrl = prestador.getPrestador().getBannerUrl();
            } else {
                this.avaliacaoMedia = 0.0;
            }
        }
    }

    public static PrestadorResponseDTO from(PrestadorModel prestador) {
        if (prestador == null || prestador.getUser() == null) {
            return null;
        }
        PrestadorResponseDTO dto = new PrestadorResponseDTO(prestador.getUser());
        return dto;
    }
}