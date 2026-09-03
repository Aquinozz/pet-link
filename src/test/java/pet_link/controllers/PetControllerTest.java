package pet_link.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;
import pet_link.config.JwtAuthenticationFilter;
import pet_link.config.SecurityConfiguration;
import pet_link.config.TokenProvider;
import pet_link.dtos.PetResponseDTO;
import pet_link.services.PetService;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PetController.class)
@Import({SecurityConfiguration.class, JwtAuthenticationFilter.class})
class PetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TokenProvider tokenProvider;

    @MockBean
    private UserDetailsService userDetailsService;

    @MockBean
    private PetService petService;

    private HttpHeaders auth(String email, String... roles) {
        when(tokenProvider.getUsername(anyString())).thenReturn(email);
        when(tokenProvider.getRoles(anyString())).thenReturn(ControllerTestSupport.roles(roles));
        when(userDetailsService.loadUserByUsername(email))
                .thenReturn(ControllerTestSupport.userDetails(email, roles));
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth("token-de-teste");
        return headers;
    }

    @Test
    void listar_semToken_retorna401() throws Exception {
        mockMvc.perform(get("/pets"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void listar_tutor_retorna200() throws Exception {
        when(petService.listarTodos("tutor@email.com")).thenReturn(java.util.List.of());

        mockMvc.perform(get("/pets").headers(auth("tutor@email.com", "ROLE_TUTOR")))
                .andExpect(status().isOk());

        verify(petService).listarTodos("tutor@email.com");
    }

    @Test
    void listar_prestador_retorna403() throws Exception {
        mockMvc.perform(get("/pets").headers(auth("prof@email.com", "ROLE_PROFISSIONAL")))
                .andExpect(status().isForbidden());
    }

    @Test
    void listar_admin_retorna200() throws Exception {
        when(petService.listarTodos("admin@email.com")).thenReturn(java.util.List.of());

        mockMvc.perform(get("/pets").headers(auth("admin@email.com", "ROLE_ADMIN")))
                .andExpect(status().isOk());
    }

    @Test
    void cadastrar_semToken_retorna401() throws Exception {
        mockMvc.perform(post("/pets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Rex\",\"especie\":\"Cachorro\",\"raca\":\"Labrador\",\"idade\":3,\"tutorId\":1}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void cadastrar_tutor_retorna201() throws Exception {
        when(petService.criar(any(), eq("tutor@email.com")))
                .thenReturn(new PetResponseDTO(1L, "Rex", "Cachorro", "Labrador", 3, null, null));

        mockMvc.perform(post("/pets")
                        .headers(auth("tutor@email.com", "ROLE_TUTOR"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Rex\",\"especie\":\"Cachorro\",\"raca\":\"Labrador\",\"idade\":3,\"tutorId\":1}"))
                .andExpect(status().isCreated());
    }

    @Test
    void cadastrar_bodyInvalido_retorna400() throws Exception {
        mockMvc.perform(post("/pets")
                        .headers(auth("tutor@email.com", "ROLE_TUTOR"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"\",\"especie\":\"Cachorro\",\"raca\":\"Labrador\",\"idade\":3,\"tutorId\":1}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deletar_semToken_retorna401() throws Exception {
        mockMvc.perform(delete("/pets/1"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void deletar_tutor_retorna204() throws Exception {
        mockMvc.perform(delete("/pets/1").headers(auth("tutor@email.com", "ROLE_TUTOR")))
                .andExpect(status().isNoContent());

        verify(petService).deletar(1L, "tutor@email.com");
    }
}