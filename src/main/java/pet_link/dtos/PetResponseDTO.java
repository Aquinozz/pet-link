package pet_link.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pet_link.models.PetModel;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PetResponseDTO {

    private Long id;
    private String nome;
    private String especie;
    private String raca;
    private Integer idade;
    private TutorResponseDTO tutor;

    public PetResponseDTO(PetModel pet) {
        if (pet != null) {
            this.id = pet.getId();
            this.nome = pet.getNome();
            this.especie = pet.getEspecie();
            this.raca = pet.getRaca();
            this.idade = pet.getIdade();
            if (pet.getTutor() != null) {
                this.tutor = new TutorResponseDTO(pet.getTutor());
            }
        }
    }
}