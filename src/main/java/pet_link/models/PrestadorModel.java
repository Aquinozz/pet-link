package pet_link.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import pet_link.enums.PrestadorType;

@Getter
@Setter
@Entity
public class PrestadorModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Enumerated(EnumType.STRING)
    private PrestadorType type;

    private String descricao;

    private String cidade;

    private String bairro;

    private String servicos;

    private String telefone;

    private Double avaliacaoMedia;

    @Column
    private String horarioFuncionamento;

    private Double latitude;

    private Double longitude;

    private String fotoUrl;

    private String bannerUrl;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private Users user;
}