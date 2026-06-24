package pet_link.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pet_link.models.Users;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TutorResponseDTO {
    private Long id;
    private String nome;
    private String email;

    public TutorResponseDTO(Users tutor) {
        if (tutor != null) {
            this.id = tutor.getId();
            this.nome = tutor.getNome();
            this.email = tutor.getEmail();
        }
    }
}