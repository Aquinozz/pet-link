package pet_link.dtos;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class RegisterRequestDto {

    @NotBlank
    private String nome;
    @NotBlank
    private String email;
    @NotBlank
    private String senha;

    @JsonProperty("longitude")
    @JsonAlias({"lng", "lon", "longitude"})
    private Double longitude;

    @JsonProperty("latitude")
    @JsonAlias({"lat", "latitude"})
    private Double latitude;

}