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
import pet_link.dtos.ReviewResponseDTO;
import pet_link.models.ReviewModel;
import pet_link.models.Users;
import pet_link.services.ReviewService;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ReviewController.class)
@Import({SecurityConfiguration.class, JwtAuthenticationFilter.class})
class ReviewControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TokenProvider tokenProvider;

    @MockBean
    private UserDetailsService userDetailsService;

    @MockBean
    private ReviewService reviewService;

    private HttpHeaders auth(String email, String... roles) {
        when(tokenProvider.getUsername(anyString())).thenReturn(email);
        when(userDetailsService.loadUserByUsername(email))
                .thenReturn(ControllerTestSupport.userDetails(email, roles));
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth("token-de-teste");
        return headers;
    }

    private ReviewResponseDTO dto() {
        ReviewModel m = new ReviewModel();
        m.setId(1L);
        m.setNota(5);
        m.setComentario("Ótimo atendimento");
        m.setDataCriacao(LocalDateTime.now());
        m.setTutor(Users.builder().id(1L).nome("Tutor Teste").build());
        return new ReviewResponseDTO(m);
    }

    @Test
    void criar_semToken_retorna401() throws Exception {
        mockMvc.perform(post("/reviews")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"tutorId\":1,\"prestadorId\":2,\"nota\":5,\"comentario\":\"otimo\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void criar_tutor_retorna201() throws Exception {
        when(reviewService.criar(any(), eq("tutor@email.com"))).thenReturn(dto());

        mockMvc.perform(post("/reviews")
                        .headers(auth("tutor@email.com", "ROLE_TUTOR"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"tutorId\":1,\"prestadorId\":2,\"nota\":5,\"comentario\":\"otimo\"}"))
                .andExpect(status().isCreated());
    }

    @Test
    void criar_notaInvalida_retorna400() throws Exception {
        mockMvc.perform(post("/reviews")
                        .headers(auth("tutor@email.com", "ROLE_TUTOR"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"tutorId\":1,\"prestadorId\":2,\"nota\":9,\"comentario\":\"otimo\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void listar_semToken_retorna401() throws Exception {
        mockMvc.perform(get("/reviews"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void listar_tutor_retorna200() throws Exception {
        when(reviewService.listarTodos("tutor@email.com")).thenReturn(java.util.List.of());

        mockMvc.perform(get("/reviews").headers(auth("tutor@email.com", "ROLE_TUTOR")))
                .andExpect(status().isOk());

        verify(reviewService).listarTodos("tutor@email.com");
    }

    @Test
    void deletar_tutor_retorna204() throws Exception {
        mockMvc.perform(delete("/reviews/1").headers(auth("tutor@email.com", "ROLE_TUTOR")))
                .andExpect(status().isNoContent());

        verify(reviewService).deletar(1L, "tutor@email.com");
    }
}